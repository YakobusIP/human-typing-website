from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import UserResponse
from django.contrib.sessions.models import Session
from .serializers import UserResponseSerializer
from langchain_core.prompts import SystemMessagePromptTemplate, ChatPromptTemplate
from langchain_openai import ChatOpenAI
from datetime import datetime

# Create your views here.

class SessionAPIView(APIView):
    def get(self, request):
        if not request.session.exists(request.session.session_key):
            request.session.create()

        return Response(status=status.HTTP_200_OK)
    
class SessionSamsungInternetAPIView(APIView):
    def get(self, request, session_key):
        try:
            # Attempt to retrieve the existing session
            Session.objects.get(session_key=session_key)
        except Session.DoesNotExist:
            # If the session does not exist or is expired, create a new one
            if not request.session.exists(request.session.session_key):
                request.session.create()

        return Response({ "session_key": request.session.session_key },status=status.HTTP_200_OK)
    
class SessionCheckAPIView(APIView):
    def get(self, request):
        if not request.session.exists(request.session.session_key):
            # No active session
            return Response({ "session_active": False }, status=status.HTTP_200_OK)
        # Active session
        return Response({ "session_active": True }, status=status.HTTP_200_OK)
    
class ChatGetAPIView(APIView):
    def get(self, request, question_topic):
        session_key = request.session.session_key
        session = Session.objects.get(session_key=session_key)
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

        chat = ChatOpenAI(temperature=0.8, model="gpt-3.5-turbo")

        template = (
            """
            You are an interviewer who is interested in the candidate.
            The candidate is majoring in {major}.
            You will generate an interview question without access to the candidate's resume and their previous answer.
            Use simple English accustomed to a foreigner.
            These are the previous questions that has been asked: {previous_questions}. 
            Generate a new question without numberings.
            """
        )

        system_message_prompt = SystemMessagePromptTemplate.from_template(template)

        chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt])

        question = chat.invoke(chat_prompt.format_prompt(major=question_topic, previous_questions=previous_questions).to_messages()).to_json()["kwargs"]["content"]

        new_question = UserResponse.objects.create(session=session, question_text=question)
        new_question.save()

        return Response({ "id": new_question.id , "question": question }, status=status.HTTP_200_OK)
    
class ChatPostAPIView(APIView):
    def post(self, request):
        question_id = request.data.pop("question_id")

        session_key = request.session.session_key
        session = Session.objects.get(session_key=session_key)
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
    
class ChatSamsungInternetGetAPIView(APIView):
    def get(self, request, session_key, question_topic):
        session = Session.objects.get(session_key=session_key)
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

        chat = ChatOpenAI(temperature=0.8, model="gpt-3.5-turbo")

        template = (
            """
            You are an interviewer who is interested in the candidate. 
            The candidate is majoring in {major}.
            You will generate an interview question without access to the candidate's resume and their previous answer. 
            Use simple English accustomed to a foreigner.
            These are the previous questions that has been asked: {previous_questions}. 
            Generate a new question without numberings.
            """
        )

        system_message_prompt = SystemMessagePromptTemplate.from_template(template)

        chat_prompt = ChatPromptTemplate.from_messages([system_message_prompt])

        question = chat.invoke(chat_prompt.format_prompt(major=question_topic, previous_questions=previous_questions).to_messages()).to_json()["kwargs"]["content"]

        new_question = UserResponse.objects.create(session=session, question_text=question)
        new_question.save()

        return Response({ "id": new_question.id , "question": question }, status=status.HTTP_200_OK)

class ChatSamsungInternetPostAPIView(APIView): 
    def post(self, request):
        question_id = request.data.pop("question_id")
        session_key = request.data.pop("session_key")

        session = Session.objects.get(session_key=session_key)
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
