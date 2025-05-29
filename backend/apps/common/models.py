from django.db import models
from django.conf import settings
from django.utils.timezone import now

class AbstractBaseModel(models.Model):
    created_at = models.DateTimeField(default=now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='created_%(class)s_objects',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='updated_%(class)s_objects',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )

    class Meta:
        abstract = True
