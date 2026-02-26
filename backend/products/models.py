from django.db import models
from supabase import create_client
import os
from django.conf import settings

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
    image_url = models.URLField(blank=True, null=True)
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
        try:
            # Initialize Supabase client
            supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
            bucket = settings.SUPABASE_BUCKET
            
            # Create unique file path
            import uuid
            file_extension = os.path.splitext(file.name)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            path = f"products/{self.id}/{unique_filename}"
            
            # Upload file
            result = supabase.storage.from_(bucket).upload(path, file.read(), {
                "content-type": file.content_type
            })
            
            if hasattr(result, 'error') and result.error:
                raise Exception(f"Supabase upload error: {result.error}")
            
            # Get public URL
            url = supabase.storage.from_(bucket).get_public_url(path)
            self.image_url = url
            self.save()
            return url
            
        except Exception as e:
            print(f"Error uploading to Supabase: {e}")
            raise e