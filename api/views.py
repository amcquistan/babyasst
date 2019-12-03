# -*- coding: utf-8 -*-
from django.http import Http404
from django.shortcuts import get_object_or_404, get_list_or_404

from rest_framework import viewsets, status
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import ListModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from babybuddy import models as babybuddy_models
from core import models, timeline

from . import serializers


from . import permissions as api_permissions


class ListOrCreateModelWithAccountAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = None
    serializer_class = None

    def get(self, request, format=None):
        objects = get_list_or_404(self.model, account__in=request.user.accounts.all())
        serializer = self.serializer_class(objects, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        obj_account = None
        account_id = request.data.get('account')
        if account_id:
            obj_account = get_object_or_404(babybuddy_models.Account, pk=account_id)
        
        if not api_permissions.can_create_obj_with_acct(request, obj_account=obj_account):
            return Response(None, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewOrUpdateModelWithAccountAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = None
    serializer_class = None

    def get(self, request, pk, format=None):
        obj = get_object_or_404(self.model, pk=pk)
        permission_check = api_permissions.can_view_update_obj_with_acct(request, obj)
        if not permission_check.passed_check:
            return Response(permission_check.message, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.serializer_class(obj)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        obj = get_object_or_404(self.model, pk=pk)
        if not api_permissions.can_view_update_obj_with_acct(request, obj):
            return Response(None, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListOrCreateChildActivityAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)
    model = None
    serializer_class = None
    child = None
    
    def get_child(self):
        if self.child is None:
            self.child = get_object_or_404(models.Child, pk=self.kwargs.get('child_id'))
        return self.child

    def get_queryset(self):
        child = self.get_child()
        return get_list_or_404(self.model, child=child)

    def get(self, request, child_id, format=None):
        child = self.get_child()
        permission_check = api_permissions.can_view_update_obj_with_acct(request, child)
        if not permission_check.passed_check:
            return Response({'message': permission_check.message}, status=status.HTTP_403_FORBIDDEN)

        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, child_id, format=None):
        child = get_object_or_404(models.Child, pk=child_id)
        permission_check = api_permissions.can_view_update_obj_with_acct(request, child)
        if not permission_check.passed_check:
            return Response({'message': permission_check.message}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewOrUpdateChildActivityAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = None
    serializer_class = None

    def get(self, request, child_id, pk, format=None):
        child = get_object_or_404(models.Child, pk=child_id)

        permission_check = api_permissions.can_view_update_obj_with_acct(request, child)
        if not permission_check.passed_check:
            return Response({'message': permission_check.message}, status=status.HTTP_403_FORBIDDEN)

        obj = get_object_or_404(self.model, pk=pk)
        serializer = self.serializer_class(obj)
        return Response(serializer.data)

    def post(self, request, child_id, pk, format=None):
        child = get_object_or_404(models.Child, pk=child_id)
        
        permission_check = api_permissions.can_view_update_obj_with_acct(request, child)
        if not permission_check.passed_check:
            return Response({'message': permission_check.message}, status=status.HTTP_403_FORBIDDEN)

        obj = get_object_or_404(self.model, pk=pk)
        serializer = self.serializer_class(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, child_id, pk, format=None):
        child = get_object_or_404(models.Child, pk=child_id)

        permission_check = api_permissions.can_view_update_obj_with_acct(request, child)
        if not permission_check.passed_check:
            return Response({'message': permission_check.message}, status=status.HTTP_403_FORBIDDEN)

        obj = get_object_or_404(self.model, pk=pk)
        obj.delete()

        return Response({}, status=status.HTTP_202_ACCEPTED)


class ChildrenAPIView(ListOrCreateModelWithAccountAPIView):
    model = models.Child
    serializer_class = serializers.ChildSerializer

    def post(self, request, format=None):
        '''Not allowed from API'''
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class ChildAPIView(ViewOrUpdateModelWithAccountAPIView):
    model = models.Child
    serializer_class = serializers.ChildSerializer

    def post(self, request, format=None):
        '''Not allowed from API'''
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class ChildTimelineAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = models.Child
    serializer_class = serializers.TimeLineSerializer

    def get(self, request, child_id, date_str, format=None):
        child = get_object_or_404(self.model, pk=child_id)

        permission_check = api_permissions.can_view_update_obj_with_acct(request, child)
        if not permission_check.passed_check:
            return Response({'message': permission_check.message}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(child=child, data={'date': date_str})
        if serializer.is_valid():
            data = serializer.data
            return Response(data)
        return Response({}, status=status.HTTP_400_BAD_REQUEST)


class AccountsAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = babybuddy_models.Account
    serializer_class = serializers.AccountSerializer

    def get(self, request, format=None):
        objects = request.user.accounts.all()
        serializer = self.serializer_class(objects, many=True)
        return Response(serializer.data)


class AccountAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = babybuddy_models.Account
    serializer_class = serializers.AccountDetailSerializer

    def get(self, request, pk):
        account = self.model.objects.get(pk=pk)
        if account.id != request.user.account.id:
            return Response({}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(account)

        return Response(serializer.data)


class ActiveTimersAPIView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        timers = models.Timer.unfinished_account_timers(request.user)
        serializer = serializers.TimerSerializer(timers, many=True)
        return Response(serializer.data)


class AccountPromoCodeAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = babybuddy_models.Account
    
    def post(self, request, pk):
        account = self.model.objects.get(pk=pk)
        if account.id != request.user.account.id:
            return Response({}, status=status.HTTP_403_FORBIDDEN)

        promo_code = get_object_or_404(babybuddy_models.PromoCode, code__iexact=request.data.get('promo_code'))

        acct_promo_codes = babybuddy_models.AccountPromoCode.objects.filter(promo_code=promo_code).all()

        total_usage = 0
        usage_this_acct = 0
        for acct_promo_code in acct_promo_codes:
            total_usage += 1
            if acct_promo_code.account.id == account.id:
                usage_this_acct += 1

        if total_usage > promo_code.max_usage or usage_this_acct > promo_code.max_usage_per_account:
            return Response({'valid': False, 'message': 'Max usage exceeded', 'requires_purchase': True})
        
        msg = ''
        if not promo_code.stripe:
            babybuddy_models.AccountPromoCode.objects.create(
              account=account,
              promo_code=promo_code
            )
            
            if promo_code.apply_premium:
                msg = 'Promo applied for premium service'
            elif promo_code.apply_additional_member:
                msg = 'Promo applied for an additional account member'
            elif promo_code.apply_additional_child:
                msg = 'Promo applied for an additional child'

            if promo_code.months_valid != -1:
                msg += f' for {promo_code.months_valid} months'

        else:
            if promo_code.apply_premium:
                msg = f'Promo available for premium service at ${promo_code.promo_price}'
            elif promo_code.apply_additional_member:
                msg = 'Promo available for an additional account member at ${promo_code.promo_price}'
            elif promo_code.apply_additional_child:
                msg = 'Promo available for an additional child at ${promo_code.promo_price}'

            if promo_code.months_valid != -1:
                msg += f' for {promo_code.months_valid} months'

        return Response({'valid': True, 'message': msg, 'requires_purchase': promo_code.stripe})


class BathListOrCreateAPIView(ListOrCreateChildActivityAPIView):
    model = models.Bath
    serializer_class = serializers.BathSerializer


class BathViewOrUpdateAPIView(ViewOrUpdateChildActivityAPIView):
    model = models.Bath
    serializer_class = serializers.BathSerializer


class DiaperChangeListOrCreateAPIView(ListOrCreateChildActivityAPIView):
    model = models.DiaperChange
    serializer_class = serializers.DiaperChangeSerializer


class DiaperChangeViewOrUpdateAPIView(ViewOrUpdateChildActivityAPIView):
    model = models.DiaperChange
    serializer_class = serializers.DiaperChangeSerializer


class FeedingListOrCreateAPIView(ListOrCreateChildActivityAPIView):
    model = models.Feeding
    serializer_class = serializers.FeedingSerializer


class FeedingViewOrUdateAPIView(ViewOrUpdateChildActivityAPIView):
    model = models.Feeding
    serializer_class = serializers.FeedingSerializer


class NoteListOrCreateAPIView(ListOrCreateChildActivityAPIView):
    model = models.Note
    serializer_class = serializers.NoteSerializer


class NoteViewOrUpdateAPIView(ViewOrUpdateChildActivityAPIView):
    model = models.Note
    serializer_class = serializers.NoteSerializer


class SleepListOrCreateAPIView(ListOrCreateChildActivityAPIView):
    model = models.Sleep
    serializer_class = serializers.SleepSerializer


class SleepViewOrUpdateAPIView(ViewOrUpdateChildActivityAPIView):
    model = models.Sleep
    serializer_class = serializers.SleepSerializer


class TemperatureListOrCreateAPIView(ListOrCreateChildActivityAPIView):
    model = models.Temperature
    serializer_class = serializers.TemperatureSerializer


class TemperatureViewOrUpdateAPIView(ViewOrUpdateChildActivityAPIView):
    model = models.Temperature
    serializer_class = serializers.TemperatureSerializer


class TummyTimeListOrCreateAPIView(ListOrCreateChildActivityAPIView):
    model = models.TummyTime
    serializer_class = serializers.TummyTimeSerializer


class TummyTimeViewOrUpdateAPIView(ViewOrUpdateChildActivityAPIView):
    model = models.TummyTime
    serializer_class = serializers.TummyTimeSerializer


class WeightListOrCreateAPIView(ListOrCreateChildActivityAPIView):
    model = models.Weight
    serializer_class = serializers.WeightSerializer


class WeightViewOrUpdateAPIView(ViewOrUpdateChildActivityAPIView):
    model = models.Weight
    serializer_class = serializers.WeightSerializer


class NotificationsAPIView(ListOrCreateModelWithAccountAPIView):
    model = models.Notification
    serializer = serializers.NotificationSerializer


class NotificationAPIView(ViewOrUpdateModelWithAccountAPIView):
    model = models.Notification
    serializer = serializers.NotificationSerializer


class TimersAPIView(ListOrCreateModelWithAccountAPIView):
    model = models.Timer
    serializer_class = serializers.TimerSerializer


class TimerAPIView(ViewOrUpdateModelWithAccountAPIView):
    model = models.Timer
    serializer_class = serializers.TimerSerializer

    def get(self, request, pk, format=None):
        '''override default implementation so that timer can be refershed'''
        timer = get_object_or_404(self.model, pk=pk)
        permission_check = api_permissions.can_view_update_obj_with_acct(request, timer)
        if not permission_check.passed_check:
            return Response({'message': permission_check.message}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(timer)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        timer = get_object_or_404(self.model, pk=pk)
        account = timer.account
        requesting_start = not timer.active and request.data.get('active')
        if requesting_start and not account.can_start_timer():
            return Response(None, status=status.HTTP_403_FORBIDDEN)

        permission_check = api_permissions.can_view_update_obj_with_acct(request, timer)
        if not permission_check.passed_check:
            return Response({'message': permission_check.message}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer_class(timer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

