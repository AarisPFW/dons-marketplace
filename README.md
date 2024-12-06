# dons-marketplace
Marketplace is a college project built using React, Django, and MongoDB. It serves as an exclusive online platform where students log in with their college email to buy or sell products. The project follows agile methodologies and includes features like user authentication, product listings, and responsive design.

 # to activate a environment
deactivate # to deactivate the environment
python manage.py runserver 
pip install -r requirements.txt
django-admin 
django-admin startproject devsearch 
python manage.py runserver
control c # to stop thew server
python3 manage.py startapp projects# create a new app
-------
super user name rahulalladi
mail bunnyfeb10@gmail.com
pwd R@hul123

2nd user name:- JohnDoe pwd:- R@hul123
admin panel will only be available if initial migrations are made
--------
ython manage.py shell
if u want to create a model create a class and inherit Django model
ex:- class Project(models.Model):
        title = models.CharField()
        description = 
        id = models.UUIDField()
--------
test2 = Project.objects.filter(vote_ratio__gte=50)
                or
        Project.objects.all()
                or        
        ecommerce_website = Project.objects.get(title='Ecommerce Website')
        print(ecommerce_website.review_set.all()) # this will print all the reviews of ecom project notive reviews is small case even though model name is Review(you have to give in small case only)
print(test2)

project = Project.objects.get(title='Ecommerce Website')
print(project.tags.all()) #to get all the tags of ecom website
-----------

FS
npm start
npm run dev
node server.js
------------
## --for prod 
# -- password hashing
from django.contrib.auth.hashers import make_password, check_password

# In UserModel.create_user:
password = make_password(password)

# In login view:
if not check_password(password, user['password']):
    return JsonResponse({'error': 'Invalid credentials'}, status=401)
# --input validation
from django.core.validators import validate_email
from django.core.exceptions import ValidationError

def validate_user_data(email, password, username=None):
    try:
        validate_email(email)
    except ValidationError:
        raise ValueError("Invalid email format")
        
    if len(password) < 8:
        raise ValueError("Password must be at least 8 characters")
        
    if username and len(username) < 3:
        raise ValueError("Username must be at least 3 characters")
# --------
# Add token blacklisting for logout:
# Add to models.py
class TokenBlacklist:
    collection = db['token_blacklist']
    
    @staticmethod
    def blacklist_token(token):
        TokenBlacklist.collection.insert_one({
            "token": token,
            "created_at": datetime.utcnow()
        })
    
    @staticmethod
    def is_blacklisted(token):
        return bool(TokenBlacklist.collection.find_one({"token": token}))

# Add to views.py
@csrf_exempt
@token_required
def logout(request):
    token = request.headers.get('Authorization').split(' ')[1]
    TokenBlacklist.blacklist_token(token)
    return JsonResponse({'message': 'Logged out successfully'})