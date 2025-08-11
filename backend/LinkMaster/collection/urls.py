from django.urls import path
from .views import CollectionView, CollectionDetailView

urlpatterns = [
    path('collections/', CollectionView.as_view(), name='collection-list'),
    path('collections/<int:id>/', CollectionDetailView.as_view(), name='collection-detail')
]