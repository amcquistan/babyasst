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


def can_create_obj_with_acct(request, obj_account=None):
    acct = obj_account if obj_account else request.user.account

    acct_users = {u.id for u in acct.users.all()}
    if request.user.id not in acct_users:
        return False

    child_id = int(request.data.get('child', 0))
    if child_id:
        children_in_acct = {child.id for child in acct.children.all()}
        if child_id not in children_in_acct:
            return False

    return True


def can_view_update_obj_with_acct(request, obj):
    if not obj.account:
       if obj.user.id != request.user.id:
            return False

    else:
        user_accounts = {acct.id for acct in request.user.accounts.all()}
        if obj.account.id not in user_accounts:
            return False

    return True

