from rest_framework import viewsets, permissions
from .models import Order, OrderItem
from .serializers import OrderSerializer
from cart.models import Cart

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Order.objects.all().order_by("-created_at")
        return Order.objects.filter(user=user).order_by("-created_at")

    def perform_create(self, serializer):
        # Create order from user's cart
        user = self.request.user
        cart_items = user.cart.all()

        order = serializer.save(user=user, status="pending")
        total = 0

        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.selling_price
            )
            total += cart_item.quantity * cart_item.product.selling_price

        order.total_price = total
        order.save()

        # Clear cart after placing order
        cart_items.delete()
