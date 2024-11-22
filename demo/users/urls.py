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
    path('auth/signup/', views.signup, name='signup'),
    path('auth/login/', views.login, name='login'),
    path('auth/refresh-token/', views.refresh_token, name='refresh_token'),
    path('auth/logout/', views.logout, name='logout'),
    path('profile/', views.user_profile, name='user_profile'),
]