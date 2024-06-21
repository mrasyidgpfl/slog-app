from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=255, choices=[('admin', 'Admin'), ('user', 'User')])

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=255)
    image_url = models.CharField(max_length=255)

class Category(models.Model):
    category_name = models.CharField(max_length=255)

class Blog(models.Model):
    content = models.TextField()
    created_datetime = models.DateTimeField(auto_now_add=True)
    updated_datetime = models.DateTimeField(auto_now=True)
    categories = models.ManyToManyField(Category, through='BlogCategory')

class BlogCategory(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

class Comment(models.Model):
    post = models.ForeignKey(Blog, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()

class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    blog = models.ForeignKey(Blog, null=True, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, null=True, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'blog', 'comment')
