from rest_framework import generics, status
from .models import User, Profile, Blog, Comment, Like, Category, BlogCategory
from .serializers import UserSerializer, ProfileSerializer, BlogSerializer, CommentSerializer, LikeSerializer, CategorySerializer, BlogCategorySerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

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
    
    user = authenticate(request, username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    
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
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        profile = self.queryset.get(user__id=user_id)
        if self.request.user.id != profile.user.id:
            raise PermissionDenied("You do not have permission to edit this profile.")
        return profile

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        if request.user != profile.user:
            return Response({'error': 'You do not have permission to update this profile.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only show non-draft blogs to non-admin users
        if self.request.user.role != 'admin':
            return Blog.objects.filter(draft=False)
        return Blog.objects.all()

    def perform_create(self, serializer):
        # Ensure the blog is associated with the current user
        serializer.save()

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response({'error': 'Permission denied'}, status=403)
        return super().update(request, *args, **kwargs)

class BlogHideView(generics.UpdateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.role != 'admin':
            raise PermissionDenied("Only admin can hide blogs.")
        instance.hidden = True
        instance.save()
        return Response({'message': 'Blog hidden successfully.'})

class DraftBlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def get_queryset(self):
        return self.queryset.filter(draft=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, draft=True)

class DraftBlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user != instance.user and request.user.role != 'admin':
            raise PermissionDenied("You do not have permission to update this draft blog.")
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user != instance.user and request.user.role != 'admin':
            raise PermissionDenied("You do not have permission to delete this draft blog.")
        instance.delete()
        return Response({'message': 'Draft blog deleted successfully.'}, status=status.HTTP_204_NO_CONTENT)

class BlogCategoryCreateView(generics.CreateAPIView):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer

    def perform_create(self, serializer):
        blog_id = self.kwargs.get('blog_id')
        blog = Blog.objects.get(pk=blog_id)
        serializer.save(blog=blog)