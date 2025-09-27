from django.contrib import admin
from .models import Profile


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "full_name","user__email", "dob", "gender", "mobile","address")
    search_fields = ("user__username", "full_name", "mobile")
