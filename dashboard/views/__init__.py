from .crowdfunding import *
from .new_campaign import *


@login_required
def home_page(request):
    campaigns = Campaign.objects.select_related('owner').filter(is_published=True)
    my_campaigns = [c for c in campaigns if c.owner == request.user]
    categories = utils.get_all_categories
    context = {
        'campaigns': Utils.get_all_published_campaigns(),
        'my_campaigns': my_campaigns,
        'categories': categories,
        'host': utils.get_protocol_and_host(request)
    }
    return render(request, 'dashboard/homepage/homepage_auth.html', context)


def home_page_public(request):
    campaigns = Campaign.objects.filter(is_published=True)
    categories = utils.get_all_categories
    context = {
        'campaigns': campaigns,
        'categories': categories,
        'host': utils.get_protocol_and_host(request)
    }
    return render(request, 'dashboard/homepage/homepage_public.html', context)


def pick_plan(request):
    return render(request, 'dashboard/new_campaign/pick_a_plan.html')
