# Generated by Django 2.2.4 on 2019-10-17 22:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('babybuddy', '0009_auto_20191017_0416'),
    ]

    operations = [
        migrations.AddField(
            model_name='account',
            name='email_notifications_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='account',
            name='phone_notifications_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='account',
            name='phone_number',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
