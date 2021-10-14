from django.contrib import admin
from dashboard.models import Campaign, Media, Category

# Register your models here.

admin.site.register(Category)


@admin.register(Campaign)
class CampaignAdmin(admin.ModelAdmin):
    list_display = ['id', 'organization_name', 'organization_logo']


@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = ['id', 'campaign', 'file']
