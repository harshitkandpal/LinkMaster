from rest_framework import serializers
from .models import Collection, Link

class LinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ['id', 'url', 'title', 'description']
        read_only_fields = ['id']

class CollectionSerializer(serializers.ModelSerializer):
    # Show nested link objects when reading
    links = LinkSerializer(many=True, read_only=True)
    # Accept link IDs when writing
    link_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Link.objects.all(), write_only=True
    )

    class Meta:
        model = Collection
        fields = ['id', 'name', 'description', 'links', 'link_ids']

    def create(self, validated_data):
        link_ids = validated_data.pop('link_ids', [])
        collection = Collection.objects.create(**validated_data)
        collection.links.set(link_ids)
        return collection

    def update(self, instance, validated_data):
    a
