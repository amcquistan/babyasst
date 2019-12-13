# -*- coding: utf-8 -*-
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _

from core import models as core_models
from babybuddy import models



class SettingsInline(admin.StackedInline):
    model = models.Settings
    verbose_name = _('Settings')
    verbose_name_plural = _('Settings')
    can_delete = False
    fieldsets = (
        (_('Dashboard'), {
            'fields': ('dashboard_refresh_rate',)
        }),
    )


class UserAdmin(BaseUserAdmin):
    inlines = (SettingsInline,)


admin.site.unregister(User)
admin.site.register(User, UserAdmin)

class ChildrenInline(admin.TabularInline):
    model = core_models.Child

@admin.register(models.Account)
class AccountAdmin(admin.ModelAdmin):
    inlines = (ChildrenInline,)

    list_display = ('name', 'owner', 'approved_terms', 'slug', 'payment_processor_id')
    fields = ('name', 'owner', 'payment_processor_id', 'users')
    readonly_fields = ('users',)
    search_fields = ('owner__first_name', 'owner__last_name')


@admin.register(models.AccountMemberSettings)
class AccountMemberSettingsAdmin(admin.ModelAdmin):
    list_display = ('account', 'user', 'phone_notifications_enabled', 'email_notifications_enabled', 'is_active')
    fields = ('account', 'user', 'phone_notifications_enabled', 'email_notifications_enabled', 'is_active')
    search_fields = ('account__name', 'user__last_name')


@admin.register(models.AccountPromoCode)
class AccountPromoCodeAdmin(admin.ModelAdmin):
    list_display = ('account', 'promo_code', 'applied_on')
    fields = ('account', 'promo_code', 'applied_on')
    search_fields = ('account__name', 'promo_code__code')
    readonly_fields = ('applied_on',)


@admin.register(models.PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = (
        'code',
        'max_usage',
        'max_usage_per_account',
        'months_valid',
        'apply_premium',
        'apply_additional_member',
        'apply_additional_child',
        'stripe',
        'promo_price'
    )
    fields = (
        'code',
        'max_usage',
        'max_usage_per_account',
        'months_valid',
        'apply_premium',
        'apply_additional_member',
        'apply_additional_child',
        'stripe',
        'promo_price'
    )
    search_fields = ('code',)
    list_filter = ('stripe',)
