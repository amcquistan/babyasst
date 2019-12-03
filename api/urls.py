# -*- coding: utf-8 -*-
from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
# router.register(r'children', views.ChildViewSet)
# router.register(r'changes', views.DiaperChangeViewSet)
# router.register(r'feedings', views.FeedingViewSet)
# router.register(r'notes', views.NoteViewSet)
# router.register(r'sleep', views.SleepViewSet)
# router.register(r'temperature', views.TemperatureViewSet)
# router.register(r'timers', views.TimerViewSet)
# router.register(r'tummy-times', views.TummyTimeViewSet)
# router.register(r'weight', views.WeightViewSet)

app_name = 'api'

urlpatterns = [
    # path('api/', include(router.urls)),
    path(
        'api/accounts/',
        views.AccountsAPIView.as_view()
    ),
    path(
        'api/accounts/<int:pk>/',
        views.AccountAPIView.as_view()
    ),
    path(
        'api/accounts/<int:pk>/apply-promo-code/',
        views.AccountPromoCodeAPIView.as_view()
    ),

    path(
        'api/active-timers/',
        views.ActiveTimersAPIView.as_view()
    ),

    path(
        'api/children/',
        views.ChildrenAPIView.as_view()
    ),
    path(
        'api/children/<int:pk>/',
        views.ChildAPIView.as_view()
    ),

    path(
        'api/children/<int:child_id>/timeline/<str:date_str>/',
        views.ChildTimelineAPIView.as_view()
    ),
    
    path(
        'api/children/<int:child_id>/baths/',
        views.BathListOrCreateAPIView.as_view()
    ),
    path(
        'api/children/<int:child_id>/baths/<int:pk>/',
        views.BathViewOrUpdateAPIView.as_view()
    ),

    path(
        'api/children/<int:child_id>/changes/',
        views.DiaperChangeListOrCreateAPIView.as_view()
    ),
    path(
        'api/children/<int:child_id>/changes/<int:pk>/',
        views.DiaperChangeViewOrUpdateAPIView.as_view()
    ),
    
    path(
        'api/children/<int:child_id>/feeding/',
        views.FeedingListOrCreateAPIView.as_view()
    ),
    path(
        'api/children/<int:child_id>/feeding/<int:pk>/',
        views.FeedingViewOrUdateAPIView.as_view()
    ),
    
    path(
        'api/children/<int:child_id>/notes/',
        views.NoteListOrCreateAPIView.as_view()
    ),
    path(
        'api/children/<int:child_id>/notes/<int:pk>/',
        views.NoteViewOrUpdateAPIView.as_view()
    ),
    
    path(
        'api/children/<int:child_id>/sleep/',
        views.SleepListOrCreateAPIView.as_view()
    ),
    path(
        'api/children/<int:child_id>/sleep/<int:pk>/',
        views.SleepViewOrUpdateAPIView.as_view()
    ),

    path(
        'api/children/<int:child_id>/temperature/',
        views.TemperatureListOrCreateAPIView.as_view()
    ),
    path(
        'api/children/<int:child_id>/temperature/<int:pk>/',
        views.TemperatureViewOrUpdateAPIView.as_view()
    ),
    
    path(
        'api/children/<int:child_id>/tummy-time/',
        views.TummyTimeListOrCreateAPIView.as_view()
    ),
    path(
        'api/children/<int:child_id>/tummy-time/<int:pk>/',
        views.TummyTimeViewOrUpdateAPIView.as_view()
    ),
    
    path(
        'api/children/<int:child_id>/weight/',
        views.WeightListOrCreateAPIView.as_view()
    ),
    path(
        'api/children/<int:child_id>/weight/<int:pk>/',
        views.WeightViewOrUpdateAPIView.as_view()
    ),

    path(
        'api/notifications/',
        views.NotificationsAPIView.as_view()
    ),
    path(
        'api/notifications/<int:pk>/',
        views.NotificationAPIView.as_view()
    ),

    path(
        'api/timers/',
        views.TimersAPIView.as_view()
    ),
    path(
        'api/timers/<int:pk>/',
        views.TimerAPIView.as_view()
    ),

    # path('api/auth/', include(
    #     'rest_framework.urls',
    #     namespace='rest_framework'
    # ))
]
