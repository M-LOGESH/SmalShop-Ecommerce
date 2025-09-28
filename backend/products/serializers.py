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

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    subcategories = SubCategorySerializer(many=True, read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source="category", write_only=True
    )
    subcategories_ids = serializers.PrimaryKeyRelatedField(
        queryset=SubCategory.objects.all(), many=True, source="subcategories", write_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id", "name", "image", "quantity",
            "cost_price", "retail_price", "selling_price", 
            "stock_status", "category", "subcategories",
            "description", "brand", "manufacturer",
            "created_at", "updated_at",
            "category_id", "subcategories_ids"
        ]
