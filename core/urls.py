# -*- coding: utf-8 -*-
from django.urls import path

from . import views

app_name = 'core'

urlpatterns = [
    path(
        'children/',
        views.ChildList.as_view(),
        name='child-list'
    ),
    path(
        'children/add/',
        views.ChildAdd.as_view(),
        name='child-add'
    ),
      path(
        'children/<slug:slug>/',
        views.ChildDetail.as_view(),
        name='child'
    ),
    path(
        'children/<slug:slug>/edit/',
        views.ChildUpdateView.as_view(),
        name='child-update'
    ),
    path(
        'children/<slug:slug>/delete/',
        views.ChildDeleteView.as_view(),
        name='child-delete'
    ),
    path(
        'children/<slug:slug>/changes/',
        views.DiaperChangeAddListView.as_view(),
        name='diaperchange'
    ),
    path(
        'changes/add/',
        views.DiaperChangeQuickAddView.as_view(),
        name='diaperchange-quick-add'
    ),
    path(
        'children/<slug:slug>/changes/<int:pk>/',
        views.DiaperChangeUpdateView.as_view(),
        name='diaperchange-update'
    ),
    path(
        'children/<slug:slug>/changes/<int:pk>/delete/',
        views.DiaperChangeDeleteView.as_view(),
        name='diaperchange-delete'
    ),
    path(
        'feeding/add/',
        views.FeedingQuickAddView.as_view(),
        name='feeding-quick-add'
    ),
    path(
        'children/<slug:slug>/feedings/',
        views.FeedingAddListView.as_view(),
        name='feeding'
    ),
    path(
        'children/<slug:slug>/feedings/<int:pk>/',
        views.FeedingUpdateView.as_view(),
        name='feeding-update'
    ),
    path(
        'children/<slug:slug>/feedings/<int:pk>/delete/',
        views.FeedingDeleteView.as_view(),
        name='feeding-delete'
    ),
    path(
        'children/<slug:slug>/notes/',
        views.NoteAddListView.as_view(),
        name='note'
    ),
    path(
        'notes/add/',
        views.NoteQuickAddView.as_view(),
        name='note-quick-add'
    ),
    path(
        'children/<slug:slug>/notes/<int:pk>/',
        views.NoteUpdateView.as_view(),
        name='note-update'
    ),
    path(
        'children/<slug:slug>/notes/<int:pk>/delete/',
        views.NoteDeleteView.as_view(),
        name='note-delete'
    ),
    path(
        'notifications/add/',
        views.NotificationAddView.as_view(),
        name='notification-add'
    ),
    path(
        'notifications/',
        views.NotificationsListView.as_view(),
        name='notification-list'
    ),
    path(
        'notifications/<int:pk>/',
        views.NotificationDetailView.as_view(),
        name='notification-detail'
    ),
    path(
        'children/<slug:slug>/sleep/',
        views.SleepAddListView.as_view(),
        name='sleep'
    ),
    path(
        'sleep/add/',
        views.SleepQuickAddView.as_view(),
        name='sleep-quick-add'
    ),
    path(
        'children/<slug:slug>/sleep/<int:pk>/',
        views.SleepUpdateView.as_view(),
        name='sleep-update'
    ),
    path(
        'children/<slug:slug>/sleep/<int:pk>/delete/',
        views.SleepDeleteView.as_view(),
        name='sleep-delete'
    ),
    path(
        'children/<slug:slug>/temperature/',
        views.TemperatureAddListView.as_view(),
        name='temperature'
    ),
    path(
        'temperature/add/',
        views.TemperatureQuickAddView.as_view(),
        name='temperature-quick-add'
    ),
    path(
        'children/<slug:slug>/temperature/<int:pk>/',
        views.TemperatureUpdateView.as_view(),
        name='temperature-update'
    ),
    path(
        'children/<slug:slug>/temperature/<int:pk>/delete/',
        views.TemperatureDeleteView.as_view(),
        name='temperature-delete'
    ),

    path(
        'children/<slug:slug>/timers/',
        views.TimerAddListView.as_view(),
        name='timer'
    ),
    path(
        'timers/',
        views.TimerListView.as_view(),
        name='timer-list'
    ),
    # path(
    #     'timer/add/',
    #     views.TimerAddQuickView.as_view(),
    #     name='timer-quick-add'
    # ),
    path(
        'timer/add/',
        views.TimerQuickAddView.as_view(),
        name='timer-quick-add'
    ),
    path(
        'timer/<int:pk>/',
        views.TimerDetailView.as_view(),
        name='timer-detail'
    ),
    path(
        'timer/<int:pk>/edit/',
        views.TimerUpdateView.as_view(),
        name='timer-update'
    ),
    path(
        'timer/<int:pk>/delete/',
        views.TimerDeleteView.as_view(),
        name='timer-delete'
    ),
    path(
        'timer/<int:pk>/stop/',
        views.TimerCompleteView.as_view(),
        name='timer-complete'
    ),
    # path(
    #     'timer/<int:pk>/restart/',
    #     views.TimerRestartView.as_view(),
    #     name='timer-restart'
    # ),
    path(
        'timer/<int:pk>/feeding/',
        views.FeedingAddFromTimerView.as_view(),
        name='feeding-add-from-timer'
    ),
    path(
        'timer/<int:pk>/sleep/',
        views.SleepAddFromTimerView.as_view(),
        name='feeding-add-from-timer'
    ),
    path(
        'timer/<int:pk>/tummy-time/',
        views.TummyTimeAddFromTimerView.as_view(),
        name='feeding-add-from-timer'
    ),
    path(
        'children/<slug:slug>/tummy-time/',
        views.TummyTimeAddListView.as_view(),
        name='tummytime'
    ),
    path(
        'tummy-time/add/',
        views.TummyTimeQuickAddView.as_view(),
        name='tummytime-quick-add'
    ),
    path(
        'children/<slug:slug>/tummy-time/<int:pk>/',
        views.TummyTimeUpdateView.as_view(),
        name='tummytime-update'
    ),
    path(
        'children/<slug:slug>/tummy-time/<int:pk>/delete/',
        views.TummyTimeDeleteView.as_view(),
        name='tummytime-delete'
    ),

    path(
        'children/<slug:slug>/weight/',
        views.WeightAddListView.as_view(),
        name='weight'
    ),
    path(
        'weight/add/',
        views.WeightQuickAddView.as_view(),
        name='weight-quick-add'
    ),
    path(
        'children/<slug:slug>/weight/<int:pk>/',
        views.WeightUpdateView.as_view(),
        name='weight-update'
    ),
    path(
        'children/<slug:slug>/weight/<int:pk>/delete/',
        views.WeightDeleteView.as_view(),
        name='weight-delete'
    ),
]
