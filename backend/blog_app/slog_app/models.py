from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator, EmailValidator

class CustomUser(AbstractUser):
    username = models.CharField(
        max_length=30,
        unique=True,
        validators=[
            RegexValidator(r'^[\w.-]+$', 'Only alphanumeric characters, dots, hyphens, and underscores are allowed. Additionally max 30 chars is allowed for username.')
        ]
    )
    email = models.EmailField(
        validators=[EmailValidator('Enter a valid email address.')],
        unique=True
    )

from django.conf import settings
from PIL import Image
import os

def resize_image(image, size=(400, 400)):
    img = Image.open(image)
    img.thumbnail(size)
    img_format = img.format
    img.save(image.path, img_format)

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    bio = models.CharField(max_length=160, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profile_images/', default='default/default-image.png')

    def save(self, *args, **kwargs):
        if self.profile_image:
            resize_image(self.profile_image)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.user.username


from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=CustomUser)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    instance.profile.save()

class BlogPost(models.Model):
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
