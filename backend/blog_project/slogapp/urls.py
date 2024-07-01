from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('login/', views.login_view, name='login'), # POST 200 OK
    path('logout/', views.logout_view, name='logout'), # POST 200 OK
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # OK
    path('register/', views.RegisterView.as_view(), name='register'), # POST 201 OK
    path('profile/', views.ProfileView.as_view(), name='profile'), # OK 
    path('profiles/', views.ProfileListView.as_view(), name='profile-list'),
    path('profile/<int:user_id>/', views.ProfileDetailView.as_view(), name='profile-detail'), # OK
    path('profile/<username>/', views.ProfileDetailByUsernameView.as_view(), name='profile-detail-by-username'), # OK
    path('profile/update/<int:user_id>/', views.ProfileUpdateView.as_view(), name='profile-update'), # OK
    path('blogs/', views.PublicBlogListView.as_view(), name='user-blogs'), # OK
    path('blogs/<int:blog_id/', views.BlogDetailView.as_view(), name='blog-detail'), # OK
    path('blogs/public/<int:user_id>/', views.PublicProfileBlogListView.as_view(), name='blog-list'), # OK
    path('blogs/private/<int:user_id>/', views.PrivateProfileBlogListView.as_view(), name='blog-list-includes-draft'), # OK
    path('blogs/admin/', views.AdminBlogListView.as_view(), name='blog-list'), # OK
    path('blogs/create/', views.BlogCreateView.as_view(), name='blog-create'), # OK
    path('blogs/<int:pk>/', views.BlogDetailView.as_view(), name='blog-detail'), # OK
    path('blogs/<int:pk>/', views.BlogEditView.as_view(), name='blog-detail'), # OK
    path('blogs/delete/<int:pk>/', views.BlogDeleteView.as_view(), name='delete-blog'), # OK
    path('blogs/drafts/', views.DraftBlogListCreateView.as_view(), name='draft-blog-list-create'),
    path('blogs/drafts/<int:pk>/', views.DraftBlogDetailView.as_view(), name='draft-blog-detail'),
    path('blogs/hide/<int:pk>/', views.BlogHideView.as_view(), name='blog-hide'), # OK
    path('blog-categories/', views.BlogCategoryListView.as_view(), name='blog-categories'), # OK
    path('comments/', views.CommentListView.as_view(), name='comment-list-create'), # OK
    path('comments/<int:blog_id>/', views.CommentByBlogIdView.as_view(), name='comments-by-blog'), # OK
    path('comments/create/', views.CommentCreateView.as_view(), name='comment-list-create'), # OK
    path('comments/detail/<int:pk>/', views.CommentDetailView.as_view(), name='comment-detail'), # OK
    path('comments/count/<int:pk>/', views.CommentCountView.as_view(), name='comment-count'), # OK
    path('blog-likes/', views.BlogLikeListView.as_view(), name='blog-like-list'), # OK
    path('blog-likes/create/', views.BlogLikeCreateView.as_view(), name='blog-like-create'), # OK
    path('blog-likes/delete/<int:pk>/', views.BlogLikeDeleteView.as_view(), name='blog-like-delete'),
    path('blog-likes/count/<int:blog_id>/', views.BlogLikeCountView.as_view(), name='blog-like-count'), # OK
    path('comment-likes/', views.CommentLikeListView.as_view(), name='comment-like-list'), # OK
    path('comment-likes/create/', views.CommentLikeCreateView.as_view(), name='comment-like-create'), # OK
    path('comment-likes/delete/<int:pk>/', views.CommentLikeDeleteView.as_view(), name='comment-like-delete'), # OK
    path('comment-likes/count/<int:comment_id>/', views.CommentLikeCountView.as_view(), name='comment-like-count'), # OK
    path('categories/', views.CategoryListCreateView.as_view(), name='category-list-create'), # OK
]
