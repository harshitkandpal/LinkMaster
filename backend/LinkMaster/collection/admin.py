from django.contrib import admin
from .models import Link, Collection

# Register your models here.
# lets modify the admin panel

class LinkAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'url', 'description']
    search_fields = ['title', 'url']

class CollectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description']
    search_fields = ['name']

admin.site.register(Link, LinkAdmin)
admin.site.register(Collection, CollectionAdmin)

