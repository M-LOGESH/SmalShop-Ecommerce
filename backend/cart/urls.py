from rest_framework.routers import DefaultRouter
from .views import WishlistViewSet, CartViewSet

router = DefaultRouter()
router.register(r'wishlist', WishlistViewSet, basename='wishlist')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = router.urls
