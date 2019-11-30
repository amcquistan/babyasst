# -*- coding: utf-8 -*-
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.contrib.auth import urls
from django.urls import include, path, reverse_lazy

from . import views

app_patterns = [
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    path('tos/', views.TOSView.as_view(), name='tos'),
    path('privacy/', views.PrivacyView.as_view(), name='privacy'),
    path('signup/', views.RegisterView.as_view(), name='signup'),
    path(
        'password_reset/',
        auth_views.PasswordResetView.as_view(
            success_url=reverse_lazy('babybuddy:password_reset_done')
        ),
        name='password_reset'
    ),
    path(
        'password_reset_confirm/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(
            success_url=reverse_lazy('babybuddy:password_reset_complete')
        ),
        name='password_reset_confirm'
    ),
    path(
        'password_reset_complete/',
        auth_views.PasswordResetCompleteView.as_view(),
        name='password_reset_complete'
    ),
    path(
        'password_reset_done/',
        auth_views.PasswordResetDoneView.as_view(),
        name='password_reset_done'
    ),
    path('', views.RootRouter.as_view(), name='root-router'),
    path('welcome/', views.Welcome.as_view(), name='welcome'),

    path(
        'user/password/',
        views.UserPassword.as_view(),
        name='user-password'
    ),
    # path(
    #     'user/reset-api-key/',
    #     views.UserResetAPIKey.as_view(),
    #     name='user-reset-api-key'
    # ),
    path(
        'user/settings/',
        views.UserSettings.as_view(),
        name='user-settings'
    ),
    path(
        'accounts/',
        views.AccountsView.as_view(),
        name='accounts'
    ),
    path(
        'account-member-settings/<int:pk>/',
        views.AccountsUpdateView.as_view(),
        name='accounts-update'
    ),
    path(
        'user-account/',
        views.UserAccountView.as_view(),
        name='user-account'
    ),
    path(
        'user-account/<int:account_id>/delete/',
        views.UserAccountDeleteView.as_view(),
        name='user-account-delete'
    ),
    path(
        'user-account/<int:account_id>/invite/',
        views.UserAccountInviteMemberView.as_view(),
        name='user-account-invite'
    ),
    path(
        'user-account/<int:account_id>/invite/<int:user_id>/accept/',
        views.UserAccountInviteMemberAcceptView.as_view(),
        name='user-account-invite-accept'
    ),
    path(
        'user-account/<int:account_id>/account-member/<int:user_id>/activate/',
        views.UserAccountMemberActivateView.as_view(),
        name='user-account-member-activate'
    ),
    path(
        'user-account/<int:account_id>/account-member/<int:user_id>/deactivate/',
        views.UserAccountMemberDeactivateView.as_view(),
        name='user-account-member-deactivate'
    ),
    path(
        'user-account/<int:account_id>/account-member/<int:user_id>/delete/',
        views.UserAccountMemberDeleteView.as_view(),
        name='user-account-member-delete'
    ),
    path(
        'user-account/<int:pk>/subscription/',
        views.UserAccountSubscriptionView.as_view(),
        name='user-account-subscription'
    ),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('api.urls', namespace='api')),
    path('', include((app_patterns, 'babybuddy'), namespace='babybuddy')),
    path('user/lang', include('django.conf.urls.i18n')),
    path('', include('core.urls', namespace='core')),
    path('', include('dashboard.urls', namespace='dashboard')),
    path('', include('reports.urls', namespace='reports')),
]

if settings.DEBUG:  # pragma: no cover
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )
