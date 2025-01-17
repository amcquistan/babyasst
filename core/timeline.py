# -*- coding: utf-8 -*-
from datetime import timedelta

from django.db.models import Q
from django.utils import timezone
from django.utils.translation import gettext as _

from core.models import DiaperChange, Feeding, Sleep, TummyTime
from core.utils import duration_parts, duration_string

def duration_stradles_day(items, min_date, max_date):

    filtered_items = []
    for item in items:
        stradles_start = item.start <= max_date and item.end > min_date
        stradles_end = item.end >= min_date and item.start < max_date
        if item.start >= min_date and stradles_start or stradles_end:
            filtered_items.append(item)
    return filtered_items

def get_timeline(child, min_date, max_date):
    fn = duration_stradles_day
    s = min_date + timedelta(minutes=-180)
    e = max_date + timedelta(minutes=180)
    changes = DiaperChange.objects.filter(
        child=child,
        time__range=(min_date, max_date + timedelta(minutes=3))
      ).order_by('time')
    feedings = fn(Feeding.objects.filter(
        child=child,
        start__range=(s, e)
      ).order_by('start'), min_date, max_date)
    sleep = fn(Sleep.objects.filter(
        child=child,
        start__range=(s, e)
      ).order_by('-start'), min_date, max_date)
    tummytime = fn(TummyTime.objects.filter(
        child=child,
        start__range=(s, e)
      ).order_by('-start'), min_date, max_date)
    return changes, feedings, sleep, tummytime


def get_objects(child, date):
    """
    Create a time-sorted dictionary of all events for a child.
    :param child: an instance of a Child.
    :param date: a DateTime instance for the day to be summarized.
    :returns: a list of the day's events.
    """
    min_date = date
    max_date = date.replace(hour=23, minute=59, second=59)
    events = []

    instances = DiaperChange.objects.filter(child=child).filter(
        time__range=(min_date, max_date)).order_by('-time')
    for instance in instances:
        change_type = ''
        if instance.wet and instance.solid:
            change_type = 'wet and solid'
        elif instance.wet:
            change_type = 'wet'
        elif instance.solid:
            change_type = 'solid'

        events.append({
            'time': timezone.localtime(instance.time),
            'event': _('%(child)s had a diaper change.') % {
                'child': child.first_name,
                'change_type': change_type
            },
            'detail': _('%(change_type)s (%(color)s)') % {
                'change_type': change_type,
                'color': instance.color if instance.color else ''
            },
            'model_name': instance.model_name,
        })

    instances = Feeding.objects.filter(child=child).filter(
        start__range=(min_date, max_date)).order_by('-start')
    for instance in instances:
        feeding_type = ''
        if instance.type == 'breast milk':
            feeding_type = "{type} {method}".format(type=instance.type, method=instance.method)
        elif instance.type in ['formula', 'fortified breast milk']:
            if instance.amount:
                feeding_type = "{type} ({amount})".format(type=instance.type, amount=instance.amount)
            else:
                feeding_type = "{type}".format(type=instance.type)
        events.append({
            'time': timezone.localtime(instance.start),
            'event': _('%(child)s started feeding.') % {
                'child': instance.child.first_name
            },
            'detail': _('%(feeding_type)s') % {
                'feeding_type': feeding_type
            },
            'model_name': instance.model_name,
            'type': 'start'
        })
        events.append({
            'time': timezone.localtime(instance.end),
            'event': _('%(child)s finished feeding.') % {
                'child': instance.child.first_name
            },
            'detail': _('%(feeding_type)s') % {
                'feeding_type': feeding_type
            },
            'model_name': instance.model_name,
            'type': 'end'
        })

    instances = Sleep.objects.filter(child=child).filter(
        start__range=(min_date, max_date)).order_by('-start')
    for instance in instances:
        events.append({
            'time': timezone.localtime(instance.start),
            'event': _('%(child)s fell asleep.') % {
                'child': instance.child.first_name
            },
            'detail': _('%(duration)s') % {
                'duration': ''
            },
            'model_name': instance.model_name,
            'type': 'start'
        })
        events.append({
            'time': timezone.localtime(instance.end),
            'event': _('%(child)s woke up.') % {
                'child': instance.child.first_name
            },
            'detail': _('%(duration)s') % {
                'duration': duration_string(instance.duration)
            },
            'model_name': instance.model_name,
            'type': 'end'
        })

    instances = TummyTime.objects.filter(child=child).filter(
        start__range=(min_date, max_date)).order_by('-start')
    for instance in instances:
        events.append({
            'time': timezone.localtime(instance.start),
            'event': _('%(child)s started tummy time!') % {
                'child': instance.child.first_name
            },
            'detail': _('%(duration)s') % {
                'duration': ''
            },
            'model_name': instance.model_name,
            'type': 'start'
        })
        events.append({
            'time': timezone.localtime(instance.end),
            'event': _('%(child)s finished tummy time.') % {
                'child': instance.child.first_name
            },
            'detail': _('%(duration)s') % {
                'duration': duration_string(instance.duration)
            },
            'model_name': instance.model_name,
            'type': 'end'
        })

    events.sort(key=lambda x: x['time'], reverse=True)

    return events
