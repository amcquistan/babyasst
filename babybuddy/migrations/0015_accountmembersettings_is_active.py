# Generated by Django 2.2.4 on 2019-10-27 15:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('babybuddy', '0014_auto_20191022_0409'),
    ]

    operations = [
        migrations.AddField(
            model_name='accountmembersettings',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
    ]
