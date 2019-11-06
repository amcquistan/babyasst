# -*- coding: utf-8 -*-
from rest_framework import serializers

from django.contrib.auth.models import User
from django.utils import timezone

from core import models, timeline

from babybuddy import models as babybuddy_models


class CoreModelSerializer(serializers.HyperlinkedModelSerializer):
    """
    Provide the child link (used by most core models) and run model clean()
    methods during POST operations.
    """
    child = serializers.PrimaryKeyRelatedField(
        queryset=models.Child.objects.all())

    def validate(self, attrs):
        instance = self.Meta.model(**attrs)
        instance.clean()
        return attrs


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email')


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = babybuddy_models.Account
        fields = ('id', 'name')


class AccountDetailSerializer(serializers.ModelSerializer):
    subscription = serializers.SerializerMethodField()
    payment_source = serializers.SerializerMethodField()

    class Meta:
        model = babybuddy_models.Account
        fields = ('id', 'name', 'subscription', 'payment_source')
        read_only_fields = ('subscription', 'payment_source')


    def get_subscription(self, acct):
        subscription_data = {
          'is_active': False,
          'plans': {}
        }
        is_active, subscription = acct.is_premium_subscriber()
        subscription_data['is_active'] = is_active
        return subscription_data

    def get_payment_source(self, acct):
        payment_source_data = {
          'has_payment_source': False,
          'payment_source': {}
        }
        has_payment_source, payment_source = acct.has_payment_source()
        payment_source_data['has_payment_source'] = has_payment_source
        if has_payment_source:
            payment_source_data['payment_source'] = {
              'brand': payment_source['brand'],
              'exp_month': payment_source['exp_month'],
              'exp_month': payment_source['exp_year'],
              'last4': payment_source['last4']
            }
        return payment_source_data


# class ChildSerializer(serializers.HyperlinkedModelSerializer):
class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Child
        fields = ('id', 'first_name', 'last_name', 'birth_date', 'slug', 'account', 'is_active')
        lookup_field = 'slug'


class TimeLineSerializer(serializers.Serializer):
    child = None
    date = serializers.DateTimeField()
    items = serializers.SerializerMethodField()

    def __init__(self, **kwargs):
        self.child = kwargs.pop('child')
        super(TimeLineSerializer, self).__init__(**kwargs)

    def get_items(self, instance):
        items = []
        date = instance['date']
        for item in timeline.get_objects(self.child, date):
            items.append({
              'time': str(item['time']),
              'event': item['event'],
              'model_name': item['model_name'],
              'type': item.get('type')
            })
        return items


class DiaperChangeSerializer(CoreModelSerializer):
    class Meta:
        model = models.DiaperChange
        fields = ('id', 'child', 'time', 'wet', 'solid', 'color')


class FeedingSerializer(CoreModelSerializer):
    class Meta:
        model = models.Feeding
        fields = ('id', 'child', 'start', 'end', 'duration', 'type', 'method',
                  'amount')


class NoteSerializer(CoreModelSerializer):
    class Meta:
        model = models.Note
        fields = ('id', 'child', 'note', 'time')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Notification
        fields = ('id', 'child', 'account', 'title', 'body', 'url', 'frequency_hours', 'intervals', 'active', 'start', 'end')


class SleepSerializer(CoreModelSerializer):
    class Meta:
        model = models.Sleep
        fields = ('id', 'child', 'start', 'end', 'duration')


class TemperatureSerializer(CoreModelSerializer):
    class Meta:
        model = models.Temperature
        fields = ('id', 'child', 'temperature', 'time')


class TimerSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    
    class Meta:
        model = models.Timer
        fields = (
            'id',
            'name',
            'start',
            'end',
            'duration',
            'active',
            'complete',
            'is_sleeping',
            'is_feeding',
            'is_tummytime',
            'user',
            'account',
            'child'
        )
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name')
        instance.is_sleeping = validated_data.get('is_sleeping', instance.is_sleeping)
        instance.is_feeding = validated_data.get('is_feeding', instance.is_feeding)
        instance.is_tummytime = validated_data.get('is_tummytime', instance.is_tummytime)
        instance.child = validated_data.get('child', instance.child)
        instance.account = validated_data.get('account', instance.account)

        complete = not instance.complete and validated_data.get('complete')
        restart_timer = validated_data.get('active') and not complete and not instance.complete
        if complete:
            instance.complete = complete
            instance.stop()
        
        if not instance.complete:
            instance.stop()

        if restart_timer:
            instance.restart()

        return instance


class TummyTimeSerializer(CoreModelSerializer):
    class Meta:
        model = models.TummyTime
        fields = (
            'id',
            'child',
            'start',
            'end',
            'duration',
            'milestone'
        )


class WeightSerializer(CoreModelSerializer):
    class Meta:
        model = models.Weight
        fields = ('id', 'child', 'weight', 'date')
