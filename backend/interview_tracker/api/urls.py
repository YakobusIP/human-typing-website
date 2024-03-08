from django.urls import path
from .views import SessionAPIView, SessionCheckAPIView, ChatAPIView

urlpatterns = [
    path("session", SessionAPIView.as_view(), name="session_view"),
    path("session-check", SessionCheckAPIView.as_view(), name="session_check_view"),
    path("chat", ChatAPIView.as_view(), name="chat_view")
]
