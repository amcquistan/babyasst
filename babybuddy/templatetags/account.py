# -*- coding: utf-8 -*-
from datetime import datetime

from django.conf import settings
from django import template

from babybuddy.models import stripe

register = template.Library()

@register.simple_tag()
def stripe_client_key():
    return settings.STRIPE_CLIENT_KEY


@register.inclusion_tag('babybuddy/account_subscriptions.html', takes_context=True)
def subscriptions(context, account):
    cust = account.find_or_create_stripe_customer()
    
    subscription_items = []
    if account.is_premium_subscriber(stripe_customer=cust):
        for sub in cust.subscriptions['data']:
            renew_date = datetime.fromtimestamp(sub.current_period_end)
            for item in sub['items']['data']:
                started = datetime.fromtimestamp(item.created)
                quantity = item.quantity
                prod = stripe.Product.retrieve(item.plan.product)
                unit_label = prod.name
                amount = round(float(item.plan.amount) / 100.0, 2)
                subscription_items.append({
                  'renew_date': renew_date,
                  'started': started,
                  'plan': unit_label,
                  'quantity': quantity,
                  'amount': amount
                })

    context['subscription_items'] = subscription_items
    context['subscription_total'] = sum([i['amount'] for i in subscription_items])
    return context