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

    def post(self, request):
        serializer = CollectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)