from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserModel
import jwt
from django.conf import settings
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        request = args[0]
        token = request.headers.get('Authorization')
        
        if not token:
            return JsonResponse({'message': 'Token is missing'}, status=401)
            
        try:
            # Remove 'Bearer ' from token
            token = token.split(' ')[1]
            data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            request.user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return JsonResponse({'message': 'Token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'message': 'Invalid token'}, status=401)
            
        return f(*args, **kwargs)
    return decorated

@csrf_exempt
def signup(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')  # In production, hash this password
    username = data.get('username')
    
    try:
        user_id = UserModel.create_user(email, password, username)
        token = UserModel.create_token(user_id)
        return JsonResponse({
            'message': 'User created successfully',
            'token': token
        })
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'Server error'}, status=500)

@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    data = json.loads(request.body)
    email = data.get('email')
    password = data.get('password')
    
    user = UserModel.get_user_by_email(email)
    
    if not user or user['password'] != password:  # In production, verify hashed password
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
        
    token = UserModel.create_token(user['_id'])
    return JsonResponse({
        'message': 'Login successful',
        'token': token
    })

@token_required
@csrf_exempt
def protected_route(request):
    user = UserModel.get_user_by_id(request.user_id)
    return JsonResponse({
        'message': f'Hello {user["username"]}',
        'data': 'This is protected data'
    })