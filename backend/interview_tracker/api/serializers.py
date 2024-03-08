from rest_framework import serializers
from .models import Session, UserResponse

class UserResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserResponse
        fields = ["session", "question_text", "answer_text", "backspace_count", "letter_click_counts", "typing_duration",
                  "question_presented_at", "answer_submitted_at", "total_interaction_time", "response_type", "device_type"]
