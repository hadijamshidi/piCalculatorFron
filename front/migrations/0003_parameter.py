# Generated by Django 3.0.4 on 2020-03-23 17:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('front', '0002_auto_20200323_1837'),
    ]

    operations = [
        migrations.CreateModel(
            name='Parameter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, default='', max_length=20, null=True)),
                ('key', models.IntegerField(blank=True, default=0, null=True)),
                ('value', models.IntegerField(blank=True, default=0, null=True)),
            ],
        ),
    ]
