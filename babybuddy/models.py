# -*- coding: utf-8 -*-

from datetime import datetime

from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.signals import user_logged_in
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.utils.timezone import timedelta
from django.utils.text import format_lazy
from django.utils import translation
from django.utils.translation import gettext_lazy as _

from dateutil.relativedelta import relativedelta

from rest_framework.authtoken.models import Token

import stripe

stripe.api_key = settings.STRIPE_API_KEY

from core.helpers import validate_slug

class Settings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    dashboard_refresh_rate = models.DurationField(
        verbose_name=_('Refresh rate'),
        help_text=_('This setting will only be used when a browser does not '
                    'support refresh on focus.'),
        blank=True,
        null=True,
        default=timedelta(minutes=1),
        choices=[
            (None, _('disabled')),
            (timedelta(minutes=1), _('1 min.')),
            (timedelta(minutes=2), _('2 min.')),
            (timedelta(minutes=3), _('3 min.')),
            (timedelta(minutes=4), _('4 min.')),
            (timedelta(minutes=5), _('5 min.')),
            (timedelta(minutes=10), _('10 min.')),
            (timedelta(minutes=15), _('15 min.')),
            (timedelta(minutes=30), _('30 min.')),
        ])
    language = models.CharField(
        choices=settings.LANGUAGES,
        default=settings.LANGUAGE_CODE,
        max_length=255,
        verbose_name=_('Language')
    )
    phone_number = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        help_text=_('international format +14155552671 = +[country code][area code][phone]')
    )

    def __str__(self):
        return str(format_lazy(_('{user}\'s Settings'), user=self.user))

    def api_key(self, reset=False):
        """
        Get or create an API key for the associated user.
        :param reset: If True, delete the existing key and create a new one.
        :return: The user's API key.
        """
        if reset:
            Token.objects.get(user=self.user).delete()
        return Token.objects.get_or_create(user=self.user)[0]

    @property
    def dashboard_refresh_rate_milliseconds(self):
        """
        Convert seconds to milliseconds to be used in a Javascript setInterval
        function call.
        :return: the refresh rate in milliseconds or None.
        """
        if self.dashboard_refresh_rate:
            return self.dashboard_refresh_rate.seconds * 1000
        return None


@receiver(post_save, sender=User)
def create_user_settings(sender, instance, created, **kwargs):
    if created:
        Settings.objects.create(user=instance)
        account = Account.objects.create(owner=instance, name=instance.last_name or instance.username)
        account.users.add(instance)
        AccountMemberSettings.objects.create(user=instance, account=account)


@receiver(post_save, sender=User)
def save_user_settings(sender, instance, **kwargs):
    instance.settings.save()
    instance.account.save()


@receiver(user_logged_in)
def user_logged_in_callback(sender, request, user, **kwargs):
    translation.activate(user.settings.language)
    request.session[translation.LANGUAGE_SESSION_KEY] = user.settings.language


class Account(models.Model):
    owner = models.OneToOneField(User, on_delete=models.CASCADE, related_name='account')
    approved_terms = models.BooleanField(default=False)
    name = models.CharField(max_length=100)
    payment_processor_id = models.CharField(
        max_length=255,
        verbose_name=_('Account ID'),
        blank=True,
        null=True
    )
    slug = models.SlugField(
        editable=False,
        max_length=100,
        unique=True,
        verbose_name=_('Slug')
    )
    users = models.ManyToManyField(User, related_name='accounts')

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['owner__last_name', 'name']
        verbose_name = _('Account')
        verbose_name_plural = _('Accounts')

    def default_payment_source(self, payment_sources, stripe_customer):
        preferred_card = None
        for card in payment_sources:
          if stripe_customer['default_source'] == card['id']:
              preferred_card = card
              break
        return preferred_card

    def has_payment_source(self, stripe_customer=None):
        try:
            if not stripe_customer:
                stripe_customer = self.find_or_create_stripe_customer()

            if stripe_customer:
                cards = stripe_customer.sources.list(limit=5, object='card')
                preferred_card = self.default_payment_source(cards['data'], stripe_customer)
                return len(cards['data']) > 0, preferred_card
        except:
            print('Error checking for customer {} payment sources'.format(self.owner.email))
        return False, None

    def find_or_create_stripe_customer(self, email=None, stripe_token=None):
        if self.payment_processor_id and self.payment_processor_id[:3] == 'cus':
            try:
                stripe_customer = stripe.Customer.retrieve(self.payment_processor_id)
                return stripe_customer
            except Exception as e:
                print('Error in lookup portion of Account.find_or_create_stripe_customer(email={}), now trying to create'.format(self.owner.email))
                print(e)

        if not email:
            email = self.owner.email

        if stripe_token:
            try:
                stripe_customer = stripe.Customer.create(email=email, source=stripe_token)
                self.payment_processor_id = stripe_customer.id
                self.save()
                return stripe_customer
            except Exception as e:
                print('Error in creation portion Account.find_or_create_stripe_customer(email={})'.format(self.owner.email))
                print(e)

        return None

    def cancel_subscriptions(self, stripe_customer):
        cancelled = True
        for subscription in self.fetch_subscriptions(stripe_customer):
          try:
              if subscription.status in ['active', 'past_due']:
                  stripe.Subscription.delete(subscription.id)
          except:
              print('Failed to cancel subscription', subscription)
              cancelled = False

        return cancelled

    def is_free_premium_subscriber(self):
        for acct_promo in self.account_promo_codes.filter(promo_code__apply_premium=True).all():
            promo_code = acct_promo.promo_code
            if promo_code.months_valid != -1:
                expires_on = acct_promo.applied_on + relativedelta(months=promo_code.months_valid)
                valid_promo = timezone.now() <= expires_on
                if valid_promo:
                    return True
        return False

    def free_premium_end_date(self):
        if not self.is_free_premium_subscriber():
            raise RuntimeError('Not a promotional premium subscriber')

        promo_expires = []
        for acct_promo in self.account_promo_codes.filter(promo_code__apply_premium=True).all():
            promo_code = acct_promo.promo_code
            if promo_code.months_valid != -1:
                expires_on = acct_promo.applied_on + relativedelta(months=promo_code.months_valid)
                promo_expires.append(expires_on)

        promo_expires = sorted(promo_expires)
        return promo_expires[-1]


    def is_premium_subscriber(self, stripe_customer=None):
        if self.is_free_premium_subscriber():
            return True

        if not self.payment_processor_id:
            return False

        stripe_customer = self.find_or_create_stripe_customer() if stripe_customer is None else stripe_customer
        if not stripe_customer:
            return False

        is_active, subscription = self.has_active_subscription(
            stripe_customer,
            settings.STRIPE_PREMIUM_PLAN
        )
        return is_active

    def can_add_child(self):
        children_cnt = self.children.filter(is_active=True).count()
        max_children = self.max_children()

        return max_children > children_cnt

    def max_children(self):
        max_children = settings.FREE_CHILD_COUNT
        is_premium = self.is_premium_subscriber()
        if is_premium:
            max_children = settings.PREMIUM_CHILD_COUNT

        for acct_promo in self.account_promo_codes.all():
            valid_promo = True
            promo_code = acct_promo.promo_code
            if promo_code.months_valid != -1:
                expires_on = acct_promo.applied_on + relativedelta(months=promo_code.months_valid)
                valid_promo = timezone.now() >= expires_on
            
            if valid_promo and promo_code.apply_additional_child:
                max_children += 1

        return max_children

    def active_account_members(self):
        return self.account_member_settings.filter(is_active=True)

    def can_add_account_member(self):
        acct_member_cnt = self.active_account_members().count()
        max_acct_members = self.max_account_members()

        return max_acct_members > acct_member_cnt

    def number_of_members_available_to_add_free(self):
        acct_member_cnt = self.active_account_members().count()
        max_acct_members = self.max_account_members()
        return max_acct_members - acct_member_cnt

    def max_account_members(self):
        max_members = settings.FREE_MEMBER_COUNT
        is_premium = self.is_premium_subscriber()
        if is_premium:
            max_members = settings.PREMIUM_MEMBER_COUNT
        
        for acct_promo in self.account_promo_codes.all():
            valid_promo = True
            promo_code = acct_promo.promo_code
            if promo_code.months_valid != -1:
                expires_on = acct_promo.applied_on + relativedelta(months=promo_code.months_valid)
                valid_promo = timezone.now() >= expires_on
            
            if valid_promo:
                if promo_code.apply_additional_member:
                    max_members += 1

        return max_members

    def can_start_timer(self):
        is_premium = self.is_premium_subscriber()
        if is_premium:
            return True

        first_of_month = timezone.now().replace(day=1)
        
        timers_cnt = self.timers.filter(
                          created__gte=first_of_month
                      ).exclude(duration__isnull=True).count()

        return timers_cnt < settings.FREE_TIMER_COUNT

    def can_add_notification(self):
        is_premium = self.is_premium_subscriber()
        if is_premium:
            return True

        first_of_month = timezone.now().replace(day=1)

        notification_cnt = self.notifications.filter(start__gte=first_of_month).count()
        return notification_cnt < settings.FREE_NOTIFICATION_COUNT

    def has_active_subscription(self, stripe_customer, plan, subscriptions=None):
        if not subscriptions:
            subscriptions = self.fetch_subscriptions(stripe_customer)
            if not subscriptions:
                return False, None

        for subscription in subscriptions:
            if subscription.status == 'active':
                for item in subscription['items']['data']:
                    if item['plan']['id'] == plan:
                        return True, subscription

        return False, None

    def upgrade_to_premium_subscription(self, stripe_customer):
        plan = settings.STRIPE_PREMIUM_PLAN
        has_subscription, subscription = self.has_active_subscription(stripe_customer, plan)

        if has_subscription:
            return has_subscription, subscription

        if not has_subscription:
            try:
                subscription = stripe.Subscription.create(customer=stripe_customer.id, items=[{
                  'plan': plan
                }])
                return subscription.status == 'active', subscription
            except:
               print('Error creating subscription for accout {}'.format(self.owner.email))

        return False, None

    def add_account_member_or_child_subscription(self, stripe_customer, plan_to_add):
        has_subscription, subscription = self.has_active_subscription(
            stripe_customer,
            settings.STRIPE_PREMIUM_PLAN
        )

        if has_subscription:
            existing_item = None
            expected_qty = 1
            for item in subscription['items']['data']:
                if item['plan']['id'] == plan_to_add:
                    existing_item = item
                    break

            if existing_item:
                expected_qty = existing_item['quantity'] + 1
                try:
                    stripe.SubscriptionItem.modify(
                        existing_item['id'],
                        quantity=expected_qty
                    )
                except:
                    print('error modifying subscription item')
            else:
                try:
                    stripe.SubscriptionItem.create(
                        subscription=subscription.id,
                        plan=plan_to_add,
                        quantity=expected_qty
                    )
                except:
                    print('error creating subscription itme')
            
            has_subscription, subscription = self.has_active_subscription(
                stripe_customer,
                settings.STRIPE_PREMIUM_PLAN
            )
            for item in subscription['items']['data']:
                if item['plan']['id'] == plan_to_add:
                    return item['quantity'] == expected_qty, subscription

        return False, None

    def reduce_acct_member_or_child_subscription(self, stripe_customer, plan_to_reduce):
        has_subscription, subscription = self.has_active_subscription(
            stripe_customer,
            settings.STRIPE_PREMIUM_PLAN
        )

        if has_subscription:
            for item in subscription['items']['data']:
                if item['plan']['id'] == plan_to_reduce and item['quantity'] != 0:
                    expected_qty = item['quantity'] - 1
                    try:
                        stripe.SubscriptionItem.modify(item['id'], quantity=expected_qty)
                    except:
                        print('Error reducing / modifying subscription item')

                    has_subscription, subscription = self.has_active_subscription(
                        stripe_customer,
                        settings.STRIPE_PREMIUM_PLAN
                    )
                    for item in subscription['items']['data']:
                        if item['plan']['id'] == plan_to_reduce:
                            return item['quantity'] == expected_qty, subscription

        return False, None

    def fetch_subscriptions(self, stripe_customer):
        subscriptions = stripe.Subscription.list(customer=stripe_customer.id, limit=100)

        active_or_pastdue_subscriptions = []
        past_due_subscriptions = []
        for subscription in subscriptions['data']:
            if subscription.status in ['active', 'past_due']:
                active_or_pastdue_subscriptions.append(subscription)
        return active_or_pastdue_subscriptions


    def __str__(self):
        return '{}'.format(self.name)

    def save(self, *args, **kwargs):
        if not self.pk:
          self.slug = validate_slug(Account, str(self))
        super(Account, self).save(*args, **kwargs)


class AccountMemberSettings(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='account_member_settings')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='account_member_settings')
    phone_notifications_enabled = models.BooleanField(default=False, verbose_name=_("Phone notifications"))
    email_notifications_enabled = models.BooleanField(default=False, verbose_name=_("Email notifications"))
    is_payer = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['account__name']
        verbose_name = _('Account Member Settings')
        verbose_name_plural = _('Account Member Settings')

    def __str__(self):
        return '{} {} {}'.format(self.account.name, self.user.first_name, self.user.last_name)


class PromoCode(models.Model):
    code = models.CharField(max_length=100)
    max_usage = models.IntegerField(default=1)
    max_usage_per_account = models.IntegerField(default=1)
    months_valid = models.IntegerField(default=1)
    apply_premium = models.BooleanField(default=False)
    apply_additional_member = models.BooleanField(default=False)
    apply_additional_child = models.BooleanField(default=False)
    stripe = models.BooleanField(default=False)
    promo_price = models.DecimalField(max_digits=7, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.code} ({self.months_valid} month)"

class AccountPromoCode(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='account_promo_codes')
    promo_code = models.ForeignKey(PromoCode, on_delete=models.CASCADE, related_name='account_promo_codes')
    applied_on = models.DateTimeField(auto_now_add=timezone.now)
