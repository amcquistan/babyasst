# -*- coding: utf-8 -*-

from __future__ import absolute_import, unicode_literals
from celery import task

from datetime import timedelta

from django.conf import settings
from django.core.mail import EmailMessage
from django.template.loader import get_template
from django.utils import timezone

from twilio.rest import Client

from core.models import NotificationEvent

class ValidatedAccount:
    def __init__(self, account, is_valid=False):
        self.account = account
        self.is_valid = is_valid


@task()
def notifications_task():
    twilio_client = Client(settings.TWILIO_SID, settings.TWILIO_AUTH_TOKEN)
    now = timezone.now()
    notification_events = NotificationEvent.objects.filter(
                                                      sent=False,
                                                      send_at__lte=now
                                                    ).order_by('send_at').all()

    for notification_evt in notification_events:
        try:
            user = notification_evt.user
            account = notification_evt.notification.account
            account_member_settings = user.account_member_settings.get(account=account)
            notification = notification_evt.notification
            user_phone = user.settings.phone_number
            if account_member_settings.phone_notifications_enabled and user_phone:
                # send text notification
                user_phone = user_phone if user_phone.startswith('+') else '+' + user_phone
                message = twilio_client.messages.create(
                    body=notification.body,
                    from_=settings.TWILIO_PHONE,
                    to=user_phone
                )
                print(f'sending text message notification to {user.email} phone {user_phone} twilio message id {message.sid}')

            if account_member_settings.email_notifications_enabled:
                # send email notification
                print(f'sending email notification to {user.email}')
            
            # semantically it doesn't really make sense to say this has been sent if 
            # the user doesn't have email or phone notification settings enabled
            # but this does keep from having old notifications sent if a user
            # later enables phone or email notifications
            notification_evt.sent = True

            notification_evt.save()
        except Exception as e:
            print(e)

