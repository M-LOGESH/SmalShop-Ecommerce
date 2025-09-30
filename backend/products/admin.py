from django.contrib import admin
from .models import Category, SubCategory, Product

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "slug")
    prepopulated_fields = {"slug": ("name",)}

@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_filter = ()

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id", "name", "category", "quantity",
        "cost_price", "retail_price", "selling_price",  # show in admin
        "stock_status", "created_at"
    )
    list_filter = ("category", "stock_status", "brand")
    search_fields = ("name", "brand", "manufacturer")
    filter_horizontal = ("subcategories",)
