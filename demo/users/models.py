# from django.db import models

# Create your models here.
# models.py
from pymongo import MongoClient
from bson import ObjectId
import jwt
from datetime import datetime, timedelta
from django.conf import settings
import secrets

# client = MongoClient('mongodb://localhost:27017/')
client = MongoClient("localhost:27017")
db = client['demodatabase']

class UserModel:
    collection = db['democollection']
    
    @staticmethod
    def create_user(email, password, username):
        # Check if user exists
        if UserModel.collection.find_one({"email": email}):
            raise ValueError("User already exists")
            
        user_data = {
            "email": email,
            "password": password,  # In production, hash this password
            "username": username,
            "created_at": datetime.utcnow()
        }
        result = UserModel.collection.insert_one(user_data)
        return str(result.inserted_id)
    
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