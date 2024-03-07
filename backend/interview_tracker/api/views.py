from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Session, UserResponse
from .serializers import SessionSerializer, UserResponseSerializer
from langchain_core.prompts import SystemMessagePromptTemplate, ChatPromptTemplate
from langchain_openai import ChatOpenAI
from datetime import datetime

# Create your views here.

class SessionAPIView(APIView):
    def get(self, request):
        session = Session.objects.create()
        return Response({"session_id": session.session_id}, status=status.HTTP_201_CREATED)

class ChatQuestionAPIView(APIView):
    def get(self, request, session_id):
        session = Session.objects.get(session_id=session_id)
        previous_responses = UserResponse.objects.filter(session=session)
        serializer = UserResponseSerializer(previous_responses, many=True)

        for response in previous_responses:
            if response.answer_text in [None, ""]:
                return Response({ "id": response.id , "question": response.question_text }, status=status.HTTP_200_OK)

        previous_questions = ""

        for index, response in enumerate(serializer.data):
            for key, value in response.items():
                if (key == "question_text"):
                    previous_questions += f"{index + 1}. {value}\n"

        chat = ChatOpenAI(temperature=0.5, model="gpt-3.5-turbo")

        template = (
            """
            You are an interviewer who is interested in the candidate. 
            You will generate an interview question without access to the candidate's resume and their previous answer. 
            Start shallow before going deeper.
            These are the previous questions that has been asked: {previous_questions}. 
            Generate a new question without numberings.
            """
        )

        system_message_prompt = SystemMessagePromptTemplate.from_template(template)

        chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt])

        question = chat.invoke(chat_prompt.format_prompt(previous_questions=previous_questions).to_messages()).to_json()["kwargs"]["content"]

        new_question = UserResponse.objects.create(session=session, question_text=question)
        new_question.save()

        return Response({ "id": new_question.id , "question": question }, status=status.HTTP_200_OK)
    
class ChatAnswerAPIView(APIView):
    def post(self, request):
        session_id = request.data.pop("session_id")
        question_id = request.data.pop("question_id")

        session = Session.objects.get(session_id=session_id)
        response = UserResponse.objects.get(id=question_id, session=session)

        response.answer_text = request.data.get("answer_text")
        response.backspace_count = request.data.get("backspace_count")
        response.letter_click_counts = request.data.get("letter_click_counts")
        response.typing_duration = request.data.get("typing_duration")
        response.question_presented_at = request.data.get("question_presented_at")
        response.answer_submitted_at = request.data.get("answer_submitted_at")
        response.total_interaction_time = request.data.get("total_interaction_time")
        response.response_type = request.data.get("response_type")
        response.device_type = request.data.get("device_type")


        response.save()
        
        return Response(status=status.HTTP_200_OK)
