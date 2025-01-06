# Generated by Django 5.1.3 on 2025-01-04 10:44

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('transaction_id', models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ('student_id', models.CharField(max_length=50)),
                ('course', models.CharField(max_length=100)),
                ('score', models.FloatField()),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Block',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('index', models.IntegerField()),
                ('previous_hash', models.CharField(max_length=64)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('nonce', models.IntegerField(default=0)),
                ('hash', models.CharField(max_length=64)),
                ('transactions', models.ManyToManyField(to='home.transaction')),
            ],
        ),
    ]
