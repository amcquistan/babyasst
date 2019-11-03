import os

from celery.schedules import crontab

from django.utils.translation import gettext_lazy as _
from dotenv import load_dotenv, find_dotenv

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__)
        )
    )
)

# Environment variables
# Check for and load environment variables from a .env file.

load_dotenv(find_dotenv())

# Required settings

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')
APP_HOST = os.environ.get('APP_HOST')
SECRET_KEY = os.environ.get('SECRET_KEY', None)
DEBUG = os.environ.get('DEBUG', False)


# Applications
# https://docs.djangoproject.com/en/1.11/ref/applications/

INSTALLED_APPS = [
    'api',
    'babybuddy',
    'core',
    'dashboard',
    'reports',

    'django_filters',
    'rest_framework',
    'rest_framework.authtoken',
    'widget_tweaks',
    'easy_thumbnails',
    'storages',

    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

# Middleware
# https://docs.djangoproject.com/en/1.11/ref/middleware/

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# URL dispatcher
# https://docs.djangoproject.com/en/1.11/topics/http/urls/

ROOT_URLCONF = 'babybuddy.urls'


# Templates
# https://docs.djangoproject.com/en/1.11/ref/templates/upgrading/#the-templates-settings

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# WGSI
# https://docs.djangoproject.com/en/1.11/howto/deployment/wsgi/

WSGI_APPLICATION = 'babybuddy.wsgi.application'


# Authentication
# https://docs.djangoproject.com/en/1.11/topics/auth/default/

LOGIN_REDIRECT_URL = '/'

LOGIN_URL = '/login/'

LOGOUT_REDIRECT_URL = '/login/'


# Internationalization
# https://docs.djangoproject.com/en/1.11/topics/i18n/

LANGUAGE_CODE = 'en'

# to get list of available timezones
# import pytz
# for tz in pytz.all_timezones:
#     print(tz) 
TIME_ZONE = os.environ.get('TIME_ZONE', 'US/Central')

# Stripe Settings
STRIPE_API_KEY = os.environ.get('STRIPE_API_KEY')
STRIPE_CLIENT_KEY = os.environ.get('STRIPE_CLIENT_KEY')
STRIPE_PREMIUM_PLAN = os.environ.get('STRIPE_PREMIUM_PLAN')
STRIPE_ADDITIONAL_MEMBER_PLAN = os.environ.get('STRIPE_ADDITIONAL_MEMBER_PLAN')
STRIPE_ADDITIONAL_CHILD_PLAN = os.environ.get('STRIPE_ADDITIONAL_CHILD_PLAN')

PREMIUM_MEMBER_COUNT = 3
PREMIUM_CHILD_COUNT = 1
FREE_TIMER_COUNT = 10
FREE_NOTIFICATION_COUNT = 10

# Email Settings
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_PORT = 587
PASSWORD_RESET_TIMEOUT_DAYS = 2

# Internationalization
USE_I18N = True
USE_L10N = True

USE_TZ = True

LOCALE_PATHS = [
    os.path.join(BASE_DIR, "locale"),
]

LANGUAGES = [
    ('en', _('English')),
    ('fr', _('French')),
    ('de', _('German')),
    ('sv', _('Swedish')),
]


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static')

WHITENOISE_ROOT = os.path.join(BASE_DIR, 'static', 'babybuddy', 'root')


# Media files (User uploaded content)
# https://docs.djangoproject.com/en/2.0/topics/files/

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

MEDIA_URL = '/media/'

AWS_STORAGE_BUCKET_NAME = os.environ.get('AWS_STORAGE_BUCKET_NAME', None)

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID', None)

AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY', None)

if AWS_STORAGE_BUCKET_NAME:
    DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
    THUMBNAIL_DEFAULT_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'


# Django Rest Framework
# http://www.django-rest-framework.org/#

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
    ],
    'DEFAULT_METADATA_CLASS': 'api.metadata.APIMetadata',
    'DEFAULT_PAGINATION_CLASS':
        'rest_framework.pagination.LimitOffsetPagination',
    'DEFAULT_PERMISSION_CLASSES': [
        'api.permissions.BabyBuddyDjangoModelPermissions'
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'PAGE_SIZE': 100
}

# Baby Buddy configuration
# See README.md#configuration for details about these settings.

BABY_BUDDY = {
    'NAP_START_MIN': os.environ.get('NAP_START_MIN', '06:00'),
    'NAP_START_MAX': os.environ.get('NAP_START_MAX', '18:00'),
    'ALLOW_UPLOADS': os.environ.get('ALLOW_UPLOADS', True)
}


# Celery / Redis Settings

CELERY_BROKER_URL = 'redis://localhost:6379'
CELERY_RESULT_BACKEND = 'redis://localhost:6379'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TASK_SERIALIZER = 'json'

CELERY_BEAT_SCHEDULE = {
  'notifications-task': {
    'task': 'babybuddy.tasks.notifications_task',
    'schedule': crontab(minute='*/2') # do every five minutes
  }
}


#TWILIO Settings

TWILIO_PHONE = os.environ.get('TWILIO_PHONE')
TWILIO_SID = os.environ.get('TWILIO_SID')
TWILIO_AUTH_TOKEN = os.environ.get('TWILIO_AUTH_TOKEN')
