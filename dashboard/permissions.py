import os
from urllib.parse import urlparse

from django.conf import settings
from django.shortcuts import redirect, resolve_url

from dashboard.models import Campaign, Media

REDIRECT_FIELD_NAME = 'next'


def is_campaign_owner(func):
    def wrapper(request, *args, **kwargs):
        campaign_id = kwargs['campaign_id']
        campaign = Campaign.objects.filter(id=campaign_id)
        if campaign.exists():
            if campaign[0].owner.username == request.user.username:
                return func(request, *args, **kwargs)
            else:
                from django.contrib.auth.views import redirect_to_login
                path = request.build_absolute_uri()
                resolved_login_url = resolve_url(settings.LOGIN_URL)
                login_scheme, login_netloc = urlparse(resolved_login_url)[:2]
                current_scheme, current_netloc = urlparse(path)[:2]
                if ((not login_scheme or login_scheme == current_scheme) and (
                        not login_netloc or login_netloc == current_netloc)):
                    path = request.get_full_path()
                return redirect_to_login(path, resolved_login_url, REDIRECT_FIELD_NAME)
        else:
            return redirect('dashboard:home_page')
    return wrapper


def check_non_published_campaign(func):
    def wrapper(request, *args, **kwargs):
        if not request.user.is_anonymous:
            campaigns = Campaign.objects.filter(owner=request.user, is_published=False)
            for campaign in campaigns:
                if campaign.large_media:
                    os.remove(os.path.join(settings.MEDIA_ROOT, campaign.large_media.name))
                if campaign.large_image:
                    os.remove(os.path.join(settings.MEDIA_ROOT, campaign.large_image.replace('media/', '')))
                for small_media in Media.objects.filter(campaign=campaign):
                    if small_media.file:
                        os.remove(os.path.join(settings.MEDIA_ROOT, small_media.file.name))
            campaigns.delete()
        return func(request, *args, **kwargs)
    return wrapper
