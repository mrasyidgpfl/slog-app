from rest_framework import generics
from .models import User, Profile, Blog, Comment, Like, Category
from .serializers import UserSerializer, ProfileSerializer, BlogSerializer, CommentSerializer, LikeSerializer, CategorySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class CommentListCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class LikeListCreateView(generics.ListCreateAPIView):
    queryset = Like.objects.all()
    serializer_class = LikeSerializer

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@api_view(['POST'])
def login_view(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    # Print debugging information
    print(f"Attempting login for username: {username}")
    
    # Authenticate user
    user = authenticate(request, username=username, password=password)

    if user:
        # Update last login timestamp (if needed)
        update_last_login(None, user)
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Return tokens in response (for testing)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})
    
    # Return error response for invalid credentials
    print(f"Failed login attempt for username: {username}")
    return Response({'error': 'Invalid Credentials'}, status=400)

class ProfileDetailView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        return self.queryset.get(user__id=user_id)

class ProfileUpdateView(generics.UpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_object(self):
        # Get the profile object based on the URL's user_id
        user_id = self.kwargs.get('user_id')
        profile = self.queryset.get(user__id=user_id)
        
        # Check if the logged-in user is trying to update their own profile
        if self.request.user.id != profile.user.id:
            raise PermissionDenied("You do not have permission to edit this profile.")
        
        return profile

    def update(self, request, *args, **kwargs):
        # Ensure the user is only updating their own profile
        profile = self.get_object()
        
        if request.user != profile.user:
            return Response({'error': 'You do not have permission to update this profile.'}, status=403)
        
        return super().update(request, *args, **kwargs)

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def update(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=403)
        return super().update(request, *args, **kwargs)
