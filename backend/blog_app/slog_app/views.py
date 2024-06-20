from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.files.base import ContentFile
from .models import Profile, CustomUser
from .forms import UserRegistrationForm, ProfileEditForm, ChangePasswordForm
import json
import base64

@csrf_exempt
def rpc_register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            form = UserRegistrationForm(data)
            if form.is_valid():
                user = form.save(commit=False)
                user.set_password(data['password'])
                user.save()
                Profile.objects.create(user=user)
                return JsonResponse({'success': True, 'message': 'Registered successfully'})
            else:
                return JsonResponse({'success': False, 'message': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Only POST requests are allowed'}, status=405)

@csrf_exempt
def rpc_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username_or_email = data.get('username_or_email')
            password = data.get('password')
            user = authenticate(username=username_or_email, password=password)
            if user is None:
                try:
                    user = CustomUser.objects.get(email=username_or_email)
                    user = authenticate(username=user.username, password=password)
                except CustomUser.DoesNotExist:
                    user = None
            if user is not None:
                login(request, user)
                return JsonResponse({'success': True, 'message': 'Logged in successfully'})
            else:
                return JsonResponse({'success': False, 'message': 'Invalid credentials'})
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'success': False, 'message': 'Only POST requests are allowed'}, status=405)

@csrf_exempt
def rpc_logout(request):
    logout(request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully'})

@login_required
@require_http_methods(["GET", "PUT", "DELETE"])
def profile_detail(request):
    user = request.user
    profile = user.profile

    if request.method == 'GET':
        profile_data = {
            'username': user.username,
            'email': user.email,
            'bio': profile.bio,
            'profile_image': profile.profile_image.url if profile.profile_image else None,
            'join_date': profile.join_date.strftime('%Y-%m-%d') if profile.join_date else None,
        }
        return JsonResponse(profile_data)

    elif request.method == 'PUT':
        try:
            data = json.loads(request.body)
            form = ProfileEditForm(data, request.FILES, instance=profile)
            if form.is_valid():
                if 'profile_image' in data:
                    profile.profile_image = form.cleaned_data['profile_image']
                form.save()
                return JsonResponse({'success': True, 'message': 'Profile updated successfully'})
            else:
                return JsonResponse({'success': False, 'message': form.errors}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON format'}, status=400)

    elif request.method == 'DELETE':
        user.delete()
        return JsonResponse({'success': True, 'message': 'Profile deleted successfully'})

    else:
        return JsonResponse({'success': False, 'message': 'Method not allowed'}, status=405)

@login_required
@require_http_methods(["PUT"])
def change_password(request):
    try:
        data = json.loads(request.body)
        password_form = ChangePasswordForm(request.user, data)
        
        if password_form.is_valid():
            user = password_form.save()
            update_session_auth_hash(request, user)  # Update the session with the user's new password
            return JsonResponse({'success': True, 'message': 'Password updated successfully'})
        else:
            return JsonResponse({'success': False, 'message': password_form.errors}, status=400)
    
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Invalid JSON format'}, status=400)