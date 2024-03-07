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

        UserResponse.objects.create(session=session, question_text=question)

        return Response({ "question": question }, status=status.HTTP_200_OK)
    
class ChatAnswerAPIView(APIView):
    def post(self, request):
        # Add answer
        serializer = UserResponseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
