# -*- coding: utf-8 -*-

from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import User
from django.utils import timezone

from rest_framework import serializers

from babybuddy import models as babybuddy_models

from core import models, timeline

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
          'plans': {},
          'member_count': acct.account_member_settings.filter(is_active=True).count(),
          'children_count': acct.children.filter(is_active=True).count(),
          'max_children': acct.max_children(),
          'max_members': acct.max_account_members()
        }

        subscription_data['is_active'] = acct.is_premium_subscriber()

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
              'exp_year': payment_source['exp_year'],
              'last4': payment_source['last4']
            }
        return payment_source_data


class ChildSerializer(serializers.ModelSerializer):
    last_feeding = serializers.SerializerMethodField()
    last_change = serializers.SerializerMethodField()
    last_sleep = serializers.SerializerMethodField()
    last_temperature = serializers.SerializerMethodField()
    last_tummytime = serializers.SerializerMethodField()
    last_weight = serializers.SerializerMethodField()

    class Meta:
        model = models.Child
        fields = (
            'id',
            'first_name',
            'last_name',
            'birth_date',
            'slug',
            'account',
            'is_active',
            'last_feeding',
            'last_change',
            'last_sleep',
            'last_temperature',
            'last_tummytime',
            'last_weight',
        )
        lookup_field = 'slug'

    def get_last_feeding(self, instance):
        feeding = instance.feeding.order_by('-start').first()
        data = {}
        if feeding:
            data = FeedingSerializer(feeding).data
        return data

    def get_last_change(self, instance):
        change = instance.diaper_change.order_by('-time').first()
        data = {}
        if change:
            data = DiaperChangeSerializer(change).data
        return data

    def get_last_sleep(self, instance):
        sleep = instance.sleep.order_by('-start').first()
        data = {}
        if sleep:
            data = SleepSerializer(sleep).data
        return data

    def get_last_temperature(self, instance):
        temperature = instance.temperature.order_by('-time').first()
        data = {}
        if temperature:
            data = TemperatureSerializer(temperature).data
        return data

    def get_last_tummytime(self, instance):
        tummytime = instance.tummy_time.order_by('-start').first()
        data = {}
        if tummytime:
            data = TummyTimeSerializer(tummytime).data
        return data

    def get_last_weight(self, instance):
        weight = instance.weight.order_by('-date').first()
        data = {}
        if weight:
            data = WeightSerializer(weight).data
        return data


class DiaperChangeSerializer(CoreModelSerializer):
    class Meta:
        model = models.DiaperChange
        fields = ('id', 'child', 'time', 'wet', 'solid', 'color')


class FeedingSerializer(CoreModelSerializer):
    class Meta:
        model = models.Feeding
        fields = (
            'id',
            'child',
            'start',
            'end',
            'duration',
            'type',
            'method',
            'amount'
        )


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
        fields = ('id', 'child', 'start', 'end', 'duration', 'nap')
        read_only_fields = ('nap',)


class TemperatureSerializer(CoreModelSerializer):
    class Meta:
        model = models.Temperature
        fields = ('id', 'child', 'temperature', 'time')


class TimeLineSerializer(serializers.Serializer):
    child = None
    date = serializers.DateTimeField()
    items = serializers.SerializerMethodField()

    def __init__(self, **kwargs):
        self.child = kwargs.pop('child')
        super(TimeLineSerializer, self).__init__(**kwargs)

    # def get_items(self, instance):
    #     items = []
    #     date = instance['date']
    #     for item in timeline.get_objects(self.child, date):
    #         items.append({
    #           'time': str(item['time']),
    #           'event': item['event'],
    #           'model_name': item['model_name'],
    #           'detail': item['detail'],
    #           'type': item.get('type')
    #         })
    #     return items

    def get_items(self, instance):
        changes, feedings, sleep = timeline.get_timeline(self.child, instance['date'])
        data = {
          'changes': DiaperChangeSerializer(changes, many=True).data,
          'feedings': FeedingSerializer(feedings, many=True).data,
          'sleep': SleepSerializer(sleep, many=True).data
        }
        return data

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
    
    def create(self, validated_data):
        timer = models.Timer.objects.create(**validated_data)
        timer.restart()
        return timer

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
            instance.save()
        
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
