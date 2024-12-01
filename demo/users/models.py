# from django.db import models

# Create your models here.
# models.py
from pymongo import MongoClient
from bson import ObjectId
import jwt
from datetime import datetime, timedelta
from django.conf import settings
import secrets
import random
from django.core.mail import send_mail

# # client = MongoClient('mongodb://localhost:27017/')
# client = MongoClient("localhost:27017")
# db = client['demodatabase']

# MongoDB Atlas connection string
# Replace with your actual connection string from MongoDB Atlas
MONGO_URI = "mongodb+srv://rahulalladi004:IWrksufcObrcwj1m@test-cluster.tyedv.mongodb.net/?retryWrites=true&w=majority&appName=Test-cluster"

try:
    # Connect with retry mechanism
    client = MongoClient(MONGO_URI, 
                        serverSelectionTimeoutMS=5000,  # 5 second timeout
                        connectTimeoutMS=10000,         # 10 second timeout
                        socketTimeoutMS=45000,          # 45 second timeout
                        maxPoolSize=50)                 # Maximum connection pool size
    
    # Test the connection
    client.admin.command('ping')
    print("Successfully connected to MongoDB Atlas!")
    
except Exception as e:
    print(f"Error connecting to MongoDB Atlas: {e}")
    raise

# Initialize database
db = client['demodatabase']  # Replace with your actual database name

class OTPModel:
    otp_collection = db['otp_collection']
    
    @staticmethod
    def generate_otp(email):
        # Generate a 6-digit OTP
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        # Store OTP with expiration (15 minutes)
        otp_data = {
            'email': email,
            'otp': otp,
            'created_at': datetime.utcnow(),
            'expires_at': datetime.utcnow() + timedelta(minutes=15)
        }
        
        # Remove any existing OTPs for this email
        OTPModel.otp_collection.delete_many({'email': email})
        
        # Insert new OTP
        OTPModel.otp_collection.insert_one(otp_data)
        
        return otp
    
    @staticmethod
    def send_otp_email(email, otp):
        subject = 'Your Signup OTP'
        message = f'Your OTP is: {otp}. It will expire in 15 minutes.'
        send_mail(
            subject, 
            message, 
            settings.DEFAULT_FROM_EMAIL, 
            [email], 
            fail_silently=False
        )
    
    @staticmethod
    def verify_otp(email, user_otp):
        # Find the most recent OTP for this email
        stored_otp = OTPModel.otp_collection.find_one({
            'email': email,
            'expires_at': {'$gt': datetime.utcnow()}
        })
        
        if not stored_otp:
            raise ValueError("OTP expired or not found")
        
        if stored_otp['otp'] != user_otp:
            raise ValueError("Invalid OTP")
        
        # Remove the OTP after successful verification
        OTPModel.otp_collection.delete_one({'_id': stored_otp['_id']})
        return True
    
# Update UserModel to include roles
class UserModel:
    collection = db['democollection']
    
    @staticmethod
    def create_user(email, password, username, role='buyer'):
        # Check if user exists
        if UserModel.collection.find_one({"email": email}):
            raise ValueError("User already exists")
        
        # Validate role
        if role not in ['buyer', 'seller']:
            raise ValueError("Invalid role. Must be 'buyer' or 'seller'")
        
        user_data = {
            "email": email,
            "password": password,  # In production, hash this password
            "username": username,
            "role": role,
            "is_verified": False,
            "created_at": datetime.utcnow()
        }
        result = UserModel.collection.insert_one(user_data)
        return str(result.inserted_id)
    
    @staticmethod
    def create_unverified_user(email, password, username, role='buyer'):
        """Create a new user with unverified status"""
        # Check if user exists and is verified
        existing_user = UserModel.collection.find_one({"email": email})
        if existing_user and existing_user.get('is_verified', False):
            raise ValueError("User already exists")
            
        # If user exists but is unverified, update their details
        if existing_user:
            UserModel.collection.update_one(
                {"email": email},
                {
                    "$set": {
                        "password": password,
                        "username": username,
                        "role": role,
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            return str(existing_user['_id'])
            
        # Create new unverified user
        user_data = {
            "email": email,
            "password": password,  # Remember to hash in production
            "username": username,
            "role": role,
            "is_verified": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        result = UserModel.collection.insert_one(user_data)
        return str(result.inserted_id)
    
    @staticmethod
    def verify_user(email):
        """Mark user as verified after OTP verification"""
        result = UserModel.collection.update_one(
            {"email": email},
            {
                "$set": {
                    "is_verified": True,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        if result.modified_count == 0:
            raise ValueError("User not found")
        
        # Return the updated user
        return UserModel.collection.find_one({"email": email})
    
# class UserModel:
#     collection = db['democollection']
    
#     @staticmethod
#     def create_user(email, password, username):
#         # Check if user exists
#         if UserModel.collection.find_one({"email": email}):
#             raise ValueError("User already exists")
            
#         user_data = {
#             "email": email,
#             "password": password,  # In production, hash this password
#             "username": username,
#             "created_at": datetime.utcnow()
#         }
#         result = UserModel.collection.insert_one(user_data)
#         return str(result.inserted_id)
    
    @staticmethod
    def get_user_by_email(email):
        return UserModel.collection.find_one({"email": email})
    
    @staticmethod
    def get_user_by_id(user_id):
        return UserModel.collection.find_one({"_id": ObjectId(user_id)})
        
    @staticmethod
    def create_token(user_id):
        payload = {
            'user_id': str(user_id),
            'exp': datetime.utcnow() + timedelta(days=1),
            'iat': datetime.utcnow()
        }
        return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


# client = MongoClient('mongodb://localhost:27017/')
# db = client['marketplace_db']

class TokenModel:
    access_tokens = db['access_tokens']
    refresh_tokens = db['refresh_tokens']
    
    @staticmethod
    def create_tokens(user_id):
        # Access Token (short-lived)
        access_token_payload = {
            'user_id': str(user_id),
            'type': 'access',
            'exp': datetime.utcnow() + timedelta(minutes=15),  # Short-lived (15 minutes)
            'iat': datetime.utcnow()
        }
        access_token = jwt.encode(access_token_payload, settings.SECRET_KEY, algorithm='HS256')
        
        # Refresh Token (long-lived)
        refresh_token_payload = {
            'user_id': str(user_id),
            'type': 'refresh',
            'token': secrets.token_hex(32),  # Unique refresh token
            'exp': datetime.utcnow() + timedelta(days=7),  # Longer expiration
            'iat': datetime.utcnow()
        }
        refresh_token = jwt.encode(refresh_token_payload, settings.SECRET_KEY, algorithm='HS256')
        
        # Store tokens in database for tracking and revocation
        TokenModel.access_tokens.insert_one({
            'token': access_token,
            'user_id': str(user_id),
            'created_at': datetime.utcnow(),
            'expires_at': refresh_token_payload['exp']
        })
        
        TokenModel.refresh_tokens.insert_one({
            'token': refresh_token,
            'user_id': str(user_id),
            'created_at': datetime.utcnow(),
            'expires_at': refresh_token_payload['exp']
        })
        
        return access_token, refresh_token
    
    @staticmethod
    def validate_refresh_token(refresh_token):
        try:
            # Decode and verify refresh token
            decoded_token = jwt.decode(refresh_token, settings.SECRET_KEY, algorithms=['HS256'])
            
            # Check if refresh token exists in database and is not expired
            stored_token = TokenModel.refresh_tokens.find_one({
                'token': refresh_token,
                'expires_at': {'$gt': datetime.utcnow()}
            })
            
            if not stored_token:
                raise ValueError("Invalid or expired refresh token")
            
            return decoded_token['user_id']
        except jwt.ExpiredSignatureError:
            raise ValueError("Refresh token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid refresh token")
    
    @staticmethod
    def revoke_tokens(user_id):
        # Remove all tokens for a user (useful for logout)
        TokenModel.access_tokens.delete_many({'user_id': str(user_id)})
        TokenModel.refresh_tokens.delete_many({'user_id': str(user_id)})