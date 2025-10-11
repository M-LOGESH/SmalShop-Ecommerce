from django.db import models
from supabase import create_client
import os

# Initialize Supabase client
supabase = create_client(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_KEY"))

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

class SubCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=200)
    image_url = models.URLField(blank=True, null=True)  # store Supabase URL
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

    def upload_image_to_supabase(self, file):
        """
        Uploads file to Supabase Storage and updates image_url.
        """
        path = f"products/{self.id}/{file.name}"  # you can customize path
        supabase.storage.from_("products").upload(path, file)
        url = supabase.storage.from_("products").get_public_url(path).url
        self.image_url = url
        self.save()
        return url
