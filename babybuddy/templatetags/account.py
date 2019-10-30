# -*- coding: utf-8 -*-
from django.conf import settings
from django import template

register = template.Library()

@register.simple_tag()
def stripe_client_key():
    return settings.STRIPE_CLIENT_KEY

