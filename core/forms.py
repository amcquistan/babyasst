# -*- coding: utf-8 -*-
from django import forms
from django.conf import settings
from django.utils import timezone
from django.utils.translation import gettext as _

from core import models


# Sets the default Child instance if only one exists in the database.
def set_default_child(kwargs):
    instance = kwargs.get('instance', None)
    if not kwargs.get('initial'):
        kwargs.update(initial={})
    child = kwargs.pop('child', None)
    if instance is None and child is not None:
        kwargs['initial'].update({'child': child})
    return kwargs


# Uses a timer to set the default start and end date and updates the timer.
def set_default_duration(kwargs):
    instance = kwargs.get('instance', None)
    timer_id = kwargs.get('timer', None)
    if not kwargs.get('initial'):
        kwargs.update(initial={})
    if not instance and timer_id:
        instance = models.Timer.objects.get(id=timer_id)
        kwargs['initial'].update({
            'timer': instance,
            'start': instance.start,
            'end': instance.end or timezone.now()
        })
    try:
        kwargs.pop('timer')
    except KeyError:
        pass
    return kwargs


def user_children_queryset(user):
    return models.Child.objects.filter(account__in=user.accounts.all())


def set_common_select_fields_empty_values(form):
    select_fields = ['child', 'account']
    for field in select_fields:
        if field in form.fields:
            form.fields[field].empty_label = ""



# Sets the default Feeding type to the one used in the most recent entry.
def set_default_feeding_type(kwargs):
    instance = kwargs.get('instance', None)
    if not kwargs.get('initial'):
        kwargs.update(initial={})
    if instance is None and models.Feeding.objects.count() > 0:
        kwargs['initial'].update({
            'type': models.Feeding.objects.latest('end').type
        })
    return kwargs


class ChildForm(forms.ModelForm):
    class Meta:
        model = models.Child
        fields = [
            'first_name',
            'last_name',
            'birth_date'
        ]
        if settings.BABY_BUDDY['ALLOW_UPLOADS']:
            fields.append('picture')
        widgets = {
            'birth_date': forms.DateInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_date',
            }),
        }


class ChildDeleteForm(forms.ModelForm):
    confirm_name = forms.CharField(max_length=511)

    class Meta:
        model = models.Child
        fields = []

    def clean_confirm_name(self):
        confirm_name = self.cleaned_data['confirm_name']
        if confirm_name != str(self.instance):
            raise forms.ValidationError(
                _('Name does not match child name.'), code='confirm_mismatch')
        return confirm_name

    def save(self, commit=True):
        instance = self.instance
        self.instance.delete()
        return instance

class DiaperChangeQuickAddForm(forms.ModelForm):
    class Meta:
        model = models.DiaperChange
        fields = ['child', 'time', 'wet', 'solid', 'color']
        widgets = {
            'time': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_time',
            }),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super(DiaperChangeQuickAddForm, self).__init__(*args, **kwargs)
        self.fields['child'].queryset = user_children_queryset(user)


class DiaperChangeForm(forms.ModelForm):
    class Meta:
        model = models.DiaperChange
        fields = ['time', 'wet', 'solid', 'color', 'child']
        widgets = {
            'time': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_time',
            }),
            'child': forms.HiddenInput()
        }

    def __init__(self, *args, **kwargs):
        kwargs = set_default_child(kwargs)
        super(DiaperChangeForm, self).__init__(*args, **kwargs)


class FeedingQuickAddForm(forms.ModelForm):
    class Meta:
        model = models.Feeding
        fields = ['child', 'start', 'end', 'type', 'method', 'amount']
        widgets = {
            'start': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_start',
            }),
            'end': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_end',
            }),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        kwargs = set_default_feeding_type(kwargs)
        self.timer_id = kwargs.get('timer', None)
        kwargs = set_default_duration(kwargs)
        super(FeedingQuickAddForm, self).__init__(*args, **kwargs)
        self.fields['child'].queryset = user_children_queryset(user)


class FeedingForm(forms.ModelForm):
    class Meta:
        model = models.Feeding
        fields = ['start', 'end', 'type', 'method', 'amount', 'child']
        widgets = {
            'start': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_start',
            }),
            'end': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_end',
            }),
            'child': forms.HiddenInput()
        }

    def __init__(self, *args, **kwargs):
        kwargs = set_default_child(kwargs)
        kwargs = set_default_feeding_type(kwargs)
        self.timer_id = kwargs.get('timer', None)
        kwargs = set_default_duration(kwargs)
        super(FeedingForm, self).__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super(FeedingForm, self).save(commit=False)
        if self.timer_id:
            timer = models.Timer.objects.get(id=self.timer_id)
            timer.stop(instance.end)
        if commit:
            instance.save()
        return instance




class NoteQuickAddForm(forms.ModelForm):
    class Meta:
        model = models.Note
        fields = ['child', 'note']

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super(NoteQuickAddForm, self).__init__(*args, **kwargs)
        self.fields['child'].queryset = user_children_queryset(user)


class NoteForm(forms.ModelForm):
    class Meta:
        model = models.Note
        fields = ['note', 'note']

    widgets = {
      'child': forms.HiddenInput()
    }

    def __init__(self, *args, **kwargs):
        kwargs = set_default_child(kwargs)
        super(NoteForm, self).__init__(*args, **kwargs)


class NotificationForm(forms.ModelForm):

    class Meta:
        model = models.Notification
        fields = [
            'title',
            'body',
            'frequency_hours',
            'intervals',
            'active',
            'start',
            'end',
            'account',
            'child',
        ]
        widgets = {
            'start': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_start',
            }),
            'end': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_end',
            }),
            'body': forms.Textarea(attrs={'rows': 4, 'cols': 10})
        }

    def __init__(self, *args, **kwargs):
        accounts = kwargs.pop('accounts')
        children = kwargs.pop('children')
        instance = kwargs.get('instance')
        super(NotificationForm, self).__init__(*args, **kwargs)
        self.fields['account'].queryset = accounts
        if not children:
            children = models.Child.objects.filter(account__in=accounts)
        self.fields['child'].queryset = children

        set_common_select_fields_empty_values(self)

        now = timezone.now()
        if instance and instance.start < now:
            has_sent_events = instance.notification_events.filter(sent=True).count() > 0
            if has_sent_events:
                for field in self.fields:
                    if field != 'active':
                        self.fields[field].widget.attrs['readonly'] = True


class SleepQuickAddForm(forms.ModelForm):
    class Meta:
        model = models.Sleep
        fields = ['child', 'start', 'end']
        widgets = {
            'start': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_start',
            }),
            'end': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_end',
            }),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        self.timer_id = kwargs.get('timer', None)
        kwargs = set_default_duration(kwargs)
        super(SleepQuickAddForm, self).__init__(*args, **kwargs)
        self.fields['child'].queryset = user_children_queryset(user)

    def save(self, commit=True):
        instance = super(SleepQuickAddForm, self).save(commit=False)
        if self.timer_id:
            timer = models.Timer.objects.get(id=self.timer_id)
            timer.stop(instance.end)
        instance.save()
        return instance


class SleepForm(forms.ModelForm):
    class Meta:
        model = models.Sleep
        fields = ['start', 'end', 'child']
        widgets = {
            'start': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_start',
            }),
            'end': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_end',
            }),
            'child': forms.HiddenInput()
        }

    def __init__(self, *args, **kwargs):
        kwargs = set_default_child(kwargs)
        self.timer_id = kwargs.get('timer', None)
        kwargs = set_default_duration(kwargs)
        super(SleepForm, self).__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super(SleepForm, self).save(commit=False)
        if self.timer_id:
            timer = models.Timer.objects.get(id=self.timer_id)
            timer.stop(instance.end)
        instance.save()
        return instance


class TemperatureQuickAddForm(forms.ModelForm):
    class Meta:
        model = models.Temperature
        fields = ['child', 'temperature', 'time']
        widgets = {
            'time': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_time',
            }),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super(TemperatureQuickAddForm, self).__init__(*args, **kwargs)
        self.fields['child'].queryset = user_children_queryset(user)


class TemperatureForm(forms.ModelForm):
    class Meta:
        model = models.Temperature
        fields = ['temperature', 'time', 'child']
        widgets = {
            'time': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_time',
            }),
            'child': forms.HiddenInput()
        }

    def __init__(self, *args, **kwargs):
        kwargs = set_default_child(kwargs)
        super(TemperatureForm, self).__init__(*args, **kwargs)


class TimerQuickAddForm(forms.ModelForm):
    class Meta:
        model = models.Timer
        fields = ['user', 'account', 'child', 'is_feeding', 'is_sleeping', 'is_tummytime', 'name', 'start']
        widgets = {
            'start': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_start',
            })
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super(TimerQuickAddForm, self).__init__(*args, **kwargs)
        self.fields['child'].queryset = user_children_queryset(user)
        self.fields['account'].queryset = user.accounts.all()

    def save(self, commit=True):
        instance = super(TimerQuickAddForm, self).save(commit=False)
        instance.user = self.user
        instance.save()
        return instance


class TimerForm(forms.ModelForm):
    class Meta:
        model = models.Timer
        fields = ['name', 'start']
        widgets = {
            'start': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_start',
            })
        }

    def __init__(self, *args, **kwargs):
        super(TimerForm, self).__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super(TimerForm, self).save(commit=False)
        instance.user = self.user
        instance.save()
        return instance


class TummyTimeQuickAddForm(forms.ModelForm):
    class Meta:
        model = models.TummyTime
        fields = ['child', 'start', 'end', 'milestone']
        widgets = {
            'start': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_start',
            }),
            'end': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_end',
            }),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        self.timer_id = kwargs.get('timer', None)
        kwargs = set_default_duration(kwargs)
        super(TummyTimeQuickAddForm, self).__init__(*args, **kwargs)
        self.fields['child'].queryset = user_children_queryset(user)

    def save(self, commit=True):
        instance = super(TummyTimeQuickAddForm, self).save(commit=False)
        if self.timer_id:
            timer = models.Timer.objects.get(id=self.timer_id)
            timer.stop(instance.end)
        instance.save()
        return instance


class TummyTimeForm(forms.ModelForm):
    class Meta:
        model = models.TummyTime
        fields = ['start', 'end', 'milestone', 'child']
        widgets = {
            'start': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_start',
            }),
            'end': forms.DateTimeInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_end',
            }),
            'child': forms.HiddenInput()
        }

    def __init__(self, *args, **kwargs):
        kwargs = set_default_child(kwargs)
        self.timer_id = kwargs.get('timer', None)
        kwargs = set_default_duration(kwargs)
        super(TummyTimeForm, self).__init__(*args, **kwargs)

    def save(self, commit=True):
        instance = super(TummyTimeForm, self).save(commit=False)
        if self.timer_id:
            timer = models.Timer.objects.get(id=self.timer_id)
            timer.stop(instance.end)
        instance.save()
        return instance


class WeightQuickAddForm(forms.ModelForm):
    class Meta:
        model = models.Weight
        fields = ['child', 'weight', 'date']
        widgets = {
            'date': forms.DateInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_date',
            }),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop('user')
        super(WeightQuickAddForm, self).__init__(*args, **kwargs)
        self.fields['child'].queryset = user_children_queryset(user)


class WeightForm(forms.ModelForm):
    class Meta:
        model = models.Weight
        fields = ['weight', 'date', 'child']
        widgets = {
            'date': forms.DateInput(attrs={
                'class': 'datetimepicker-input',
                'data-target': '#datetimepicker_date',
            }),
            'child': forms.HiddenInput()
        }

    def __init__(self, *args, **kwargs):
        kwargs = set_default_child(kwargs)
        super(WeightForm, self).__init__(*args, **kwargs)
