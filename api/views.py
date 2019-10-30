# -*- coding: utf-8 -*-
from django.http import Http404
from django.shortcuts import get_object_or_404, get_list_or_404

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core import models

from . import serializers

from . import permissions as api_permissions


class ListOrCreateModelWithAccountAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = None
    serializer = None

    def get(self, request, format=None):
        objects = get_list_or_404(self.model, account__in=request.user.accounts.all())
        serializer = self.serializer(objects, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        if not api_permissions.can_create_obj_with_acct(request):
            return Response(None, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ViewOrUpdateModelWithAccountAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = None
    serializer = None

    def get(self, request, pk, format=None):
        obj = get_object_or_404(self.model, pk=pk)
        if not api_permissions.can_view_update_obj_with_acct(request, obj):
            return Response(None, status=status.HTTP_403_FORBIDDEN)
        
        serializer = self.serializer(obj)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        obj = get_object_or_404(self.model, pk=pk)
        if not api_permissions.can_view_update_obj_with_acct(request, obj):
            return Response(None, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChildrenAPIView(ListOrCreateModelWithAccountAPIView):
    model = models.Child
    serializer = serializers.ChildSerializer

    def post(self, request, format=None):
        '''Not allowed from API'''
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class AccountsAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = models.Account
    serializer = serializers.AccountSerializer

    def get(self, request, format=None):
        objects = request.user.accounts.all()
        serializer = self.serializer(objects, many=True)
        return Response(serializer.data)


class AccountAPIView(APIView):
    permission_classes = (IsAuthenticated,)
    model = models.Account
    serializer = serializers.AccountDetailSerializer

    def get(self, request, pk):
        account = self.model.objects.get(pk=pk)
        if account.id != request.user.account.id:
            return Response({}, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer(account)

        return Response(serializer.data)


class DiaperChangeViewSet(viewsets.ModelViewSet):
    queryset = models.DiaperChange.objects.all()
    serializer_class = serializers.DiaperChangeSerializer
    filterset_fields = ('child', 'wet', 'solid', 'color')


class FeedingViewSet(viewsets.ModelViewSet):
    queryset = models.Feeding.objects.all()
    serializer_class = serializers.FeedingSerializer
    filterset_fields = ('child', 'type', 'method')


class NoteViewSet(viewsets.ModelViewSet):
    queryset = models.Note.objects.all()
    serializer_class = serializers.NoteSerializer
    filterset_fields = ('child',)


class NotificationsAPIView(ListOrCreateModelWithAccountAPIView):
    model = models.Notification
    serializer = serializers.NotificationSerializer


class NotificationAPIView(ViewOrUpdateModelWithAccountAPIView):
    model = models.Notification
    serializer = serializers.NotificationSerializer


class SleepViewSet(viewsets.ModelViewSet):
    queryset = models.Sleep.objects.all()
    serializer_class = serializers.SleepSerializer
    filterset_fields = ('child',)


class TemperatureViewSet(viewsets.ModelViewSet):
    queryset = models.Temperature.objects.all()
    serializer_class = serializers.TemperatureSerializer
    filterset_fields = ('child',)


class TimersAPIView(ListOrCreateModelWithAccountAPIView):
    model = models.Timer


class TimerAPIView(ViewOrUpdateModelWithAccountAPIView):
    model = models.Timer
    serializer = serializers.TimerSerializer

    def get(self, request, pk, format=None):
        '''override default implementation so that timer can be refershed'''
        obj = get_object_or_404(self.model, pk=pk)
        if not api_permissions.can_view_update_obj_with_acct(request, obj):
            return Response(None, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer(obj)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        obj = get_object_or_404(self.model, pk=pk)
        account = obj.account
        requesting_start = not obj.active and request.data.get('active')
        if requesting_start and not account.can_start_timer():
            return Response(None, status=status.HTTP_403_FORBIDDEN)

        if not api_permissions.can_view_update_obj_with_acct(request, obj):
            return Response(None, status=status.HTTP_403_FORBIDDEN)

        serializer = self.serializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TummyTimeViewSet(viewsets.ModelViewSet):
    queryset = models.TummyTime.objects.all()
    serializer_class = serializers.TummyTimeSerializer
    filterset_fields = ('child',)


class WeightViewSet(viewsets.ModelViewSet):
    queryset = models.Weight.objects.all()
    serializer_class = serializers.WeightSerializer
    filterset_fields = ('child',)
