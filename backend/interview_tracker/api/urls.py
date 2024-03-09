from django.urls import path
from .views import SessionAPIView, SessionSamsungInternetAPIView, SessionCheckAPIView, ChatAPIView, ChatSamsungInternetGetAPIView, ChatSamsungInternetPostAPIView

urlpatterns = [
    path("session", SessionAPIView.as_view(), name="session_view"),
    path("session/samsung/<str:session_key>", SessionSamsungInternetAPIView.as_view(), name="session_view_samsung"),
    path("session-check", SessionCheckAPIView.as_view(), name="session_check_view"),
    path("chat", ChatAPIView.as_view(), name="chat_view"),
    path("chat/samsung/<str:session_key>", ChatSamsungInternetGetAPIView.as_view(), name="chat_view_samsung_get"),
    path("chat/samsung", ChatSamsungInternetPostAPIView.as_view(), name="chat_view_samsung")
]
