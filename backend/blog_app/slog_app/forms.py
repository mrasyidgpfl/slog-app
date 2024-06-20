from django import forms
from .models import Profile, CustomUser
from django.core.validators import RegexValidator, EmailValidator

class UserRegistrationForm(forms.ModelForm):
    username = forms.CharField(
        max_length=30,
        validators=[RegexValidator(r'^[\w.-]+$', 'Only alphanumeric characters, dots, hyphens, and underscores are allowed. Additionally max 30 chars is allowed for username.')]
    )
    email = forms.EmailField(validators=[EmailValidator('Enter a valid email address.')])
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

from PIL import Image
class ProfileEditForm(forms.ModelForm):
    bio = forms.CharField(max_length=160, required=False, widget=forms.Textarea)
    profile_image = forms.ImageField(required=False)

    class Meta:
        model = Profile
        fields = ['bio', 'profile_image']

    def clean_profile_image(self):
        profile_image = self.cleaned_data.get('profile_image')
        if profile_image:
            image = Image.open(profile_image)
            if image.width != 400 or image.height != 400:
                raise forms.ValidationError("Image dimensions must be 400x400 pixels.")
        return profile_image

class ChangePasswordForm(forms.Form):
    old_password = forms.CharField(widget=forms.PasswordInput)
    new_password = forms.CharField(widget=forms.PasswordInput)
    confirm_new_password = forms.CharField(widget=forms.PasswordInput)