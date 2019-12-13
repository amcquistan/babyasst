# -*- coding: utf-8 -*-

from collections import namedtuple

from rest_framework.permissions import DjangoModelPermissions, BasePermission, SAFE_METHODS

from core import models

PermissionCheck = namedtuple('PermissionCheck', ['passed_check', 'message'])

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
    # acct = obj_account if obj_account else request.user.account

    try:
        child = models.Child.objects.get(pk=int(request.data.get('child', 0)))
        acct_member_settings = child.account.account_member_settings.get(user=request.user)
    except:
        return PermissionCheck(False, 'Operation not supported')

    if not child.is_active:
        return PermissionCheck(False, 'Child must be active to perform this action')
 
    if child.account.id == request.user.account.id:
        return PermissionCheck(True, '')

    if not acct_member_settings.is_active:
        return PermissionCheck(False, 'User account not active')

    if request.method in SAFE_METHODS:
        return PermissionCheck(True, '')

    if child.account.is_premium_subscriber():
        return PermissionCheck(True, '')

    return PermissionCheck(False, 'Operation not supported')


def can_view_update_obj_with_acct(request, obj):
    obj_account = None

    if isinstance(obj, models.Child):
        if request.method not in SAFE_METHODS and not obj.is_active:
            return PermissionCheck(False, 'Child must be active to perform this action')

        if request.method == 'DELETE' and obj.account.id != request.user.account.id:
            return PermissionCheck(False, 'Operation only supported for account owner')

        obj_account = obj.account

    elif hasattr(obj, 'child'):
        if request.method not in SAFE_METHODS and not obj.child.is_active:
            return PermissionCheck(False, 'Child must be active to perform this action')

        obj_account = obj.child.account

    elif not hasattr(obj, 'account'):
        obj_account = request.user.account

    else:
        return PermissionCheck(False, 'No valid account')


    if obj_account.id == request.user.account.id:
        return PermissionCheck(True, '')

    try:
        acct_member_settings = obj_account.account_member_settings.get(user=request.user)
    except:
        return PermissionCheck(False, 'Operation not supported')


    if not acct_member_settings.is_active:
        return PermissionCheck(False, 'Operation not supported')


    if request.method in SAFE_METHODS:
        return PermissionCheck(True, '')

    if obj_account.is_premium_subscriber():
        return PermissionCheck(True, '')

    return PermissionCheck(False, 'Operation not supported')

