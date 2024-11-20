# from django.db import models

# Create your models here.
# models.py
from pymongo import MongoClient
from bson import ObjectId
import jwt
from datetime import datetime, timedelta
from django.conf import settings

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
