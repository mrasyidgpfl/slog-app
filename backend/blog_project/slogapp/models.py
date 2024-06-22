from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from django.dispatch import receiver

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

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal receiver to create a Profile when a new User is created.
    """
    if created:
        Profile.objects.create(user=instance, bio='', image_url='')

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal receiver to save the Profile when the User is saved.
    """
    instance.profile.save()