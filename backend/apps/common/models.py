from django.db import models
from django.conf import settings
from django.utils.timezone import now
from apps.common.utils import generate_custom_id
class AbstractBaseModel(models.Model):
    custom_id = models.CharField(max_length=20, unique=True, editable=False)
    created_at = models.DateTimeField(default=now, editable=False)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='created_%(class)s_set',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='updated_%(class)s_set',
        on_delete=models.SET_NULL,
        null=True, blank=True
    )

    class Meta:
        abstract = True


    def save(self, *args, **kwargs):
        if not self.custom_id:
            prefix = getattr(self, 'CUSTOM_ID_PREFIX', 'GEN')
            self.custom_id = generate_custom_id(prefix, self.__class__)
        super().save(*args, **kwargs)