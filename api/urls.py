# -*- coding: utf-8 -*-
from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
# router.register(r'children', views.ChildViewSet)
router.register(r'changes', views.DiaperChangeViewSet)
router.register(r'feedings', views.FeedingViewSet)
router.register(r'notes', views.NoteViewSet)
router.register(r'sleep', views.SleepViewSet)
router.register(r'temperature', views.TemperatureViewSet)
# router.register(r'timers', views.TimerViewSet)
router.register(r'tummy-times', views.TummyTimeViewSet)
router.register(r'weight', views.WeightViewSet)

app_name = 'api'

urlpatterns = [
    # path('api/', include(router.urls)),
    path('api/accounts/', views.AccountsAPIView.as_view()),
    path('api/accounts/<int:pk>/', views.AccountAPIView.as_view()),
    path('api/children/', views.ChildrenAPIView.as_view()),
    path('api/notifications/', views.NotificationsAPIView.as_view()),
    path('api/notifications/<int:pk>/', views.NotificationAPIView.as_view()),
    path('api/timers/', views.TimersAPIView.as_view()),
    path('api/timers/<int:pk>/', views.TimerAPIView.as_view()),
    # path('api/auth/', include(
    #     'rest_framework.urls',
    #     namespace='rest_framework'
    # ))
]
