# Generated by Django 2.2.4 on 2019-10-28 17:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0019_child_is_active'),
    ]

    operations = [
        migrations.AlterField(
            model_name='timer',
            name='active',
            field=models.BooleanField(default=False, verbose_name='Active'),
        ),
    ]
