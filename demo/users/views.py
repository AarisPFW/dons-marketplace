from bson import ObjectId
from django.shortcuts import render

# Create your views here.
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import UserModel
import jwt
from django.conf import settings
from functools import wraps
from .models import TokenModel, OTPModel

##old method
# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         request = args[0]
#         token = request.headers.get('Authorization')
        
#         if not token:
#             return JsonResponse({'message': 'Token is missing'}, status=401)
            
#         try:
#             # Remove 'Bearer ' from token
#             token = token.split(' ')[1]
#             data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
#             request.user_id = data['user_id']
#         except jwt.ExpiredSignatureError:
#             return JsonResponse({'message': 'Token has expired'}, status=401)
#         except jwt.InvalidTokenError:
#             return JsonResponse({'message': 'Invalid token'}, status=401)
            
#         return f(*args, **kwargs)
#     return decorated

##new method
######
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
            
            # Decode token
            data = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            
            # Verify token type is access token
            if data.get('type') != 'access':
                return JsonResponse({'message': 'Invalid token type'}, status=401)
            
            request.user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return JsonResponse({'message': 'Access token has expired'}, status=401)
        except jwt.InvalidTokenError:
            return JsonResponse({'message': 'Invalid access token'}, status=401)
            
        return f(*args, **kwargs)
    return decorated

@csrf_exempt
def refresh_token(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        refresh_token = data.get('refresh_token')
        
        if not refresh_token:
            return JsonResponse({'error': 'Refresh token is required'}, status=400)
        
        # Validate refresh token
        user_id = TokenModel.validate_refresh_token(refresh_token)
        
        # Generate new access and refresh tokens
        new_access_token, new_refresh_token = TokenModel.create_tokens(user_id)
        
        return JsonResponse({
            'access_token': new_access_token,
            'refresh_token': new_refresh_token
        })
    
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=401)
    except Exception as e:
        return JsonResponse({'error': 'Server error'}, status=500)

# @csrf_exempt
# def signup(request):
#     if request.method != 'POST':
#         return JsonResponse({'error': 'Method not allowed'}, status=405)
        
#     data = json.loads(request.body)
#     email = data.get('email')
#     password = data.get('password')  # In production, hash this password
#     username = data.get('username')
    
#     try:
#         user_id = UserModel.create_user(email, password, username)
#         token = UserModel.create_token(user_id)
#         return JsonResponse({
#             'message': 'User created successfully',
#             'token': token
#         })
#     except ValueError as e:
#         return JsonResponse({'error': str(e)}, status=400)
#     except Exception as e:
#         return JsonResponse({'error': 'Server error'}, status=500)

# @csrf_exempt
# def login(request):
#     if request.method != 'POST':
#         return JsonResponse({'error': 'Method not allowed'}, status=405)
        
#     data = json.loads(request.body)
#     email = data.get('email')
#     password = data.get('password')
    
#     user = UserModel.get_user_by_email(email)
    
#     if not user or user['password'] != password:  # In production, verify hashed password
#         return JsonResponse({'error': 'Invalid credentials'}, status=401)
        
#     token = UserModel.create_token(user['_id'])
#     return JsonResponse({
#         'message': 'Login successful',
#         'token': token
#     })

# @token_required
# @csrf_exempt
# def protected_route(request):
#     user = UserModel.get_user_by_id(request.user_id)
#     return JsonResponse({
#         'message': f'Hello {user["username"]}',
#         'data': 'This is protected data'
#     })

# views.py
@csrf_exempt
def signup(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')  # Remember to hash in production
        username = data.get('username')
        
        # Basic validation
        if not all([email, password, username]):
            return JsonResponse({'error': 'All fields are required'}, status=400)
        
        # Create user
        user_id = UserModel.create_user(email, password, username)
        
        # Generate both tokens
        access_token, refresh_token = TokenModel.create_tokens(user_id)
        
        return JsonResponse({
            'message': 'User created successfully',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': str(user_id),
                'email': email,
                'username': username
            }
        })
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'Server error'}, status=500)

@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
        
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return JsonResponse({'error': 'Email and password are required'}, status=400)
        
        user = UserModel.get_user_by_email(email)
        
        if not user or user['password'] != password:  # In production, verify hashed password
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        
        # Generate both tokens
        access_token, refresh_token = TokenModel.create_tokens(str(user['_id']))
        
        return JsonResponse({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': str(user['_id']),
                'email': user['email'],
                'username': user['username']
            }
        })
    except Exception as e:
        return JsonResponse({'error': 'Server error'}, status=500)

# Example of a protected route that requires authentication
# @token_required
# def user_profile(request):
#     try:
#         user = UserModel.get_user_by_id(ObjectId(request.user_id))
#         if not user:
#             return JsonResponse({'error': 'User not found'}, status=404)
            
#         return JsonResponse({
#             'id': str(user['_id']),
#             'email': user['email'],
#             'username': user['username']
#         })
#     except Exception as e:
#         return JsonResponse({'error': 'Server error'}, status=500)

# views.py additions
@csrf_exempt
def send_signup_otp(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get('email')
        role = data.get('role', 'buyer')
        
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
        
        # Generate and send OTP
        otp = OTPModel.generate_otp(email)
        OTPModel.send_otp_email(email, otp)
        
        return JsonResponse({
            'message': 'OTP sent successfully',
            'email': email
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def verify_signup_otp(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        data = json.loads(request.body)
        email = data.get('email')
        otp = data.get('otp')
        password = data.get('password')
        username = data.get('username')
        role = data.get('role', 'buyer')
        
        # Verify OTP
        OTPModel.verify_otp(email, otp)
        
        # Create user with verified status
        user_id = UserModel.create_user(email, password, username, role)
        
        # Generate tokens
        access_token, refresh_token = TokenModel.create_tokens(user_id)
        
        return JsonResponse({
            'message': 'Signup successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user_id,
                'email': email,
                'username': username,
                'role': role
            }
        })
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'Signup failed'}, status=500)

# Modify user_profile to show role-specific content
@token_required
def user_profile(request):
    try:
        user = UserModel.get_user_by_id(ObjectId(request.user_id))
        if not user:
            return JsonResponse({'error': 'User not found'}, status=404)
        
        # Role-specific profile data
        if user['role'] == 'buyer':
            profile_data = {
                'id': str(user['_id']),
                'email': user['email'],
                'username': user['username'],
                'role': user['role'],
                'purchase_history': [],  # Placeholder for buyer-specific data
                'preferences': {}
            }
        elif user['role'] == 'seller':
            profile_data = {
                'id': str(user['_id']),
                'email': user['email'],
                'username': user['username'],
                'role': user['role'],
                'products': [],  # Placeholder for seller-specific data
                'sales_stats': {}
            }
        
        return JsonResponse(profile_data)
    except Exception as e:
        return JsonResponse({'error': 'Server error'}, status=500)
@csrf_exempt
def logout(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        # Get the access and refresh tokens from the request
        access_token = request.headers.get('Authorization', '').split(' ')[1]
        # refresh_token = json.loads(request.body).get('refresh_token')
        
        # Decode tokens to get user_id
        access_data = jwt.decode(access_token, settings.SECRET_KEY, algorithms=['HS256'])
        user_id = access_data['user_id']
        
        # Revoke all tokens for this user
        TokenModel.revoke_tokens(user_id)
        
        return JsonResponse({'message': 'Logged out successfully'})
    
    except Exception as e:
        return JsonResponse({'error': 'Logout failed'}, status=500)