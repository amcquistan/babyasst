# -*- coding: utf-8 -*-
from django import forms
from django.contrib.auth.forms import PasswordChangeForm, UserCreationForm, SetPasswordForm
from django.contrib.auth.models import User
from django.utils.translation import gettext as _

from .models import Settings, Account, AccountMemberSettings

class UserSignupForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email']

    approved_terms = forms.BooleanField(label=_("I agree to the terms of service and privacy policy"))

    def save(self, commit=True):
        user = super(UserSignupForm, self).save()
        user.account.approved_terms = self.cleaned_data["approved_terms"] 
        user.save()
        return user


class InvitedNewUserForm(SetPasswordForm):
    first_name = forms.CharField(label=_('First name'))
    last_name = forms.CharField(label=_('Last name'))
    email = forms.CharField(label=_('Email'))
    phone_number = forms.CharField(label=_('Phone number'), required=False)
    approved_terms = forms.BooleanField(label=_("I agree to the terms of service and privacy policy"))
    phone_notifications_enabled = forms.BooleanField(label=_("Enable text notifications"), required=False)
    email_notifications_enabled = forms.BooleanField(label=_("Enable email notifications"), required=False)

    def __init__(self, user, account, *args, **kwargs):
        self.account = account
        super(InvitedNewUserForm, self).__init__(user, *args, **kwargs)

    def save(self, commit=True):
        user = super(InvitedNewUserForm, self).save(commit=False)
        user.settings.phone_number = self.cleaned_data['phone_number']
        user.email = self.cleaned_data.get('email', user.email)
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        user.account.approved_terms = self.cleaned_data['approved_terms']
        user.save()

        phone_notifications_enabled = self.cleaned_data['phone_notifications_enabled']
        if not user.settings.phone_number:
            phone_notifications_enabled = False
        email_notifications_enabled = self.cleaned_data['email_notifications_enabled']
        acct_member_settings = AccountMemberSettings.objects.create(
            user=user,
            account=self.account,
            phone_notifications_enabled=phone_notifications_enabled,
            email_notifications_enabled=email_notifications_enabled
        )
        return user


class UserAddForm(UserCreationForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email',
                  'is_staff', 'is_active']

    def save(self, commit=True):
        user = super(UserAddForm, self).save(commit=False)
        user.is_superuser = True
        if commit:
            user.save()
        return user


class UserUpdateForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email',
                  'is_staff', 'is_active']


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email']


class UserPasswordForm(PasswordChangeForm):
    class Meta:
        fields = ['old_password', 'new_password1', 'new_password2']


class UserSettingsForm(forms.ModelForm):
    class Meta:
        model = Settings
        fields = ['dashboard_refresh_rate', 'phone_number', 'language']


class AccountMemberSettingsForm(forms.ModelForm):
    class Meta:
        model = AccountMemberSettings
        fields = ['account', 'phone_notifications_enabled', 'email_notifications_enabled']
        widgets = {'account': forms.HiddenInput()}

class AccountForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = ['name']
