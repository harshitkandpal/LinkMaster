from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Collection
from .serializers import CollectionSerializer
from rest_framework.views import APIView

# Create your views here.

class CollectionView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = CollectionSerializer
    # queryset = Collection.objects.all()
    queryset = Collection.objects.prefetch_related('links').all()

    def get(self, request):
        collections = self.get_queryset()
        serializer = self.serializer_class(collections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class CollectionDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, id):
        try:
            collection = Collection.objects.prefetch_related('links').get(id=id)
            serializer = CollectionSerializer(collection)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Collection.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
