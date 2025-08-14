from django.urls import path
from .views import SiteScraperView

urlpatterns = [
    path('scrape/', SiteScraperView.as_view(), name='site-scraper'),
]