from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Category, SubCategory, Product
from .serializers import CategorySerializer, SubCategorySerializer, ProductSerializer
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [permissions.AllowAny]

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all().order_by("-created_at")
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]  # allow file uploads

    @action(detail=True, methods=['post'], url_path='upload-image')
    def upload_image(self, request, pk=None):
        product = self.get_object()
        file = request.FILES.get('file')
        if not file:
            return Response({"error": "No file provided"}, status=400)

        url = product.upload_image_to_supabase(file)
        return Response({"image_url": url}, status=200)
