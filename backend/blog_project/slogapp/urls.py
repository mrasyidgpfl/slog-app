from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'), # OK
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # OK
    path('register/', views.RegisterView.as_view(), name='register'), # OK
    path('profile/', views.ProfileView.as_view(), name='profile'), # OK
    path('profile/<int:user_id>/', views.ProfileDetailView.as_view(), name='profile-detail'), # OK
    path('profile/update/<int:user_id>/', views.ProfileUpdateView.as_view(), name='profile-update'), # OK
    path('blogs/', views.PublicBlogListView.as_view(), name='blog-list'),
    path('blogs/admin/', views.AdminBlogListView.as_view(), name='blog-list'),
    path('blogs/create/', views.BlogCreateView.as_view(), name='blog-create'),
    path('blogs/<int:pk>/', views.BlogDetailView.as_view(), name='blog-detail'),
    path('blogs/drafts/', views.DraftBlogListCreateView.as_view(), name='draft-blog-list-create'),
    path('blogs/drafts/<int:pk>/', views.DraftBlogDetailView.as_view(), name='draft-blog-detail'),
    path('blogs/<int:blog_id>/hide/', views.BlogHideView.as_view(), name='blog-hide'),
    path('blogs/<int:blog_id>/categories/', views.BlogCategoryCreateView.as_view(), name='blog-category-create'),
    path('comments/', views.CommentListCreateView.as_view(), name='comment-list-create'),
    path('comments/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'),
    path('likes/', views.LikeListCreateView.as_view(), name='like-list-create'),
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'), # OK
]
