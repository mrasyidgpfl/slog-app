from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('profile/', views.ProfileView.as_view(), name='profile'),
    path('profile/<int:user_id>/', views.ProfileDetailView.as_view(), name='profile-detail'),
    path('profile/update/<int:user_id>/', views.ProfileUpdateView.as_view(), name='profile-update'),
    path('blogs/', views.BlogListCreateView.as_view(), name='blog-list-create'),
    path('blogs/<int:pk>/', views.BlogDetailView.as_view(), name='blog-detail'),
    path('comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('likes/', views.LikeListCreateView.as_view(), name='like-list-create'),
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'),
    path('login/', views.login_view, name='login'),
]
