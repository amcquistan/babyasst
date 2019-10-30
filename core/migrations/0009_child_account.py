# Generated by Django 2.2.4 on 2019-10-17 02:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('core', '0008_auto_20190607_1422'),
    ]

    operations = [
        migrations.AddField(
            model_name='child',
            name='account',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='child', to=settings.AUTH_USER_MODEL, verbose_name='Account'),
        ),
    ]
