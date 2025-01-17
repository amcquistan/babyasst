# Generated by Django 2.2.4 on 2019-10-22 12:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0012_auto_20191022_0409'),
    ]

    operations = [
        migrations.AddField(
            model_name='timer',
            name='child',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='timers', to='core.Child', verbose_name='Child'),
        ),
        migrations.AddField(
            model_name='timer',
            name='is_feeding',
            field=models.BooleanField(default=False, verbose_name='Feeding'),
        ),
        migrations.AddField(
            model_name='timer',
            name='is_sleeping',
            field=models.BooleanField(default=False, verbose_name='Sleeping'),
        ),
        migrations.AddField(
            model_name='timer',
            name='is_tummytime',
            field=models.BooleanField(default=False, verbose_name='Tummy Time'),
        ),
    ]
