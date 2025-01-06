# Generated by Django 5.1.3 on 2025-01-06 16:41

import time
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0002_block_merkle_root'),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('mined', 'Mined')], default='pending', max_length=10),
        ),
        migrations.AlterField(
            model_name='block',
            name='timestamp',
            field=models.FloatField(default=time.time),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='timestamp',
            field=models.FloatField(default=time.time),
        ),
    ]
