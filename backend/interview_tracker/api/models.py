from django.db import models
from django.contrib.sessions.models import Session
import uuid

class UserResponse(models.Model):
    class ResponseType(models.TextChoices):
        PERSONAL = "PERSONAL", "Personal Answer"
        AI_PARAPHRASE = "AI_PARAPHRASE", "AI Paraphrased"
        FULLY_AI = "FULLY_AI", "Fully AI"

    class DeviceType(models.TextChoices):
        DESKTOP = "DESKTOP", "Desktop"
        MOBILE = "MOBILE", "Mobile"
        TABLET = "TABLET", "Tablet"

    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    question_text = models.TextField()
    answer_text = models.TextField(null=True, blank=True)

    # Typing analysis
    backspace_count = models.IntegerField(default=0)
    letter_click_counts = models.JSONField(default=dict)

    # Duration analysis
    typing_duration = models.IntegerField(default=0)
    question_presented_at = models.DateTimeField(null=True, blank=True)
    answer_submitted_at = models.DateTimeField(null=True, blank=True)
    total_interaction_time = models.IntegerField(null=True, blank=True)

    # Response and device types
    response_type = models.CharField(max_length=15, choices=ResponseType.choices, null=True, blank=True)
    device_type = models.CharField(max_length=10, choices=DeviceType.choices, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
