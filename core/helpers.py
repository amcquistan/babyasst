# -*- coding: utf-8 -*-
from django.template.defaultfilters import slugify

SLUG_PREFIX_MAX = 10000

def validate_slug(klass, txt):
    slug_tmpl = "{}-{}"
    slug = slugify(txt) 
    if klass.objects.filter(slug=slug).count() != 0:
        for i in range(1, SLUG_PREFIX_MAX):
            slug = slug_tmpl.format(slug, i)
            if klass.objects.filter(slug=slug).count() == 0:
                break
    return slug


def validate_account(user, obj=None, account=None, check_subscription=False):
    accounts = user.accounts.all()
    acct_ids = {acct.id for acct in accounts}
    if obj:
        is_acct_member = obj.account.id in acct_ids
    elif account:
        is_acct_member = account.id in acct_ids
    else:
        return False, accounts

    if not is_acct_member:
        return False, accounts

    if check_subscription:
        account = account if account else obj.account
        return account.can_add_notification(), accounts

    return True, accounts


