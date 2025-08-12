from rest_framework import serializers
from .models import Collection, Link

class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ['id', 'url', 'title', 'description']
        read_only_fields = ['id']

class CollectionSerializer(serializers.ModelSerializer):
    links = LinkSerializer(many=True)

    class Meta:
        model = Collection
        fields = ['id','name','description', 'links']
        # read_only_fields = ['created_at', 'updated_at']

