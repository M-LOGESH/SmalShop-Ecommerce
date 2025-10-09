import os
from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name



# Function to define dynamic image upload path
def product_image_path(instance, filename):
    category_name = instance.category.name if instance.category else "uncategorized"
    return os.path.join("Products", category_name, filename)



class Product(models.Model):
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to=product_image_path, blank=True, null=True)
    quantity = models.CharField(max_length=50) 

    
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True) 
    retail_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True) 
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)

    stock_status = models.CharField(
        max_length=20,
        choices=[("in_stock", "In Stock"), ("out_of_stock", "Out of Stock")],
        default="in_stock"
    )

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    subcategories = models.ManyToManyField(SubCategory, blank=True, related_name="products")

    description = models.TextField(blank=True)
    brand = models.CharField(max_length=100, blank=True)
    manufacturer = models.CharField(max_length=150, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
