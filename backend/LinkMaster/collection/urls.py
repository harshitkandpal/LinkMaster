from django.urls import path
from .views import CollectionView

urlpatterns = [
    path('collections/', CollectionView.as_view(), name='collection-list'),
]