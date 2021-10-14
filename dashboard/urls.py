from django.urls import path
from .views import *

app_name = 'dashboard'

urlpatterns = [
    path('home-page', home_page, name='home_page'),
    path('home-page-public', home_page_public, name='home_page_public'),
]

new_campaign_urlpatterns = [
    path('crowdfunding/public/<str:campaign_id>/preview', cf_public_preview, name='cf_public_preview'),
    path('new-campaign/<str:campaign_id>/<str:create_or_update>', new_campaign, name='new_campaign'),
    path('create-new-campaign', create_new_campaign, name='create_new_campaign'),
    path('publish-new-campaign/<str:campaign_id>', publish_new_campaign, name='publish_new_campaign'),
    path('pick-plan', pick_plan, name='pick_plan'),

    # ajax
    path('new-campaign-process/<str:process>', new_campaign_process, name='new_campaign_process'),
    path('new-campaign-process-delete', new_campaign_process_delete, name='new_campaign_process_delete'),
    path('small-medias-upload', small_medias_upload, name='small_medias_upload'),
]

urlpatterns += new_campaign_urlpatterns

cf_urlpatterns = [
    path('crowdfunding/public/<str:campaign_id>', cf_public, name='cf_public'),
    path('crowdfunding/manager', cf_manager, name='cf_manager'),
]

urlpatterns += cf_urlpatterns
