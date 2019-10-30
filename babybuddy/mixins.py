# -*- coding: utf-8 -*-
from django.conf import settings
from django.contrib import messages
from django.contrib.auth.mixins import AccessMixin, PermissionRequiredMixin, UserPassesTestMixin

from django.http import Http404
from django.urls import reverse_lazy
from django.utils.translation import gettext as _

from rest_framework.permissions import SAFE_METHODS

from core import models

def is_active_account_subscription(account):
    # Later will need to check that the Stripe subscription is active.
    # To be active:
    # - base subscription needs to be active
    # - must be an active subscription for each person
    #   in addition to the account owner

    return True


class PermissionRequired403Mixin(PermissionRequiredMixin):
    """
    Raise an exception instead of redirecting to login.
    """
    raise_exception = True


class StaffOnlyMixin(AccessMixin):
    """
    Verify the current user is staff.
    """
    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return self.handle_no_permission()
        return super().dispatch(request, *args, **kwargs)


class AccountMemberRequiredMixin(UserPassesTestMixin):
    """
    Verify that the current user is part of the account 
    for which the user is attempting to access
    """
    raise_exception = True


class ActiveSubscriptionRequiredMixin(UserPassesTestMixin):
    """
    Verify that the current user has an active subscription
    """
    raise_exception = False
    login_url = 'babybuddy/subscription.html'

    def test_func(self):
        return True

class CanManageAccountTestMixin(UserPassesTestMixin):
    raise_exception = True
    
    def test_func(self):
        request = self.request
        if request.method in ['POST', 'PUT']:
            account_id = int(request.POST.get('account', self.kwargs.get('account_id')))
            if not account_id:
                return False
            
            return request.user.account.id == account_id
        else:
            account_id = int(self.kwargs.get('account_id'))
            if not account_id:
                return False

            return request.user.account.id == account_id

        return False


class ChildCreationTestMixin(UserPassesTestMixin):
    raise_exception = False
    login_url = reverse_lazy('babybuddy:user-account')

    def test_func(self):
        account = self.request.user.account        
        is_premium, subscription = account.is_premium_subscriber()
        if not is_premium:
            children_cnt = account.children.count()
            if children_cnt == 0:
                return True
        else:
            active_children_cnt = account.children.filter(is_active=True).count()
            if active_children_cnt < settings.PREMIUM_CHILD_COUNT:
                return True

        messages.error(self.request, 'Must upgrade account to add child')
        return False


class ChildActivityTestMixin(UserPassesTestMixin):
    '''
    For a User to view a Child's info they must be part
    of that Child's account.

    For a User to add or update a Child resource they must 
    be part of that Child's account and the account must 
    have an active subscription.

    For a User to delete a Child resource they must be 
    the Account owner for that Child resource.
    '''
    raise_exception = True

    # login_url is really just a redirect URL for when an exception is raised
    login_url = '/activate-subscription/'

    def test_func(self):
        user = self.request.user
        try:
            child = models.Child.objects.get(slug=self.kwargs.get('slug'))
        except models.Child.model.DoesNotExist:
            raise Http404(_("Uh oh something unexpected happended."))

        user_accounts = [acct.id for acct in user.accounts.all()]

        if child.account.id not in user_accounts:
            return False

        if self.request.method in SAFE_METHODS:
            return True

        active_subscription = is_active_account_subscription(child.account)

        if not active_subscription:
            return False

        if self.request.method in ['PUT', 'POST']:
            return True

        if self.request.method == 'DELETE' and user.account == child.account:
            return True

        return False
