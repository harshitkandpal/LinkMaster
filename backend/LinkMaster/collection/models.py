from django.db import models


class Link(models.Model):
    url = models.URLField(max_length=256, unique=True)
    title = models.CharField(max_length=256, blank=True)
    description = models.TextField(blank=True)
    
    def __str__(self):
        return self.title

class Collection(models.Model):
    name = models.CharField(max_length=256, unique=True)
    description = models.TextField(blank=True)
    links = models.ManyToManyField(Link, related_name='collections')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name