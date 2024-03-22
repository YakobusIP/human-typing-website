from django.urls import path
from .views import ChatPostAPIView

urlpatterns = [
    path("chat", ChatPostAPIView.as_view(), name="chat_view_post"),
]
