from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from bs4 import BeautifulSoup
from requests import get as requests_get
from collection.models import Link

# Create your views here.
class SiteScraperView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        url  =  request.data.get("url")
        if not url:
            return Response({"error": "URL is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            response = requests_get(url)
            soup = BeautifulSoup(response.content, 'html.parser')
            links = []
            for link in  soup.find_all('a'):
                href = link.get('href')
                text = link.text.strip()
                description = link.find('p').text.strip() if link.find('p') else ''
                if href and text:
                    link_instance, _ = Link.objects.update_or_create(
                        url=href,
                        defaults={
                            'title': text,
                            'description': description
                        }
                    )
                    links.append({
                        "id": link_instance.id,
                        "url": link_instance.url,
                        "title": link_instance.title,
                        "description": link_instance.description
                    })
            return Response(links, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
