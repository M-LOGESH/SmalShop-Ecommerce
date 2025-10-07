from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Q
from rest_framework import serializers

from .serializers import UserSerializer

# JWT imports
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from myaccount.serializers import UserProfileSerializer


#Custom JWT serializer: allow username OR email login
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        identifier = attrs.get("username")  # frontend sends "username" field
        password = attrs.get("password")

        # Try finding user by username OR email (case-insensitive)
        try:
            user_obj = User.objects.get(Q(username__iexact=identifier) | Q(email__iexact=identifier))
        except User.DoesNotExist:
            raise serializers.ValidationError({
                "username": ["Invalid username or email"],  # field-specific
                "password": []
            })

        # Authenticate using the real username
        user = authenticate(username=user_obj.username, password=password)
        if not user:
            raise serializers.ValidationError({
                "username": [],
                "password": ["Incorrect password"]  # field-specific
            })

        # Generate tokens
        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser,
            "profile": {
                "full_name": user.profile.full_name,
                "dob": user.profile.dob,
                "gender": user.profile.gender,
                "mobile": user.profile.mobile,
                "address": user.profile.address,
            }
        }


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


#Register new user (enforces unique email)
@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Issue tokens right after registration
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "User registered successfully",
            "username": user.username,
            "email": user.email,
            "is_staff": user.is_staff,
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        })
    return Response(serializer.errors, status=400)


#Get user profile (requires login)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_users(request):
    """
    Get all users with their profile data (admin only)
    """
    users = User.objects.all().select_related('profile').order_by('-date_joined')
    serializer = UserProfileSerializer(users, many=True)
    return Response(serializer.data)