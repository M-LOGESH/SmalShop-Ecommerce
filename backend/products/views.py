from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from .models import Category, SubCategory, Product
from .serializers import (
    CategorySerializer,
    SubCategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    # Optimized Query
    queryset = Product.objects.select_related(
        "category"
    ).prefetch_related(
        "subcategories"
    ).order_by("-created_at")

    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    # Use lightweight serializer for list
    def get_serializer_class(self):
        if self.action == "list":
            return ProductListSerializer
        return ProductDetailSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        if "file" in request.FILES:
            file = request.FILES["file"]
            try:
                url = product.upload_image_to_supabase(file)
                data = serializer.data
                data["image_url"] = url
                return Response(data, status=status.HTTP_201_CREATED)
            except Exception as e:
                print(f"Image upload failed: {e}")

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def upload_image(self, request, pk=None):
        product = self.get_object()
        file = request.FILES.get("file")

        if not file:
            return Response(
                {"error": "No file provided"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            url = product.upload_image_to_supabase(file)
            return Response({"image_url": url})
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )