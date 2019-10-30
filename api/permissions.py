# -*- coding: utf-8 -*-
from rest_framework.permissions import DjangoModelPermissions, BasePermission, SAFE_METHODS

from core import models

class BabyBuddyDjangoModelPermissions(DjangoModelPermissions):
    perms_map = {
        'GET': ['%(app_label)s.view_%(model_name)s'],
        'OPTIONS': ['%(app_label)s.add_%(model_name)s'],
        'HEAD': [],
        'POST': ['%(app_label)s.add_%(model_name)s'],
        # 'PUT': ['%(app_label)s.change_%(model_name)s'],
        # 'PATCH': ['%(app_label)s.change_%(model_name)s'],
        # 'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    }


def account_in_good_standing(acct):
    return True


def can_create_obj_with_acct(request):
    acct = request.data.get('account', request.user.account)

    acct_users = {u.id for u in acct.users.all()}
    if request.user.id not in acct_users:
        return False

    child_id = request.data.get('child')
    if child_id:
        children_in_acct = {child.id for child in acct.children.all()}
        if child_id not in children_in_acct:
            return False

    return account_in_good_standing(acct)


def can_view_update_obj_with_acct(request, obj):
    if not obj.account:
       if obj.user.id != request.user.id:
            return False

    else:
        user_accounts = {acct.id for acct in request.user.accounts.all()}
        if obj.account.id not in user_accounts:
            return False

    if request.method in SAFE_METHODS:
        return True

    if request.method == 'DELETE':
        return obj.user.id == request.user.id
        
    if request.method in ['POST', 'PUT']:
        account = obj.account or request.user.account
        return account_in_good_standing(account)

    return False

