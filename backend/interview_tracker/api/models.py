from django.db import models

class UserResponse(models.Model):
    class ResponseType(models.TextChoices):
        PERSONAL = "PERSONAL", "Personal Answer"
        AI_PARAPHRASE = "AI_PARAPHRASE", "AI Paraphrased"
        FULLY_AI = "FULLY_AI", "Fully AI"

    question_text = models.TextField(null=True, blank=True)
    answer_text = models.TextField(null=True, blank=True)

    # Typing analysis
    backspace_count = models.IntegerField(default=0)
    letter_click_counts = models.JSONField(default=dict)

    # Duration analysis
    typing_duration = models.IntegerField(default=0)

    # Response and device types
    response_type = models.CharField(max_length=15, choices=ResponseType.choices, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
