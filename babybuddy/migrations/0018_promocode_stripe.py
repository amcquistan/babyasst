# Generated by Django 2.2.6 on 2019-11-27 20:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('babybuddy', '0017_promocode_max_usage_per_account'),
    ]

    operations = [
        migrations.AddField(
            model_name='promocode',
            name='stripe',
            field=models.BooleanField(default=False),
        ),
    ]
