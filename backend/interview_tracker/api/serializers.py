from rest_framework import serializers
from .models import UserResponse

class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResponse
        fields = ["answer_text", "backspace_count", "letter_click_counts", "typing_duration", "response_type"]
