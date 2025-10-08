from django.contrib import admin
from .models import Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'quantity', 'price')
    can_delete = False

class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'status', 'total_price', 'created_at', 'updated_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('order_number', 'user__username', 'items__product__name')
    readonly_fields = ('order_number', 'created_at', 'updated_at')
    inlines = [OrderItemInline]

    def get_queryset(self, request):
        # Superusers see all orders, staff see all orders, normal users see their own
        qs = super().get_queryset(request)
        if request.user.is_superuser or request.user.is_staff:
            return qs
        return qs.filter(user=request.user)

admin.site.register(Order, OrderAdmin)
