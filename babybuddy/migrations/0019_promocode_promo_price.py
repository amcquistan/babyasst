# Generated by Django 2.2.6 on 2019-11-27 21:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('babybuddy', '0018_promocode_stripe'),
    ]

    operations = [
        migrations.AddField(
            model_name='promocode',
            name='promo_price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=7),
        ),
    ]
