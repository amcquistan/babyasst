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
    acct = obj_account if obj_account else request.user.account

    try:
        acct_member_settings = acct.account_member_settings.get(user=request.user)
        child = acct.children.get(child=int(request.data.get('child', 0)))
    except:
        return PermissionCheck(False, 'Operation not supported')

    if not child.is_active:
        return PermissionCheck(False, 'Child must be active to perform this action')

    if not acct_member_settings.is_active:
        return PermissionCheck(False, 'User account not active')

    return PermissionCheck(True, '')


def can_view_update_obj_with_acct(request, obj):
    if hasattr(obj, 'child') and request.method not in SAFE_METHODS and not obj.child.is_active:
        return PermissionCheck(False, 'Child must be active to perform this action')

    if isinstance(obj, models.Child) and request.method not in SAFE_METHODS and not obj.is_active:
        return PermissionCheck(False, 'Child must be active to perform this action')

    if not hasattr(obj, 'account'):
       if obj.user.id == request.user.id:
            return PermissionCheck(True, '')

    else:
        try:
            acct_member_settings = obj.account.account_member_settings.get(user=request.user)
        except:
            PermissionCheck(False, 'Operation not supported')

        if acct_member_settings.is_active:
            return PermissionCheck(True, '')

    return PermissionCheck(False, 'Operation not supported')

