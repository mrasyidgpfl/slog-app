from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from slogapp.models import Blog, Comment, Category, BlogCategory
from slogapp.serializers import BlogSerializer, CommentSerializer

class BlogSerializerTest(TestCase):
    
    def test_create_blog(self):
        user = User.objects.create(username='testuser', email='test@example.com')
        category_names = ['Technology', 'Science']
        data = {
            'user_id': user.id,
            'content': 'Test blog content',
            'draft': False,
            'hidden': False,
            'categories': category_names
        }
        
        serializer = BlogSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        blog = serializer.save()
        
        # Check if the blog was created with correct data
        self.assertEqual(blog.user_id, user.id)
        self.assertEqual(blog.content, data['content'])
        self.assertEqual(blog.draft, data['draft'])
        self.assertEqual(blog.hidden, data['hidden'])
        
        # Check categories
        categories = blog.categories.all()
        self.assertEqual(categories.count(), len(category_names))
        self.assertEqual(set(category.category_name for category in categories), set(category_names))
    
    def test_update_blog(self):
        user = User.objects.create(username='testuser', email='test@example.com')
        blog = Blog.objects.create(user=user, content='Initial content')
        new_content = 'Updated blog content'
        data = {
            'content': new_content,
            'draft': True,
            'categories': ['Travel', 'Food']
        }
        
        serializer = BlogSerializer(instance=blog, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_blog = serializer.save()
        
        # Check if the blog was updated with correct data
        self.assertEqual(updated_blog.content, new_content)
        self.assertEqual(updated_blog.draft, data['draft'])
        
        # Check categories
        categories = updated_blog.categories.all()
        self.assertEqual(categories.count(), len(data['categories']))
        self.assertEqual(set(category.category_name for category in categories), set(data['categories']))

class CommentSerializerTest(TestCase):
    
    def test_create_comment(self):
        user = User.objects.create(username='testuser', email='test@example.com')
        blog = Blog.objects.create(user=user, content='Test blog content')
        data = {
            'blog': blog.id,
            'content': 'Test comment content'
        }
        
        serializer = CommentSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        comment = serializer.save(user=user)
        
        # Check if the comment was created with correct data
        self.assertEqual(comment.blog_id, blog.id)
        self.assertEqual(comment.content, data['content'])
        self.assertEqual(comment.user, user)
    
    def test_update_comment(self):
        user = User.objects.create(username='testuser', email='test@example.com')
        blog = Blog.objects.create(user=user, content='Test blog content')
        comment = Comment.objects.create(blog=blog, user=user, content='Initial comment')
        new_content = 'Updated comment content'
        data = {
            'content': new_content
        }
        
        serializer = CommentSerializer(instance=comment, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        updated_comment = serializer.save()
        
        # Check if the comment was updated with correct data
        self.assertEqual(updated_comment.content, new_content)
