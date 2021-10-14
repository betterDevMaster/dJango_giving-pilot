from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt

from accounts.models import User
from dashboard.models import Media, Category
from dashboard.permissions import is_campaign_owner
from dashboard.utils import *


@login_required
def create_new_campaign(request):
    user = User.objects.get(username=request.user.username)
    campaign = Campaign(owner=user)
    campaign.save()
    return redirect(f'/dashboard/new-campaign/{campaign.id}/create')


@login_required
@is_campaign_owner
def publish_new_campaign(request, campaign_id):
    campaign = get_object_or_404(Campaign, id=campaign_id)
    campaign.is_published = True
    campaign.save()
    return redirect('dashboard:home_page')


@login_required
def new_campaign(request, campaign_id, create_or_update):
    campaign = get_object_or_404(Campaign, id=campaign_id)
    small_medias = Media.objects.filter(campaign=campaign).order_by('-created_at')
    context = {
        'campaign_id': campaign_id,
        'campaign': campaign,
        'is_update_url': True if create_or_update == 'update' else False,
        'categories': Category.objects.all(),
        'small_medias': small_medias,
        'tags': campaign.tags.split(', ') if campaign.tags else [],
        'causes': campaign.cause.split(', ') if campaign.cause else [],
        'on_creating': True
    }
    if campaign.organization_name or campaign.title or campaign.category:
        context['is_update'] = True
    if 'tab' in request.GET:
        context['tab'] = request.GET.get('tab').strip()
    if 'tag' in request.GET:
        context['tag'] = request.GET.get('tag').strip()
    return render(request, 'dashboard/new_campaign/campaign_base.html', context)


@login_required
@csrf_exempt
def new_campaign_process(request, process):
    if request.method == 'POST':
        uuid = request.POST.get('uuid')
        campaign = Campaign.objects.get(id=uuid)
        if process == 'basic_info':
            org_name = request.POST.get('org_name')
            org_description = request.POST.get('org_description')
            if request.FILES:
                org_logo = request.FILES.popitem()[1][0]
                campaign.organization_logo = org_logo
            campaign.organization_name = org_name
            campaign.organization_description = org_description
        if process == 'about_campaign':
            camp_title = request.POST.get('camp_title')
            camp_description = request.POST.get('camp_description')
            # camp_cause = request.POST.get('camp_cause')
            camp_start_date = request.POST.get('camp_start_date')
            has_camp_end_date = request.POST.get('has_camp_end_date')
            camp_end_date = request.POST.get('camp_end_date')
            has_goal_amount = request.POST.get('has_goal_amount')
            camp_goal_amount = request.POST.get('camp_goal_amount')
            campaign.title = camp_title
            campaign.description = camp_description
            # campaign.cause = camp_cause
            is_update = True if request.POST['is_update'] == 'true' else False
            thumbnail_path = ''
            print(123123123, is_update)
            if is_update:
                if campaign.large_media:
                    try:
                        os.remove(os.path.join(settings.MEDIA_ROOT, campaign.large_media.name))
                    except:
                        pass
                if campaign.large_image:
                    try:
                        os.remove(os.path.join(settings.MEDIA_ROOT, campaign.large_image.replace('media/', '')))
                    except:
                        pass
                if campaign.large_media_thumbnail:
                    t_url = campaign.large_media_thumbnail.replace(Utils.get_protocol_and_host(request), '').replace(
                        'media/', '')
                    try:
                        os.remove(os.path.join(settings.MEDIA_ROOT, t_url))
                    except:
                        pass
                campaign.large_media = ''
                campaign.large_image = ''
                campaign.large_media_url = ''
                campaign.large_is_video = False
            if request.FILES:
                campaign.large_media = request.FILES.popitem()[1][0]
                campaign.save()
                thumbnail_path = os.path.join(Utils.get_protocol_and_host(request), 'media', 'thumbnail',
                                              Utils.get_thumbnail(campaign.large_media.name, media_type='video'))
                campaign.large_is_video = True

            elif 'canvas' in request.POST:
                campaign.large_image = base64_to_image(bs64_data=request.POST['canvas'],
                                                       username=request.POST['username'])
                thumbnail_path = os.path.join(Utils.get_protocol_and_host(request), 'media', 'thumbnail',
                                              Utils.get_thumbnail(campaign.large_image, media_type='image'))
            elif 'url' in request.POST:
                campaign.large_media_url = request.POST.get('url')
                thumbnail_path = os.path.join(Utils.get_protocol_and_host(request), 'media', 'thumbnail',
                                              Utils.get_thumbnail(campaign.large_media_url, media_type='url'))
                campaign.large_is_video = True
            if thumbnail_path != '':
                campaign.large_media_thumbnail = thumbnail_path + '_thumbnail.jpg'
                campaign.large_media_cover = thumbnail_path + '_cover.jpg'
                campaign.large_media_cover_small = thumbnail_path + '_cover_small.jpg'
            campaign.start_date = camp_start_date
            campaign.has_end_date = True if has_camp_end_date == 'true' else False
            if has_camp_end_date == 'false':
                campaign.end_date = datetime.date.today() + datetime.timedelta(days=720)
            else:
                campaign.end_date = camp_end_date
            campaign.has_goal_amount = True if has_goal_amount == 'true' else False
            campaign.goal_amount = camp_goal_amount
        if process == 'about_you':
            your_name = request.POST.get('your_name')
            your_email = request.POST.get('your_email')
            your_phone = request.POST.get('your_phone')
            your_title = request.POST.get('your_title')
            is_your_email_private = True if request.POST.get('is_your_email_private') == 'true' else False
            is_your_phone_private = True if request.POST.get('is_your_phone_private') == 'true' else False
            is_your_title_private = True if request.POST.get('is_your_title_private') == 'true' else False
            campaign.full_name = your_name
            campaign.second_email = your_email
            campaign.mobile = your_phone
            campaign.your_title = your_title
            campaign.is_your_title_private = is_your_title_private
            campaign.is_mobile_private = is_your_phone_private
            campaign.is_email_private = is_your_email_private
        if process == 'other_options':
            category_id = request.POST.get('category')
            tags = request.POST.get('tags')
            is_camp_searchable = True if request.POST.get('is_camp_searchable') == 'true' else False
            is_camp_private = True if request.POST.get('is_camp_private') == 'true' else False
            category = Category.objects.get(id=category_id)
            campaign.category = category
            campaign.is_campaign_searchable = is_camp_searchable
            campaign.tags = tags
            campaign.is_campaign_private = is_camp_private
        campaign.save()

        return JsonResponse({
            'result': 'success'
        }, status=201)


@csrf_exempt
def new_campaign_process_delete(request):
    if request.method == 'POST':
        uuid = request.POST.get('uuid')
        # Campaign.objects.filter(id=uuid).delete()
        return JsonResponse({
            'result': 'success'
        }, status=202)


@csrf_exempt
def small_medias_upload(request):
    if request.method == 'POST':
        uuid = request.POST.get('uuid')
        campaign = get_object_or_404(Campaign, id=uuid)
        keep_media_ids = [value for key, value in request.POST.items() if 'media_id_' in key]
        is_created_indices = [key.replace('is_created_', '') for key in request.POST if 'is_created_' in key]
        medias = Media.objects.filter(campaign=campaign).exclude(id__in=keep_media_ids)
        for media in medias:
            if media.file:
                os.remove(os.path.join(settings.MEDIA_ROOT, media.file.name))
            if media.image:
                os.remove(os.path.join(settings.MEDIA_ROOT, media.image.replace('media/', '')))
            if media.thumbnail:
                t_url = media.thumbnail.replace(Utils.get_protocol_and_host(request), '').replace('media/', '')
                os.remove(os.path.join(settings.MEDIA_ROOT, t_url))
        medias.delete()
        for index in is_created_indices:
            if 'canvas_' + index in request.POST:
                image = base64_to_image(request.POST['canvas_' + index], request.POST['username'])
                thumbnail_path = os.path.join(Utils.get_protocol_and_host(request), 'media', 'thumbnail',
                                              Utils.get_thumbnail(image, media_type='image', is_small=True))
                Media(campaign=campaign, image=image, thumbnail=thumbnail_path).save()

            elif 'url_' + index in request.POST:
                media_url = request.POST['url_' + index]
                thumbnail_path = os.path.join(Utils.get_protocol_and_host(request), 'media', 'thumbnail',
                                              Utils.get_thumbnail(media_url, media_type='url', is_small=True))
                Media(campaign=campaign, media_url=media_url, thumbnail=thumbnail_path, is_video=True).save()
            else:
                file = request.FILES['file_' + index]
                media = Media(campaign=campaign, file=file, is_video=True)
                media.save()
                thumbnail_path = os.path.join(Utils.get_protocol_and_host(request), 'media', 'thumbnail',
                                              Utils.get_thumbnail(media.file.name, media_type='video', is_small=True))
                media.thumbnail = thumbnail_path
                media.save()

        return JsonResponse({
            'result': 'success'
        }, status=201)
