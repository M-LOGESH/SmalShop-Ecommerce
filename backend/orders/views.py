from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
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
        # Create order from user's cart - only in-stock products
        user = self.request.user
        cart_items = user.cart.all().select_related('product')
        
        # Separate in-stock and out-of-stock items
        in_stock_items = [item for item in cart_items if item.product.stock_status == 'in_stock']
        out_of_stock_items = [item for item in cart_items if item.product.stock_status == 'out_of_stock']
        
        # Check if there are any in-stock items to order
        if not in_stock_items:
            # You might want to raise an exception or return an error response
            raise serializers.ValidationError("No in-stock items in cart to place order.")
        
        # Create order with only in-stock items
        order = serializer.save(user=user, status="pending")
        total = 0

        for cart_item in in_stock_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.selling_price
            )
            total += cart_item.quantity * cart_item.product.selling_price

        order.total_price = total
        order.save()

        # Clear only the in-stock items from cart after placing order
        # Keep out-of-stock items in the cart
        Cart.objects.filter(id__in=[item.id for item in in_stock_items]).delete()
        
        # Return the out_of_stock_items info if needed
        self.out_of_stock_items = out_of_stock_items