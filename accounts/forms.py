from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm


class UserSignUpForm(UserCreationForm):
    fullname = forms.CharField(max_length=30, help_text='Please input your name. e.g. Jeffrey Washington')

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ['fullname', 'email', 'password1', 'password2', ]


class UserLoginForm(forms.Form):
    email = forms.EmailField()
    password = forms.CharField(
        widget=forms.PasswordInput()
    )
