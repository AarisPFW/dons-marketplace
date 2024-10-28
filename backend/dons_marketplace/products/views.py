from django.shortcuts import render
from .models import products_collection
from django.http import HttpResponse

def index(request):
    return HttpResponse("<h1>Welcome to Dons Marketplace </h1>")

def add_product(request):
    record = {
        "product_id": 1,
        "user_id": 123,
        "title": "Used Textbooks for Computer Science",
        "description": "A collection of textbooks used for a computer science course, including 'Introduction to Algorithms' and 'Operating Systems Concepts'.",
        "price": 50.00,
        "category": "Books",
        "condition": "Used",
        "location": "Purdue University",
        "is_available": True,
        "posted_at": "2023-11-22T12:34:56Z"
    }
    products_collection.insert_one(record)
    return HttpResponse("<h1>New Product is added</h1>")

def get_all_products(request):
    products = products_collection.find()
    return HttpResponse(products)