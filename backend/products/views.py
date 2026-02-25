from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Category, SubCategory, Product
from .serializers import CategorySerializer, SubCategorySerializer, ProductSerializer

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
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def create(self, request, *args, **kwargs):
        # Handle product creation
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
        # Handle image upload if file is provided
        if 'file' in request.FILES:
            try:
                file = request.FILES['file']
                url = product.upload_image_to_supabase(file)
                # Update the response with image URL
                response_data = serializer.data
                response_data['image_url'] = url
                headers = self.get_success_headers(serializer.data)
                return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)
            except Exception as e:
                # If image upload fails, still return the product but log the error
                print(f"Image upload failed but product created: {e}")
        
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        product = self.get_object()
        
        # Handle image upload if file is provided
        if 'file' in request.FILES:
            try:
                file = request.FILES['file']
                url = product.upload_image_to_supabase(file)
                # Update request data with the new image URL
                request.data._mutable = True
                request.data['image_url'] = url
                request.data._mutable = False
            except Exception as e:
                print(f"Error uploading image during update: {e}")
        
        return super().update(request, *args, **kwargs)

    @action(detail=True, methods=['post'], url_path='upload-image')
    def upload_image(self, request, pk=None):
        product = self.get_object()
        file = request.FILES.get('file')
        
        if not file:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            url = product.upload_image_to_supabase(file)
            return Response({"image_url": url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)