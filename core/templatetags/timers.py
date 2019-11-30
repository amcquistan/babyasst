# -*- coding: utf-8 -*-
from django import template

from django.shortcuts import reverse

from core.models import Timer


register = template.Library()


@register.inclusion_tag('core/timer_nav.html', takes_context=True)
def timer_nav(context, active=True):
    """
    Get a list of active Timer instances to include in the nav menu.
    :param context: Django's context data.
    :param active: the state of Timers to filter.
    :returns: a dictionary with timers data.
    """
    request = context['request'] or None
    timers = Timer.unfinished_account_timers(request.user)
    timers_cnt = len(timers)
    # The 'next' parameter is currently not used.
    return {'timers': timers, 'next': request.path, 'timers_cnt': timers_cnt}

@register.inclusion_tag('core/timer_mobile_nav.html', takes_context=True)
def timer_mobile_nav(context):
    request = context['request'] or None
    timers = Timer.unfinished_account_timers(request.user)
    timers_cnt = len(timers)

    url = reverse('core:timer-quick-add')
    if timers_cnt:
        url = reverse('core:timer-list')

    return {'timers_cnt': timers_cnt, 'url': url}
