from rest_framework import serializers
from .models import Wishlist, Cart

class WishlistSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  # optional
    class Meta:
        model = Wishlist
        fields = ["id", "product", "user"]


class CartSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')  # optional
    class Meta:
        model = Cart
        fields = ["id", "product", "user", "quantity"]

