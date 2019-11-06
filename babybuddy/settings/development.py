from .base import *

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.11/howto/deployment/checklist/

SECRET_KEY = 'CHANGE ME'
DEBUG = True


# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'babyasst',
        'USER':  'postgres',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '5432'
    }
}


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.11/howto/static-files/
#
# Comment out STATICFILES_STORAGE and uncomment DEBUG = False to test with
# production static files.

# DEBUG = False
STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.StaticFilesStorage'

# Django Rest Framework
# http://www.django-rest-framework.org/#

REST_FRAMEWORK['DEFAULT_RENDERER_CLASSES'] = (
    'rest_framework.renderers.JSONRenderer',
    'rest_framework.renderers.BrowsableAPIRenderer',
)

MOCK_STRIPE = os.environ.get('MOCK_STRIPE', 'no') == 'yes'
