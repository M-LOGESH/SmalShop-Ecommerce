from django.db import models
from django.contrib.auth.models import User
from products.models import Product
from django.utils import timezone
from django.utils.crypto import get_random_string
import re

class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("preparing", "Preparing"),
        ("ready", "Ready for Pickup"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    order_number = models.CharField(max_length=30, unique=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.order_number:
            today_str = timezone.now().strftime("%Y%m%d")

            # Get all today's orders
            orders_today = Order.objects.filter(order_number__startswith=f"ORD-{today_str}")

            # Extract last sequence numbers (#### at end)
            seq_numbers = []
            for o in orders_today:
                match = re.search(r"-(\d{4})$", o.order_number)
                if match:
                    seq_numbers.append(int(match.group(1)))

            # Next sequence number
            next_seq = (max(seq_numbers) + 1) if seq_numbers else 1
            seq = f"{next_seq:04d}"

            # User initials
            initials = "".join([c.upper() for c in self.user.username[:2]])

            # Random string (2 chars)
            rand_str = get_random_string(2).upper()

            # Final order number
            self.order_number = f"ORD-{today_str}-{initials}{rand_str}-{seq}"

        super().save(*args, **kwargs)

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product.name} (x{self.quantity})"
