# -*- coding: utf-8 -*-
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from django.utils import timezone
from django.utils.text import format_lazy
from django.utils.translation import gettext_lazy as _


from babybuddy.models import Account

from .helpers import validate_slug

def validate_date(date, field_name):
    """
    Confirm that a date is not in the future.
    :param date: a timezone aware date instance.
    :param field_name: the name of the field being checked.
    :return:
    """
    if date and date > timezone.localdate():
        raise ValidationError(
            {field_name: _('Date can not be in the future.')},
            code='date_invalid')


def validate_duration(model, max_duration=timedelta(hours=24)):
    """
    Basic sanity checks for models with a duration
    :param model: a model instance with 'start' and 'end' attributes
    :param max_duration: maximum allowed duration between start and end time
    :return:
    """
    if model.start and model.end:
        if model.start > model.end:
            raise ValidationError(
                _('Start time must come before end time.'),
                code='end_before_start')
        if model.end - model.start > max_duration:
            raise ValidationError(_('Duration too long.'), code='max_duration')


def validate_unique_period(queryset, model):
    """
    Confirm that model's start and end date do not intersect with other
    instances.
    :param queryset: a queryset of instances to check against.
    :param model: a model instance with 'start' and 'end' attributes
    :return:
    """
    if model.id:
        queryset = queryset.exclude(id=model.id)
    if model.start and model.end:
        if queryset.filter(start__lte=model.end, end__gte=model.start):
            raise ValidationError(
                _('Another entry intersects the specified time period.'),
                code='period_intersection')


def validate_time(time, field_name):
    """
    Confirm that a time is not in the future.
    :param time: a timezone aware datetime instance.
    :param field_name: the name of the field being checked.
    :return:
    """
    if time and time > timezone.localtime():
        raise ValidationError(
            {field_name: _('Date/time can not be in the future.')},
            code='time_invalid')


class Child(models.Model):
    model_name = 'child'
    first_name = models.CharField(max_length=255, verbose_name=_('First name'))
    last_name = models.CharField(max_length=255, verbose_name=_('Last name'))
    birth_date = models.DateField(
        blank=False,
        null=False,
        verbose_name=_('Birth date')
    )
    slug = models.SlugField(
        editable=False,
        max_length=100,
        unique=True,
        verbose_name=_('Slug')
    )
    picture = models.ImageField(
        blank=True,
        null=True,
        upload_to='child/picture/',
        verbose_name=_('Picture')
    )

    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        blank=False,
        null=True,
        related_name='children',
        help_text=_('Select an account'),
        verbose_name=_('Account')
    )
    is_active = models.BooleanField(default=True)

    @property
    def age(self):
        now = timezone.now().date()
        dob = self.birth_date
        age = (now - dob)
        weeks = age.days // 7
        
        if weeks < 52:
            return f"{weeks} weeks"

        if weeks == 52:
            return "1 year"
        
        years = now.year - dob.year
        months = years * 12 + (now.month - dob.month)
        if months < 24:
            return f"{months} months"

        return f"{years} years"


    objects = models.Manager()

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['last_name', 'first_name']
        verbose_name = _('Child')
        verbose_name_plural = _('Children')

    def __str__(self):
        return self.first_name

    def save(self, *args, **kwargs):
        if not self.pk:
            self.slug = validate_slug(Child, self.name(reverse=True))
        super(Child, self).save(*args, **kwargs)

    def name(self, reverse=False):
        if reverse:
            return '{}, {}'.format(self.last_name, self.first_name)

        return '{} {}'.format(self.first_name, self.last_name)


class Bath(models.Model):
    model_name = 'bath'
    child = models.ForeignKey(
        'Child',
        on_delete=models.CASCADE,
        related_name='baths',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )
    time = models.DateTimeField(
        blank=False,
        null=False,
        verbose_name=_('Time')
    )
    objects = models.Manager()

    class Meta:
        ordering = ['-time']
        verbose_name = _('Bath')
        verbose_name_plural = _('Baths')


class DiaperChange(models.Model):
    model_name = 'diaperchange'
    child = models.ForeignKey(
        'Child',
        on_delete=models.CASCADE,
        related_name='diaper_change',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )
    time = models.DateTimeField(
        blank=False,
        null=False,
        verbose_name=_('Time')
    )
    wet = models.BooleanField(verbose_name=_('Wet'))
    solid = models.BooleanField(verbose_name=_('Solid'))
    color = models.CharField(
        blank=True,
        choices=[
            ('black', _('Black')),
            ('brown', _('Brown')),
            ('green', _('Green')),
            ('yellow', _('Yellow')),
        ],
        max_length=255,
        verbose_name=_('Color')
    )

    objects = models.Manager()

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['-time']
        verbose_name = _('Diaper Change')
        verbose_name_plural = _('Diaper Changes')

    def __str__(self):
        return str(_('Diaper Change'))

    def attributes(self):
        attributes = []
        if self.wet:
            attributes.append(DiaperChange._meta.get_field('wet').name)
        if self.solid:
            attributes.append(DiaperChange._meta.get_field('solid').name)
        if self.color:
            attributes.append(self.color)
        return attributes

    def clean(self):
        validate_time(self.time, 'time')

        # One or both of Wet and Solid is required.
        if not self.wet and not self.solid:
            raise ValidationError(
                _('Wet and/or solid is required.'), code='wet_or_solid')


class Feeding(models.Model):
    model_name = 'feeding'
    child = models.ForeignKey(
        'Child',
        on_delete=models.CASCADE,
        related_name='feeding',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )
    start = models.DateTimeField(
        blank=False,
        null=False,
        verbose_name=_('Start time')
    )
    end = models.DateTimeField(
        blank=False,
        null=False,
        verbose_name=_('End time')
    )
    duration = models.DurationField(
        editable=False,
        null=True,
        verbose_name=_('Duration')
    )
    type = models.CharField(
        choices=[
            ('breast milk', _('Breast milk')),
            ('formula', _('Formula')),
            ('fortified breast milk', _('Fortified breast milk')),
        ],
        max_length=255,
        verbose_name=_('Type')
    )
    method = models.CharField(
        choices=[
            ('bottle', _('Bottle')),
            ('left breast', _('Left breast')),
            ('right breast', _('Right breast')),
            ('both breasts', _('Both breasts')),
        ],
        max_length=255,
        verbose_name=_('Method')
    )
    amount = models.FloatField(blank=True, null=True, verbose_name=_('Amount'))
    units = models.CharField(
      blank=False,
      choices=[
        ('ounces', _('Ounces')),
        ('milliliters', _('Milliliters'))
      ],
      default='ounces',
      max_length=20,
      verbose_name=_('Units')
    )

    objects = models.Manager()

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['-start']
        verbose_name = _('Feeding')
        verbose_name_plural = _('Feedings')

    def __str__(self):
        return str(_('Feeding'))

    def save(self, *args, **kwargs):
        if self.start and self.end:
            self.duration = self.end - self.start
        super(Feeding, self).save(*args, **kwargs)

    def clean(self):
        validate_time(self.start, 'start')
        validate_time(self.end, 'end')
        validate_duration(self)
        # validate_unique_period(Feeding.objects.filter(child=self.child), self)

        # "Formula" Type may only be associated with "Bottle" Method.
        if self.type == 'formula'and self.method != 'bottle':
            raise ValidationError(
                {'method':
                 _('Only "Bottle" method is allowed with "Formula" type.')},
                code='bottle_formula_mismatch')


class Note(models.Model):
    model_name = 'note'
    child = models.ForeignKey(
        'Child',
        on_delete=models.CASCADE,
        related_name='note',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )
    note = models.TextField(verbose_name=_('Note'))
    time = models.DateTimeField(auto_now=True, verbose_name=_('Time'))

    objects = models.Manager()

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['-time']
        verbose_name = _('Note')
        verbose_name_plural = _('Notes')

    def __str__(self):
        return str(_('Note'))


class NapsManager(models.Manager):
    def get_queryset(self):
        qs = super(NapsManager, self).get_queryset()
        return qs.filter(id__in=[obj.id for obj in qs if obj.nap])


class Notification(models.Model):
    model_name = 'notification'
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='notifications_created',
        verbose_name=_('Created By')
    )
    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        related_name="notifications",
        help_text=_('Select an account'),
        verbose_name=_("Account")
    )
    child = models.ForeignKey(
        Child,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )
    title = models.CharField(
        max_length=255,
        help_text=_('Descriptive title to identify the notification'),
        verbose_name=_("Title")
    )
    body = models.TextField(help_text=_("Instructive message to display with notification"))
    url = models.CharField(max_length=255, blank=True, null=True)
    frequency_hours = models.IntegerField(
        default=0,
        help_text=_('Hours between notificiations'),
        verbose_name=_("Frequency"),
        validators=[MinValueValidator(0)]
    )
    intervals = models.IntegerField(
        default=1,
        help_text=_('Number of subsequent times to issue the notification'),
        verbose_name=_("Interval"),
        validators=[MinValueValidator(1)]
    )
    active = models.BooleanField(default=True)
    start = models.DateTimeField(
        blank=False,
        null=False,
        help_text=_('When would like the notification to start occuring?'),
        verbose_name=_("Start time") 
    )
    end = models.DateTimeField(
        blank=True,
        null=True,
        help_text=_('When would like the notification to stop occuring?'),
        verbose_name=_("End time")
    )

    class Meta:
        ordering = ['-start']
        verbose_name = _('Notification')
        verbose_name_plural = _('Notifications')
        indexes = [
          models.Index(fields=['child'], name='child_idx'),
        ]

    def __str__(self):
        return str(_('Notification'))

    def save(self, *args, **kwargs):
        is_create = self.id is None
        super(Notification, self).save(*args, **kwargs)
        
        # create or update notification events

        if not is_create:
            existing_events = self.notification_events.exclude(sent=True).order_by('send_at').all()
            
            for existing_evt in existing_events:
                existing_evt.delete()

        if self.active:
            account_member_settings = self.account.account_member_settings.exclude(is_active=False).all()

            for i in range(self.intervals):
                send_at = self.start + timedelta(hours=self.frequency_hours * i)
                for member_settings in account_member_settings:
                    NotificationEvent.objects.create(
                        notification=self,
                        user=member_settings.user,
                        send_at=send_at
                    )




class NotificationEvent(models.Model):
    model_name= 'notification_event'
    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        related_name='notification_events',
        verbose_name=_("Notification")
    )
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='notification_events',
        verbose_name=_("Notification Event")
    )
    send_at = models.DateTimeField(verbose_name=_('Send At'), null=False, blank=False)
    sent = models.BooleanField(default=False, verbose_name=_('Sent'))
    acknowledged = models.BooleanField(
        default=False,
        verbose_name=_('Acknowledged')
    )
    acknowledged_type = models.CharField(
        choices=[
            ('text_message', _('Text Message')),
            ('email', _('Email')),
            ('app', _('Web')),
        ],
        max_length=255,
        verbose_name=_('Acknowledged Type')
    )
    url = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['notification'], name='notification_idx'),
            models.Index(fields=['send_at'], name='send_at_idx')
        ]


class Sleep(models.Model):
    model_name = 'sleep'
    child = models.ForeignKey(
        'Child',
        on_delete=models.CASCADE,
        related_name='sleep',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )
    start = models.DateTimeField(
        blank=False,
        null=False,
        verbose_name=_('Start time')
    )
    end = models.DateTimeField(
        blank=False,
        null=False,
        verbose_name=_('End time')
    )
    duration = models.DurationField(
        editable=False,
        null=True,
        verbose_name=_('Duration')
    )

    objects = models.Manager()
    naps = NapsManager()

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['-start']
        verbose_name = _('Sleep')
        verbose_name_plural = _('Sleep')

    def __str__(self):
        return str(_('Sleep'))

    @property
    def nap(self):
        nap_start_min = timezone.datetime.strptime(
            settings.BABY_BUDDY['NAP_START_MIN'], '%H:%M').time()
        nap_start_max = timezone.datetime.strptime(
            settings.BABY_BUDDY['NAP_START_MAX'], '%H:%M').time()
        local_start_time = timezone.localtime(self.start).time()
        return nap_start_min <= local_start_time <= nap_start_max

    def save(self, *args, **kwargs):
        if self.start and self.end:
            self.duration = self.end - self.start
        super(Sleep, self).save(*args, **kwargs)

    def clean(self):
        validate_time(self.start, 'start')
        validate_time(self.end, 'end')
        validate_duration(self)
        # validate_unique_period(Sleep.objects.filter(child=self.child), self)


class Suggestion(models.Model):
    model_name = 'suggestion'
    child = models.ForeignKey(
        'Child',
        on_delete=models.CASCADE,
        related_name='suggestion',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )

    diaper_change = models.BooleanField(default=False)
    feeding = models.BooleanField(default=False)
    sleep = models.BooleanField(default=False)
    temperature_check = models.BooleanField(default=False)
    tummy_time = models.BooleanField(default=False)
    quantity = models.DecimalField(decimal_places=2, max_digits=6, blank=True, null=True)
    units = models.CharField(max_length=20, blank=True, null=True)

    send_text_notification = models.BooleanField(
        default=False,
        verbose_name=_('Send text message')
    )
    send_email_notification = models.BooleanField(
        default=False,
        verbose_name=_('Send email')
    )
    send_app_notification = models.BooleanField(
        default=True,
        verbose_name=_('Send app notification')
    )
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='suggestions',
        verbose_name=_('Suggestion')
    )
    send_at = models.DateTimeField(blank=True, null=True, verbose_name=_('Send At'))
    sent = models.BooleanField(default=False, verbose_name=_('Sent'))


class Temperature(models.Model):
    model_name = 'temperature'
    child = models.ForeignKey(
        'Child',
        on_delete=models.CASCADE,
        related_name='temperature',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )
    temperature = models.FloatField(
        blank=False,
        null=False,
        verbose_name=_('Temperature')
    )
    time = models.DateTimeField(
        blank=False,
        null=False,
        verbose_name=_('Time')
    )

    objects = models.Manager()

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['-time']
        verbose_name = _('Temperature')
        verbose_name_plural = _('Temperature')

    def __str__(self):
        return str(_('Temperature'))

    def clean(self):
        validate_time(self.time, 'time')


class Timer(models.Model):
    model_name = 'timer'
    name = models.CharField(
        blank=True,
        max_length=255,
        null=True,
        verbose_name=_('Name')
    )
    start = models.DateTimeField(
        editable=True,
        blank=True,
        null=True,
        verbose_name=_('Start time')
    )
    end = models.DateTimeField(
        blank=True,
        editable=False,
        null=True,
        verbose_name=_('End time')
    )
    duration = models.DurationField(
        editable=False,
        null=True,
        default=None,
        verbose_name=_('Duration')
    )
    active = models.BooleanField(
        default=False,
        verbose_name=_('Active')
    )
    complete = models.BooleanField(
        default=False,
        verbose_name=_('Complete')
    )
    is_feeding = models.BooleanField(default=False, verbose_name=_('Feeding'))
    is_sleeping = models.BooleanField(default=False, verbose_name=_('Sleeping'))
    is_tummytime = models.BooleanField(default=False, verbose_name=_('Tummy Time'))
    user = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='timers',
        verbose_name=_('Created By')
    )
    account = models.ForeignKey(
        Account,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='timers',
        help_text=_('Select an account'),
        verbose_name=_('Account')
    )
    child = models.ForeignKey(
        Child,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='timers',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )
    created = models.DateTimeField(auto_now_add=True)

    objects = models.Manager()

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['-active', '-id']
        verbose_name = _('Timer')
        verbose_name_plural = _('Timers')

    def __str__(self):
        return self.name or str(format_lazy(_('Timer #{id}'), id=self.id))

    @classmethod
    def unfinished_account_timers(cls, user):
        return cls.objects.filter(
                      account__in=user.accounts.all()
                  ).exclude(
                      complete=True
                  ).order_by('-id').all()

    @classmethod
    def from_db(cls, db, field_names, values):
        instance = super(Timer, cls).from_db(db, field_names, values)
        if not instance.name:
            instance.name = str(instance)
            instance.save()

        if instance.active and instance.start:
            instance.stop()
            instance.restart()
        return instance

    def restart(self):
        """Restart the timer."""
        self.start = timezone.now()
        self.end = None
        self.active = True
        self.save()

    def stop(self, end=None):
        """Stop the timer."""
        if self.active:
            if not end:
                end = timezone.now()
            self.end = end
            self.active = False
            if self.start and self.end:
                delta = self.end - self.start
                if self.duration is not None:
                    self.duration += delta
                else:
                    self.duration = delta
            self.save()

    def clean(self):
        validate_time(self.start, 'start')
        if self.end:
            validate_time(self.end, 'end')


class TummyTime(models.Model):
    model_name = 'tummytime'
    child = models.ForeignKey(
        'Child',
        on_delete=models.CASCADE,
        related_name='tummy_time',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )
    start = models.DateTimeField(
        blank=False,
        null=False,
        verbose_name=_('Start time')
    )
    end = models.DateTimeField(
        blank=False,
        null=False,
        verbose_name=_('End time')
    )
    duration = models.DurationField(
        editable=False,
        null=True,
        verbose_name=_('Duration')
    )
    milestone = models.CharField(
        blank=True,
        max_length=255,
        verbose_name=_('Milestone')
    )

    objects = models.Manager()

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['-start']
        verbose_name = _('Tummy Time')
        verbose_name_plural = _('Tummy Time')

    def __str__(self):
        return str(_('Tummy Time'))

    def save(self, *args, **kwargs):
        if self.start and self.end:
            self.duration = self.end - self.start
        super(TummyTime, self).save(*args, **kwargs)

    def clean(self):
        validate_time(self.start, 'start')
        validate_time(self.end, 'end')
        validate_duration(self)
        # validate_unique_period(
        #     TummyTime.objects.filter(child=self.child), self)


class Weight(models.Model):
    model_name = 'weight'
    child = models.ForeignKey(
        'Child',
        on_delete=models.CASCADE,
        related_name='weight',
        help_text=_('Select a child'),
        verbose_name=_('Child')
    )
    weight = models.FloatField(
        blank=False,
        null=False,
        verbose_name=_('Weight')
    )
    date = models.DateField(
        blank=False,
        null=False,
        verbose_name=_('Date')
    )
    units = models.CharField(
      blank=False,
      choices=[
        ('pounds', _('Pounds')),
        ('kilograms', _('Kilograms'))
      ],
      default='pounds',
      max_length=20,
      verbose_name=_('Units')
    )
    objects = models.Manager()

    class Meta:
        default_permissions = ('view', 'add', 'change', 'delete')
        ordering = ['-date']
        verbose_name = _('Weight')
        verbose_name_plural = _('Weight')

    def __str__(self):
        return str(_('Weight'))

    def clean(self):
        validate_date(self.date, 'date')
