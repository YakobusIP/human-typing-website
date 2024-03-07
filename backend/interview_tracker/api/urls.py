from django.urls import path
from .views import SessionAPIView, ChatQuestionAPIView, ChatAnswerAPIView

urlpatterns = [
    path("session", SessionAPIView.as_view(), name="session_view"),
    path("chat/<str:session_id>", ChatQuestionAPIView.as_view(), name="chat_question_view"),
    path("chat", ChatAnswerAPIView.as_view(), name="chat_answer_view")
]
