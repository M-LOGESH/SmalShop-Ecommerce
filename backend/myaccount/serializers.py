from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["full_name", "dob", "gender", "mobile", "address"]

class UserProfileSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    is_staff = serializers.BooleanField(read_only=True)
    is_superuser = serializers.BooleanField(read_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "profile", "is_staff", "is_superuser", "date_joined"]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", {})

        # Update User fields
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.save()

        # Update Profile fields
        profile = instance.profile
        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance