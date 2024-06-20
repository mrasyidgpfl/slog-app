from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from PIL import Image
from io import BytesIO
from django.core.files.base import ContentFile

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=160, blank=True)
    join_date = models.DateTimeField(auto_now_add=True)
    avatar = models.ImageField(upload_to='avatars/', default='placeholder')

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        if self.avatar:
            self.avatar = self.resize_avatar(self.avatar)
        super(Profile, self).save(*args, **kwargs)

    def resize_avatar(self, avatar):
        image = Image.open(avatar)
        image = image.resize((400, 400), Image.ANTIALIAS)

        buffer = BytesIO()
        image.save(buffer, format='JPEG')
        return ContentFile(buffer.getvalue(), name=avatar.name)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
