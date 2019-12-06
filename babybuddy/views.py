# -*- coding: utf-8 -*-
from django.conf import settings
from django.contrib import messages
from django.contrib.auth import update_session_auth_hash, login, logout, authenticate
from django.contrib.auth.forms import PasswordChangeForm, UserCreationForm
from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.messages.views import SuccessMessageMixin
from django.core.exceptions import ValidationError
from django.core.mail import EmailMessage
from django.http import Http404

from django.shortcuts import redirect, reverse, render, get_object_or_404
from django.template.loader import get_template
from django.urls import reverse_lazy
from django.utils.text import format_lazy
from django.utils.translation import gettext as _, gettext_lazy
from django.views.generic import View
from django.views.generic.base import TemplateView, RedirectView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.views.i18n import set_language


from django_filters.views import FilterView

from babybuddy import forms, models
from babybuddy.mixins import PermissionRequired403Mixin, StaffOnlyMixin, CanManageAccountTestMixin


class TOSView(View):
    def get(self, request):
        return render(request, 'registration/tos.html')


class PrivacyView(View):
    def get(self, request):
        return render(request, 'registration/privacy.html')


class LoginView(View):
    form_class = forms.CustomAuthenticationForm

    def get(self, request):
        return render(request, 'registration/login.html', {'form': self.form_class()})

    def post(self, request):
        form = self.form_class(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()

            if user is None:
                return render(request, 'registration/login.html', {'form': form, 'message': 'No matching credentials'})

            login(request, user)

            return redirect(reverse('dashboard:dashboard'))

        return render(request, 'registration/login.html', {'form': form, 'message': 'No matching credentials'})


class RegisterView(View):
    form_class = forms.UserSignupForm
    template_name = 'registration/signup.html'

    def get(self, request):
        return render(request, self.template_name, {
          'form': self.form_class()
        })

    def post(self, request):
        user_matched = User.objects.filter(email__iexact=request.POST.get('email')).first()
        form = self.form_class(request.POST)
        if user_matched:
            messages.error(request, _('Email already exists'))
            return render(request, self.template_name, {
              'form': form
            })

        form = self.form_class(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            message = get_template('emails/register_email.html').render({})
            mail = EmailMessage(_('Welcome to Baby Asst'), message, to=[user.email], from_email='noreply@thecodinginterface.com')
            mail.content_subtype = 'html'
            mail.send()
            return redirect(reverse('dashboard:dashboard'))

        messages.error(request, _('Signup failed'))
        return render(request, self.template_name, {'form': form})


class RootRouter(LoginRequiredMixin, RedirectView):
    """
    Redirects to the site dashboard.
    """
    def get_redirect_url(self, *args, **kwargs):
        self.url = reverse('dashboard:dashboard')
        return super(RootRouter, self).get_redirect_url(self, *args, **kwargs)


class AccountsView(LoginRequiredMixin, View):
    template_name = 'babybuddy/accounts.html'
    form_class = forms.AccountMemberSettingsForm

    def get(self, request):
        account_member_settings = request.user.account_member_settings.exclude(account=request.user.account).all()
        forms = [self.form_class(instance=ams) for ams in account_member_settings]
        return render(request, self.template_name, {'forms': forms})


class AccountsUpdateView(UserPassesTestMixin, View):
    form_class = forms.AccountMemberSettingsForm

    def test_func(self):
        acct_member_settings = models.AccountMemberSettings.objects.get(pk=self.kwargs.get('pk'))
        passed = self.request.user.id == acct_member_settings.user.id
        if not passed:
            raise Http404(_("Uh oh, something odd happened"))
        return True

    def post(self, request, pk):
        acct_member_settings = models.AccountMemberSettings.objects.get(pk=pk)
        form = self.form_class(request.POST, instance=acct_member_settings)
        if form.is_valid():
            form.save()
        return redirect(reverse('babybuddy:accounts'))


class UserAccountDeleteView(LoginRequiredMixin, View):
    def post(self, request, account_id):
        user = request.user
        account = get_object_or_404(models.Account, pk=account_id)
        if account.id != user.account.id:
            raise Http404(_("Uh oh, something odd happened"))

        if account.is_premium_subscriber() and not account.is_free_premium_subscriber():
            account.cancel_subscriptions(account.find_or_create_stripe_customer())
        
        account.delete()
        user.delete()

        return redirect(reverse('babybuddy:login'))


class UserAccountInviteMemberView(CanManageAccountTestMixin, View):

    def post(self, request, account_id):
        acct = models.Account.objects.get(pk=account_id)
        invitee = request.POST.get('invitee')

        if acct.is_premium_subscriber():
            success = True
            if not acct.can_add_account_member():
                stripe_token = request.POST.get('stripe_invitee_token')
                stripe_email = request.POST.get('stripe_invitee_user_email')
                existing_payment_source = request.POST.get('stripe_invitee_use_existing_payment_source', 'no') == 'yes'

                # complete stripe transaction
                stripe_customer = acct.find_or_create_stripe_customer()
                has_subscription, subscription = acct.has_active_subscription(
                    stripe_customer,
                    settings.STRIPE_PREMIUM_PLAN
                )
                if not has_subscription:
                    messages.error(request, _('Must have active premium service to add account user.'))
                    return redirect(reverse('babybuddy:user-account'))

                success, subscription = acct.add_account_member_or_child_subscription(
                    stripe_customer,
                    settings.STRIPE_ADDITIONAL_MEMBER_PLAN
                )

            if success:
                additional_msg = ''
                # - search for user by email
                invitee_user = User.objects.filter(email__iexact=invitee).first()
                if invitee_user:
                    message = get_template('emails/invite_email.html').render({
                      'account': acct,
                      'invitee': invitee_user
                    })
                    mail = EmailMessage(_('Baby Asst Account Member Invite'), message, to=[invitee_user.email], from_email='noreply@babyasst.com')
                    mail.content_subtype = 'html'
                    mail.send()
                    acct_member_settings = models.AccountMemberSettings.objects.create(
                        user=invitee_user,
                        account=acct
                    )
                else:
                    invitee_user = User.objects.create(username=invitee, email=invitee)
                    
                    # send an email indicating they have been added to this account
                    accept_url = settings.APP_HOST + reverse('babybuddy:user-account-invite-accept', args=(acct.id, invitee_user.id,))
                    message = get_template('emails/new_user_invite_email.html').render({
                      'accept_url': accept_url,
                      'account': acct,
                      'invitee': invitee_user
                    })
                    mail = EmailMessage(_('Baby Asst Account Member Invite'), message, to=[invitee_user.email], from_email='noreply@babyasst.com')
                    mail.content_subtype = 'html'
                    mail.send()
                    additional_msg = '. An invitation email has been sent.'

                acct.users.add(invitee_user)
                messages.success(request, _('User added to account' + additional_msg))

            else:
                messages.error(request, _('Transaction failed'))

        return redirect(reverse('babybuddy:user-account'))


class UserAccountInviteMemberAcceptView(View):
    template_name = 'registration/accept_invite.html'
    form_class = forms.InvitedNewUserForm

    def get(self, request, account_id, user_id):
        account = get_object_or_404(models.Account, pk=account_id)
        account_users = {u.id for u in account.users.all()}

        user = get_object_or_404(User, pk=user_id)

        if user.id not in account_users:
            raise Http404(_('Uh oh, something odd happened'))

        form = self.form_class(user, account)
        form.fields['email'].empty_value = user.email

        return render(request, self.template_name, {
            'form': form,
            'invitee': user,
            'account': account
        })

    def post(self, request, account_id, user_id):
        account = get_object_or_404(models.Account, pk=account_id)
        account_users = {u.id for u in account.users.all()}

        user = get_object_or_404(User, pk=user_id)

        if user.id not in account_users:
            raise Http404(_('Uh oh, something odd happened'))

        email = request.POST.get('email')
        form = self.form_class(user, account, request.POST)
        if user.email != email:
            matched_user = User.objects.filter(email__iexact=email).first()
            if matched_user:
                messages.error(request, _('Email already exists. Have account transferred to this {} or keep the email of {}'.format(email, user.email)))
                return render(request, self.template_name, {
                    'form': form,
                    'invitee': user,
                    'account': account
                })

        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, _('Welcome to Baby Asst'))
            return redirect(reverse('dashboard:dashboard'))

        messages.error(request, _('There was an error processing your invitation acceptance'))
        return render(request, self.template_name, {
            'form': form,
            'invitee': user,
            'account': account
        })


class UserAccountSubscriptionView(LoginRequiredMixin, View):
    success_url_name = 'babybuddy:account'

    def post(self, request, pk):
        
        acct = models.Account.objects.get(pk=pk)

        if acct.id != request.user.account.id:
            messages.error(request, _('There was an error processing that request'))
            return redirect(reverse('babybuddy:user-account'))

        subscription_service = request.POST.get('stripe_subscription_service')

        if subscription_service == 'premium':

            stripe_token = request.POST.get('stripe_subscription_token')

            stripe_customer = acct.find_or_create_stripe_customer(email=request.user.email, stripe_token=stripe_token)
            is_active, subscription = acct.upgrade_to_premium_subscription(stripe_customer)
            
            if is_active:
                messages.success(request, _('Account successfully upgraded'))
            else:
                messages.error(request, _('Transaction failure'))

        elif subscription_service == 'free':

            stripe_customer = acct.find_or_create_stripe_customer()
            cancelled = acct.cancel_subscriptions(stripe_customer)
            
            if cancelled:
                messages.success(request, _('Service cancelled'))
            else:
                messages.error(request, _('There was an error cancelling your service'))

        return redirect(reverse('babybuddy:user-account'))


class UserAccountView(UserPassesTestMixin, View):
    account_form = forms.AccountForm
    account_settings_form = forms.AccountMemberSettingsForm
    template_name = 'babybuddy/account.html'

    def test_func(self):
        if self.request.method == 'POST':
            acct = models.Account.objects.get(pk=self.request.POST.get('account'))
            return self.request.user.account.id == acct.id
        return True

    def get(self, request):
        
        user = request.user
        account = user.account
        acct_members_settings = account.account_member_settings.all()
        user_acct_settings = [uas for uas in acct_members_settings if uas.user.id == user.id][0]
        # acct_members_settings = [uas for uas in acct_members_settings if uas.user.id != user.id]
        account_settings_form = self.account_settings_form(instance=user_acct_settings)

        account_users = []
        for account_user in account.users.exclude(pk=user.id).all():
            account_user_data = {
              'id': account_user.id,
              'first_name': account_user.first_name,
              'last_name': account_user.last_name,
              'username': account_user.username,
              'email': account_user.email,
              'phone_number': account_user.settings.phone_number,
              'phone_notifications_enabled': False,
              'email_notifications_enabled': False,
              'is_active': False
            }
            for member_settings in acct_members_settings:
                if member_settings.user.id == account_user.id:
                    account_user_data['is_active'] = member_settings.is_active
                    account_user_data['phone_notifications_enabled'] = member_settings.phone_notifications_enabled
                    account_user_data['email_notifications_enabled'] = member_settings.email_notifications_enabled
                    break

            account_users.append(account_user_data)

        return render(request, self.template_name, {
            'account_form': self.account_form(instance=account),
            'account': account,
            'account_settings_form': self.account_settings_form(instance=user_acct_settings),
            'account_members': account_users,
            'children': account.children.all(),
            'premium_member_cnt': settings.PREMIUM_MEMBER_COUNT,
            'premium_child_cnt': settings.PREMIUM_CHILD_COUNT,
            'is_premium': account.is_premium_subscriber(),
            'is_free_premium': account.is_free_premium_subscriber(),
            'stripe_client_key': settings.STRIPE_CLIENT_KEY
        })

    def post(self, request):
        acct = models.Account.objects.get(pk=self.request.POST.get('account'))
        account_form = self.account_form(request.POST, instance=acct)

        acct_settings = models.AccountMemberSettings.objects.filter(account=acct, user=request.user).first()
        account_settings_form = self.account_settings_form(request.POST, instance=acct_settings)

        if account_form.is_valid() and account_settings_form.is_valid():
            account_form.save()
            account_settings_form.save()
            messages.success(self.request, _("Account updated"))

        return redirect(reverse('babybuddy:user-account'))


class UserAccountMemberActivateView(CanManageAccountTestMixin, View):
  
    def post(self, request, account_id, user_id):
        user_to_remove = User.objects.get(pk=user_id)
        account = request.user.account
        acct_member_settings = models.AccountMemberSettings.objects.filter(
            account=account,
            user=user_to_remove).first()


        if not account.can_add_account_member():
            messages.error(request, _('Account member cannot be activated without upgrading service'))
            redirect(reverse('babybuddy:user-account'))

        acct_member_settings.is_active = True
        acct_member_settings.save()

        messages.success(self.request, _("Account member activated"))
        return redirect(reverse('babybuddy:user-account'))


class UserAccountMemberDeleteView(CanManageAccountTestMixin, View):

    def post(self, request, account_id, user_id):
        user_to_remove = User.objects.get(pk=user_id)
        account = request.user.account
        acct_member_settings = models.AccountMemberSettings.objects.filter(
            account=account,
            user=user_to_remove).first()
        if acct_member_settings:
            acct_member_settings.delete()

        account.users.remove(user_to_remove)
        messages.success(self.request, _("Account member removed"))
        return redirect(reverse('babybuddy:user-account'))


class UserAccountMemberDeactivateView(CanManageAccountTestMixin, View):

    def post(self, request, account_id, user_id):
        user_to_remove = User.objects.get(pk=user_id)
        account = request.user.account
        acct_member_settings = models.AccountMemberSettings.objects.filter(
            account=account,
            user=user_to_remove).first()

        if acct_member_settings:
            acct_member_settings.is_active = False
            acct_member_settings.save()
            messages.success(self.request, _("Account member deactivated"))

        return redirect(reverse('babybuddy:user-account'))


class BabyBuddyFilterView(FilterView):
    """
    Disables "strictness" for django-filter. It is unclear from the
    documentation exactly what this does...
    """
    # TODO Figure out the correct way to use this.
    strict = False


class UserPassword(LoginRequiredMixin, View):
    """
    Handles user password changes.
    """
    form_class = forms.UserPasswordForm
    template_name = 'babybuddy/user_password_form.html'

    def get(self, request):
        return render(request, self.template_name, {
            'form': self.form_class(request.user)
        })

    def post(self, request):
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            user = form.save()
            update_session_auth_hash(request, user)
            messages.success(request, _('Password updated.'))
        return render(request, self.template_name, {'form': form})


class UserResetAPIKey(LoginRequiredMixin, View):
    """
    Resets the API key of the logged in user.
    """
    def get(self, request):
        request.user.settings.api_key(reset=True)
        messages.success(request, _('User API key regenerated.'))
        return redirect('babybuddy:user-settings')


class UserSettings(LoginRequiredMixin, View):
    """
    Handles both the User and Settings models.
    Based on this SO answer: https://stackoverflow.com/a/45056835.
    """
    form_user_class = forms.UserForm
    form_settings_class = forms.UserSettingsForm
    template_name = 'babybuddy/user_settings_form.html'

    def get(self, request):
        return render(request, self.template_name, {
            'form_user': self.form_user_class(instance=request.user),
            'form_settings': self.form_settings_class(
                instance=request.user.settings)
        })

    def post(self, request):
        form_user = self.form_user_class(
            instance=request.user,
            data=request.POST)
        form_settings = self.form_settings_class(
            instance=request.user.settings,
            data=request.POST)
        if form_user.is_valid() and form_settings.is_valid():
            user = form_user.save(commit=False)
            user_settings = form_settings.save(commit=False)
            user.settings = user_settings
            user.save()
            set_language(request)
            messages.success(request, _('Settings saved!'))
            return redirect('babybuddy:user-settings')
        return render(request, self.template_name, {
            'user_form': form_user,
            'settings_form': form_settings
        })


class Welcome(LoginRequiredMixin, TemplateView):
    """
    Basic introduction to Baby Buddy (meant to be shown when no data is in the
    database).
    """
    template_name = 'babybuddy/welcome.html'
