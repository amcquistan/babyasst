# Generated by Django 2.2.4 on 2019-10-23 22:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('babybuddy', '0014_auto_20191022_0409'),
        ('core', '0015_auto_20191023_1229'),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255, verbose_name='Title')),
                ('body', models.TextField()),
                ('url', models.CharField(blank=True, max_length=255, null=True)),
                ('frequency_hours', models.IntegerField(default=0, verbose_name='Frequency')),
                ('intervals', models.IntegerField(default=1, verbose_name='Interval')),
                ('active', models.BooleanField(default=False)),
                ('start', models.DateTimeField(verbose_name='Start time')),
                ('end', models.DateTimeField(blank=True, null=True, verbose_name='End time')),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='babybuddy.Account', verbose_name='Notification')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications_created', to=settings.AUTH_USER_MODEL, verbose_name='Created By')),
            ],
        ),
        migrations.AlterField(
            model_name='timer',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='timers', to=settings.AUTH_USER_MODEL, verbose_name='Created By'),
        ),
        migrations.CreateModel(
            name='NotificationEvent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('text message', 'Text Message'), ('email', 'Email'), ('web', 'Web')], max_length=255, verbose_name='Type')),
                ('acknowledged', models.BooleanField(default=False, verbose_name='Acknowledged')),
                ('acknowledged_type', models.CharField(choices=[('text message', 'Text Message'), ('email', 'Email'), ('web', 'Web')], max_length=255, verbose_name='Acknowledged Type')),
                ('url', models.CharField(blank=True, max_length=255, null=True)),
                ('notification', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notification_events', to='core.Notification', verbose_name='Notification')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notification_events', to=settings.AUTH_USER_MODEL, verbose_name='Notification Event')),
            ],
        ),
    ]
