# Generated by Django 2.2.4 on 2019-10-20 23:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('babybuddy', '0012_auto_20191020_1857'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='account',
            options={'default_permissions': ('view', 'add', 'change', 'delete'), 'ordering': ['owner__last_name', 'name'], 'verbose_name': 'Account', 'verbose_name_plural': 'Accounts'},
        ),
        migrations.RemoveField(
            model_name='account',
            name='phone_number',
        ),
        migrations.AddField(
            model_name='settings',
            name='phone_number',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
