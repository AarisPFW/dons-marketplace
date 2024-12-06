# urls.py
from django.urls import path
from . import views

# urlpatterns = [
#     path('auth/signup/', views.signup, name='signup'),
#     path('auth/login/', views.login, name='login'),
#     path('protected/', views.protected_route, name='protected'),
#     path('auth/refresh-token/', views.refresh_token, name='refresh_token'),
#     path('auth/logout/', views.logout, name='logout'),
# ]

urlpatterns = [
    path('auth/send-otp/', views.send_signup_otp, name='send_signup_otp'),
    path('auth/verify-otp/', views.verify_signup_otp, name='verify_signup_otp'),
    path('auth/signup/', views.signup, name='signup'),
    path('auth/login/', views.login, name='login'),
    path('auth/refresh-token/', views.refresh_token, name='refresh_token'),
    path('auth/logout/', views.logout, name='logout'),
    path('profile/', views.user_profile, name='user_profile'),

    # Product-related URLs
    path('products/', views.get_products, name='get_products'),
    path('products/create/', views.create_product, name='create_product'),
    path('products/<str:product_id>/', views.get_product, name='get_product'),
    path('products/<str:product_id>/update/', views.update_product, name='update_product'),
    path('products/<str:product_id>/delete/', views.delete_product, name='delete_product'),
]