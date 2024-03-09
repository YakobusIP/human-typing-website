from django.urls import path
from .views import SessionAPIView, SessionSamsungInternetAPIView, SessionCheckAPIView, ChatGetAPIView, ChatPostAPIView, ChatSamsungInternetGetAPIView, ChatSamsungInternetPostAPIView

urlpatterns = [
    path("session", SessionAPIView.as_view(), name="session_view"),
    path("session/samsung/<str:session_key>", SessionSamsungInternetAPIView.as_view(), name="session_view_samsung"),
    path("session-check", SessionCheckAPIView.as_view(), name="session_check_view"),
    path("chat/<str:question_topic>", ChatGetAPIView.as_view(), name="chat_view_get"),
    path("chat", ChatPostAPIView.as_view(), name="chat_view_post"),
    path("chat/samsung/<str:session_key>/<str:question_topic>", ChatSamsungInternetGetAPIView.as_view(), name="chat_view_samsung_get"),
    path("chat/samsung", ChatSamsungInternetPostAPIView.as_view(), name="chat_view_samsung")
]
