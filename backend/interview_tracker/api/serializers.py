from rest_framework import serializers
from .models import Session, UserResponse


class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ["id", "session_id"]


class UserResponseSerializer(serializers.ModelSerializer):
    total_interaction_time = serializers.SerializerMethodField()

    class Meta:
        model = UserResponse
        fields = ["session", "question_text", "answer_text", "backspace_count", "letter_click_counts", "typing_duration",
                  "question_presented_at", "answer_submitted_at", "total_interaction_time", "response_type", "device_type"]

    def get_total_interaction_time(self, obj):
        if obj.question_presented_at and obj.answer_submitted_at:
            total_time = obj.answer_submitted_at - obj.question_presented_at
            return total_time.total_seconds()

        return None
