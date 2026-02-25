from rest_framework import serializers
from .models import Category, SubCategory, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = "__all__"


# Lightweight Serializer (for list view)
class ProductListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "image_url",
            "selling_price",
            "stock_status",
            "category_name",
        ]


# Full Serializer (for detail view)
class ProductDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    subcategories = SubCategorySerializer(many=True, read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source="category",
        write_only=True,
        required=False
    )

    subcategories_ids = serializers.PrimaryKeyRelatedField(
        queryset=SubCategory.objects.all(),
        many=True,
        source="subcategories",
        write_only=True,
        required=False
    )

    class Meta:
        model = Product
        fields = "__all__"
        read_only_fields = ["image_url"]