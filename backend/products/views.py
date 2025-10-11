from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Category, SubCategory, Product
from .serializers import CategorySerializer, SubCategorySerializer, ProductSerializer

# -------------------------
# Category ViewSet
# -------------------------
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

# -------------------------
# SubCategory ViewSet
# -------------------------
class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [permissions.AllowAny]

# -------------------------
# Product ViewSet
# -------------------------
class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)  # Required for file uploads

    def create(self, request, *args, **kwargs):
        """
        Handles product creation and image upload to Supabase.
        Frontend should send image file as 'image_file'.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # Handle image upload to Supabase
        file = request.FILES.get("image_file")
        if file:
            product.upload_image_to_supabase(file)

        return Response(self.get_serializer(product).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        """
        Handles product update and image upload to Supabase.
        """
        product = self.get_object()
        serializer = self.get_serializer(product, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # Update image if a new file is provided
        file = request.FILES.get("image_file")
        if file:
            product.upload_image_to_supabase(file)

        return Response(self.get_serializer(product).data, status=status.HTTP_200_OK)
