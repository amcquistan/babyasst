# -*- coding: utf-8 -*-
from django import template

from core.models import Notification

register = template.Library()

@register.inclusion_tag('core/notification_nav.html', takes_context=True)
def notification_nav(context, active=True):
    """
    Get a list of active Notification instances to include in the nav menu.
    :param context: Django's context data.
    :param active: the state of Notifications to filter.
    :returns: a dictionary with notifications data.
    """
    request = context['request'] or None
    notifications = Notification.objects.filter(active=active, user=request.user)
    # The 'next' parameter is currently not used.
    return {'notifications': notifications, 'next': request.path}
