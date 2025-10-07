from django.urls import path
from .views import register_user, user_profile, MyTokenObtainPairView, get_all_users  
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', register_user, name="register"),
    path('login/', MyTokenObtainPairView.as_view(), name="login"),
    path('token/refresh/', TokenRefreshView.as_view(), name="token_refresh"),
    path('all/', get_all_users, name="get-all-users"), 
]