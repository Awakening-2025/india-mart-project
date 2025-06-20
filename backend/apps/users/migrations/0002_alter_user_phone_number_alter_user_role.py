# Generated by Django 5.2.1 on 2025-06-18 07:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="phone_number",
            field=models.CharField(blank=True, max_length=15, null=True, unique=True),
        ),
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[("buyer", "Buyer"), ("seller", "Seller")],
                default="buyer",
                max_length=10,
            ),
        ),
    ]
