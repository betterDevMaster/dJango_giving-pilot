from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404

from dashboard.models import Media
from dashboard.permissions import is_campaign_owner
from dashboard.utils import *


def cf_public(request, campaign_id):
    campaign = get_object_or_404(Campaign, id=campaign_id)
    small_medias = Media.objects.filter(campaign=campaign).order_by('-created_at')
    context = {
        'campaign': campaign,
        'small_medias': small_medias,
        'campaigns': Utils.get_all_published_campaigns(),
        'is_public': True,
    }

    return render(request, 'dashboard/crowdfunding/public/cf_public.html', context)


@is_campaign_owner
def cf_manager(request):
    return render(request, 'dashboard/crowdfunding/manager/cf_manager.html')


@login_required
@is_campaign_owner
def cf_public_preview(request, campaign_id):
    campaign = get_object_or_404(Campaign, id=campaign_id)
    small_medias = Media.objects.filter(campaign=campaign).order_by('-created_at')
    context = {
        'campaign': campaign,
        'campaigns': Utils.get_all_published_campaigns(),
        'small_medias': small_medias,
        'is_preview': True,
    }
    return render(request, 'dashboard/crowdfunding/public/cf_public_preview.html', context)
