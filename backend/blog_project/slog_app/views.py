from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserRegistrationSerializer, UserProfileSerializer

User = get_user_model()

class RPCView(APIView):

    def post(self, request):
        method = request.data.get('method')
        if method == 'register':
            return self.register(request)
        elif method == 'login':
            return self.login(request)
        elif method == 'logout':
            return self.logout(request)
        else:
            return Response({'error': 'Invalid method'}, status=status.HTTP_400_BAD_REQUEST)

    def register(self, request):
        serializer = UserRegistrationSerializer(data=request.data.get('params'))
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def login(self, request):
        username = request.data.get('params').get('username')
        password = request.data.get('params').get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_200_OK)
        return Response({'error': 'Invalid Credentials'}, status=status.HTTP_400_BAD_REQUEST)

    def logout(self, request):
        return Response(status=status.HTTP_200_OK)
