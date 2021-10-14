from django.contrib.auth.views import LogoutView
from django.urls import path

from landing.views import index
from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('signup', register, name='sign_up'),
    path('login', log_in, name='login'),
    path("logout/", LogoutView.as_view(), name="logout"),
    path('user-signup-verification/<str:confirm_id>', user_confirmation, name='user_confirmation'),

    # ajax
    path('forgot-password-redirect-url', forgot_password_redirect, name='forgot_password_redirect'),
    path('forgot-password', forgot_password, name='forgot_password'),

]