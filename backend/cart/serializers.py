from rest_framework import serializers
from .models import Wishlist, Cart
from products.serializers import ProductSerializer
from products.models import Product

class WishlistSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    # writable ID for POST/PUT
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    # read-only nested data for GET
    product_detail = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "product", "product_detail", "user"]


class CartSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    product_detail = ProductSerializer(source='product', read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "product", "product_detail", "user", "quantity"]
