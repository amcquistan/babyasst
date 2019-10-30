# Generated by Django 2.2.4 on 2019-10-24 14:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_auto_20191023_2216'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='child',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to='core.Child', verbose_name='Child'),
        ),
    ]
