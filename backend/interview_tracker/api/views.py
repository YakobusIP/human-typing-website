from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserResponseSerializer

# Create your views here.
    
class ChatPostAPIView(APIView):
    def post(self, request):
        serializer = UserResponseSerializer(data=request.data)
        if (serializer.is_valid()):
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

