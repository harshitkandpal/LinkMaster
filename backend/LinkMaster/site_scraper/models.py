from django.db import models
from collection.models import Link

class ScrapedData(models.Model):
    url = models.URLField(max_length=256)
    title = models.CharField(max_length=256, blank=True)
    description = models.TextField(blank=True)
    links = models.ManyToManyField(Link, related_name='scraped_data', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title if self.title else self.url