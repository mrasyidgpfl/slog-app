from rest_framework import generics, status
from .models import User, Profile, Blog, Comment, BlogLike, CommentLike, Category, BlogCategory
from .serializers import UserSerializer, ProfileSerializer, BlogSerializer, CommentSerializer, BlogLikeSerializer, CommentLikeSerializer, CategorySerializer, BlogCategorySerializer, CommentCountSerializer
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import IntegrityError
from .models import User
from .serializers import UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        # Validate the serializer
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        # Check for unique constraints before saving the user
        username = serializer.validated_data.get('username')
        email = serializer.validated_data.get('email')

        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Save the user if no errors
            user = serializer.save()

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)

            return Response({
                'access_token': access_token,
                'refresh_token': str(refresh),
                'user': UserSerializer(user).data,
            }, status=status.HTTP_201_CREATED)

        except IntegrityError as e:
            # Handle integrity errors (e.g., unique constraint violations)
            return Response({'error': 'Database error: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            # Handle any other unexpected errors
            return Response({'error': 'An unexpected error occurred: ' + str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

class BlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer

    def get_object(self):
        blog_id = self.kwargs['blog_id']
        return get_object_or_404(Blog, id=blog_id)


class CommentListView(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CommentCreateView(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'message': 'Comment successfully created.', 'data': serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        queryset = self.get_queryset()
        obj = queryset.get(pk=self.kwargs['pk'])
        # Ensure the comment belongs to the correct blog based on URL
        if 'blog_id' in self.kwargs:
            if obj.blog_id != int(self.kwargs['blog_id']):
                raise PermissionDenied("Comment does not belong to the specified blog.")
        return obj

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        if instance.user != request.user:
            raise PermissionDenied("You do not have permission to update this comment.")
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        comment = self.get_object()
        print(comment.user.id, request.user.id)
        if comment.user != request.user and request.user.role != 'admin':
            raise PermissionDenied("You do not have permission to delete this comment.")
        comment.delete()
        CommentLike.objects.filter(comment=comment).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class BlogLikeListView(generics.ListAPIView):
    queryset = BlogLike.objects.all()
    serializer_class = BlogLikeSerializer
    permission_classes = [AllowAny]

class BlogLikeCreateView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        blog_id = request.data.get('blog_id')
        # Check if BlogLike with user and blog already exists
        if BlogLike.objects.filter(user_id=user_id, blog_id=blog_id).exists():
            return Response({'error': 'BlogLike already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Otherwise, create new BlogLike
        try:
            blog_like = BlogLike.objects.create(user_id=user_id, blog_id=blog_id)
            return Response({'message': 'BlogLike created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CommentLikeListView(generics.ListAPIView):
    queryset = CommentLike.objects.all()
    serializer_class = CommentLikeSerializer
    permission_classes = [AllowAny]

class CommentLikeCreateView(generics.CreateAPIView):
    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        comment_id = request.data.get('comment_id')

        # Check if CommentLike with user and comment already exists
        if CommentLike.objects.filter(user_id=user_id, comment_id=comment_id).exists():
            return Response({'error': 'CommentLike already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Otherwise, create new CommentLike
        try:
            comment_like = CommentLike.objects.create(user_id=user_id, comment_id=comment_id)
            return Response({'message': 'CommentLike created successfully'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class BlogLikeCountView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        blog_id = self.kwargs.get('blog_id')
        blog = get_object_or_404(Blog, pk=blog_id)
        like_count = blog.likes.count()
        return Response({'blog_id': blog_id, 'like_count': like_count})

class CommentLikeCountView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]

    def retrieve(self, request, *args, **kwargs):
        comment_id = self.kwargs.get('comment_id')
        comment = get_object_or_404(Comment, pk=comment_id)
        like_count = comment.likes.count()
        return Response({'comment_id': comment_id, 'like_count': like_count})
    

class BlogLikeDeleteView(generics.DestroyAPIView):
    serializer_class = BlogLikeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            blog_like = BlogLike.objects.get(pk=self.kwargs.get('pk'), user=request.user)
            blog_like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except BlogLike.DoesNotExist:
            raise NotFound()

class CommentLikeDeleteView(generics.DestroyAPIView):
    serializer_class = CommentLikeSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        try:
            comment_like = CommentLike.objects.get(pk=self.kwargs.get('pk'), user=request.user)
            comment_like.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except CommentLike.DoesNotExist:
            raise NotFound()

class CommentCountView(generics.ListAPIView):
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        # Retrieve the blog instance based on the pk (blog_id)
        try:
            blog = Blog.objects.get(pk=pk)
        except Blog.DoesNotExist:
            return Response({'error': 'Blog not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Count the number of comments for the blog
        comment_count = Comment.objects.filter(blog=blog).count()

        # Serialize the count data
        serializer = CommentCountSerializer(data={'blog_id': pk, 'comment_count': comment_count})
        serializer.is_valid()  # Ensure serializer is valid (though in this case, should always be valid)

        return Response(serializer.data)

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

@api_view(['POST'])
def login_view(request):
    username_or_email = request.data.get('username_or_email')
    password = request.data.get('password')

    if username_or_email and password:
        if '@' in username_or_email:
            # Attempt to authenticate using email
            try:
                user = User.objects.get(email=username_or_email)
            except User.DoesNotExist:
                return Response({'error': 'Invalid Credentials'}, status=400)
        else:
            # Attempt to authenticate using username
            user = authenticate(request, username=username_or_email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data,
            })
    
    return Response({'error': 'Invalid Credentials'}, status=400)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data['refresh_token']
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'User logged out successfully.'}, status=200)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

class ProfileDetailView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_object(self):
        user_id = self.kwargs.get('user_id')
        return self.queryset.get(user__id=user_id)
    

class ProfileDetailByUsernameView(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def get_object(self):
        username = self.kwargs.get('username')
        profile = get_object_or_404(Profile, user__username=username)
        return profile

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


class AdminBlogListView(generics.ListAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]  # Ensure user is authenticated

    def list(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied("Only admin can see all blogs.")
        
        return super().list(request, *args, **kwargs)

class PublicBlogListView(generics.ListAPIView):
    serializer_class = BlogSerializer

    def get_queryset(self):
        return Blog.objects.filter(draft=False, hidden=False)

class BlogDetailView(generics.RetrieveAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]

class PublicProfileBlogListView(generics.ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Blog.objects.filter(user_id=user_id, draft=False, hidden=False)

class PrivateProfileBlogListView(generics.ListAPIView):
    serializer_class = BlogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Blog.objects.filter(user_id=user_id)

class BlogCreateView(generics.CreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user.id)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({'message': 'Blog successfully created.', 'data': serializer.data}, status=status.HTTP_201_CREATED, headers=headers)

class BlogDeleteView(generics.DestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()

        # Check if the user has permission to delete the blog
        if not (request.user == instance.user or request.user.role == 'admin'):
            return Response({'error': 'You do not have permission to delete this blog.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Delete related comments and likes
        Comment.objects.filter(post=instance).delete()
        BlogLike.objects.filter(blog=instance).delete()

        # Delete the blog instance
        instance.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)

class BlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]

class BlogEditView(generics.UpdateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        profile = self.get_object()
        if request.user != profile.user or request.user.role != 'admin':
            return Response({'error': 'You do not have permission to update this profile.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

class BlogHideView(generics.UpdateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user.is_staff != 1:
            raise PermissionDenied("Only admin can hide blogs.")
        instance.hidden = True
        instance.save()
        return Response({'message': 'Blog hidden successfully.'})

class DraftBlogListCreateView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(draft=True)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, draft=True)

class DraftBlogDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

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


class BlogCategoryListView(generics.ListAPIView):
    queryset = BlogCategory.objects.all()
    serializer_class = BlogCategorySerializer
    
