from django.shortcuts import render
from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Collection, Link
from .serializers import CollectionSerializer, LinkSerializer
from rest_framework.views import APIView

# Create your views here.

class CollectionView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        collections = Collection.objects.prefetch_related('links').all()
        serializer = CollectionSerializer(collections, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
     
    def post(self, request):
        serializer = CollectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class CollectionDetailView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, id):
        try:
            collection = Collection.objects.prefetch_related('links').get(id=id)
            serializer = CollectionSerializer(collection)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Collection.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, id):
        try:
            collection = Collection.objects.get(id=id)
            serializer = CollectionSerializer(collection, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Collection.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, id):
        try:
            collection = Collection.objects.get(id=id)
            collection.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Collection.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
class LinkView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            links = Link.objects.all()
            serializer = LinkSerializer(links, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Link.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
    def post(self, request):
        try:
            serializer = LinkSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LinkDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        try:
            link = Link.objects.get(id=id)
            serializer = LinkSerializer(link)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Link.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, id):
        try:
            link = Link.objects.get(id=id)
            serializer = LinkSerializer(link, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Link.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, id):
        try:
            link = Link.objects.get(id=id)
            link.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Link.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
