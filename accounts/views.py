import json
import random
import string

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.views.decorators.csrf import csrf_exempt

from .forms import UserSignUpForm, UserLoginForm
from .models import UserConfirmation, UserProfile, ForgotPasswordConfirmation


# from django.core.mail import send_mail


# Create your views here.

def generate_random_str(length=5):
    return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))


def send_email(to_email, url, fullname, mode):
    context = {}
    title = f'Welcome to Giving Pilot, {fullname}'
    from_email = 'giving.pilot@support.com'
    html_content = render_to_string('accounts/email_template.html',
                                    {"title": title, 'mode': mode, 'from_email': from_email, 'url': url})
    text_content = strip_tags(html_content)
    try:
        msg = EmailMultiAlternatives(title, text_content, from_email, [to_email])
        msg.attach_alternative(html_content, "text/html")
        msg.send()
        context['message'] = 'Please check your email to sign up'
        context['msg_type'] = 'info'
    except Exception as e:
        print(e)
        context['msg_type'] = 'danger'
        context['message'] = 'Oops!, Sending message has been failed because of unexpected problem.'
    return context['msg_type'], context['message']


@csrf_exempt
def forgot_password(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        user = User.objects.filter(email=email)
        if not user.exists():
            return JsonResponse({
                'result': 'oops',
                'message': "This email hasn't been registered yet."
            }, status=202)
        user_profile = get_object_or_404(UserProfile, user=user[0])
        fpc = ForgotPasswordConfirmation(email=email)
        fpc.save()
        protocol = 'https' if request.is_secure() else 'http'
        host = request.get_host()
        url = f'{protocol}://{host}/login?forgot_password=Yes&id={fpc.id}'
        # print(url)
        message_type, message_content = send_email(to_email=email, url=url, fullname=user_profile.full_name,
                                                   mode='forgot_password')
        if message_type == 'info':
            return JsonResponse({
                'result': 'okay'
            }, status=202)
        else:
            return JsonResponse({
                'result': 'oops'
            }, status=402)


@csrf_exempt
def forgot_password_redirect(request):
    if request.method == 'POST':
        try:
            new_password = request.POST['password1']
            forgot_password_confirm_id = request.POST['forgot_password_confirm_id']
            email = get_object_or_404(ForgotPasswordConfirmation, id=forgot_password_confirm_id).email
            user = get_object_or_404(User, email=email)
            user.set_password(new_password)
            user.save()
            ForgotPasswordConfirmation.objects.filter(email=email).delete()
            return JsonResponse({
                'result': 'okay'
            }, status=201)
        except Exception as e:
            print(e)
            return JsonResponse({
                'result': 'oops'
            }, status=401)


def log_in(request):
    context = {
        'message': {
            'type': 'error',
            'content': ''
        }
    }
    if request.method == 'GET':
        if request.GET.get('forgot_password') == 'Yes':
            forgot_password_confirm = get_object_or_404(ForgotPasswordConfirmation, id=request.GET.get('id'))
            context['forgot_password_confirm_id'] = forgot_password_confirm.id
            context['reset_password'] = True

    if request.method == 'POST':
        form = UserLoginForm(request.POST or None)
        if form.is_valid():
            email = form.cleaned_data['email']
            password = form.cleaned_data['password']
            save_password = False
            if 'remember-password' in request.POST:
                save_password = True
            t_user = User.objects.filter(email=email)
            if t_user.exists():
                user = authenticate(username=t_user[0].username, password=password)
                if user is not None:
                    if save_password:
                        request.session.set_expiry(15 * 60 * 24)
                    else:
                        request.session.set_expiry(15 * 60)
                    login(request, user)

                    if 'next' in request.GET:
                        return redirect(request.GET['next'])
                    return redirect('dashboard:home_page')
                else:
                    context['message']['content'] = 'The password seems to be wrong.'
            else:
                context['message']['content'] = 'This email has been registered yet.'
        else:
            errors = json.dumps(form.errors)
            errors = json.loads(errors)
            text = "\n".join([value[0] for key, value in errors.items()])
            context['message']['content'] = text
    return render(request, 'accounts/login.html', context)


def register(request):
    context = {
        'message': {
            'type': 'danger',
            'content': ''
        }
    }
    if 'email' in request.GET:
        context['email'] = request.GET['email']
    if request.method == 'POST':
        form = UserSignUpForm(request.POST or None)
        if form.is_valid():
            email = form.cleaned_data['email']
            if User.objects.filter(email=email).exists():
                context['message']['content'] = 'This is email has been already registered.'
                return render(request, 'accounts/signup.html', context)
            UserConfirmation.objects.filter(email=email).delete()
            full_name = form.cleaned_data['fullname']
            password = form.cleaned_data['password1']
            confirm = UserConfirmation(email=email, full_name=full_name, password=password)
            confirm.save()
            protocol = 'https' if request.is_secure() else 'http'
            host = request.get_host()
            url = f"{protocol}://{host}/user-signup-verification/{confirm.id}"
            message_type, message_content = send_email(to_email=email, url=url, fullname=full_name, mode='sign_up')
            context['message']['type'] = message_type
            context['message']['content'] = message_content
            # return redirect('login')
        else:
            errors = json.dumps(form.errors)
            errors = json.loads(errors)
            text = "\n".join([value[0] for key, value in errors.items()])
            context['message']['content'] = text
            return render(request, 'accounts/signup.html', context)
    return render(request, 'accounts/signup.html', context)


def user_confirmation(request, confirm_id):
    confirmation = get_object_or_404(UserConfirmation, id=confirm_id)
    full_name = confirmation.full_name
    username = full_name.replace(' ', '_') + "_" + generate_random_str()
    email = confirmation.email
    password = confirmation.password
    user = User(username=username, email=email)
    user.set_password(password)
    user.save()
    profile = UserProfile.objects.get(user=user)
    profile.full_name = full_name
    profile.save()
    UserConfirmation.objects.filter(email=email).delete()
    login(request, user)
    return redirect('dashboard:home_page')
