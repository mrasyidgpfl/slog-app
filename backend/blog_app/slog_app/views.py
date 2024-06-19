from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout

def rpc_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True, 'message': 'Logged in successfully'})
        else:
            return JsonResponse({'success': False, 'message': 'Invalid credentials'})
    else:
        return JsonResponse({'success': False, 'message': 'Only POST requests are allowed'})

def rpc_logout(request):
    logout(request)
    return JsonResponse({'success': True, 'message': 'Logged out successfully'})
