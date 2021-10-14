import datetime
import os
import uuid

from django.contrib.auth.models import User
from django.db import models

from accounts.models import UserProfile


# Create your models here.

class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'

    def __str__(self):
        return f"{self.name}"


def get_upload_large_media_path(instance, filename):
    current_date = datetime.datetime.now()
    return os.path.join(
        instance.owner.username, current_date.strftime('%m%d%y'), filename
    )


def get_upload_logo_path(instance, filename):
    current_date = datetime.datetime.now()
    return os.path.join(
        instance.owner.username, current_date.strftime('%m%d%y'), 'logo', filename
    )


class Campaign(models.Model):
    # TYPES = (
    #     (1, 'Crowdfunding'),
    #     (2, 'Peer to Peer')
    # )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='campaign')
    # type = models.PositiveSmallIntegerField(choices=TYPES, default=1)

    organization_name = models.CharField(max_length=200, blank=True)
    organization_description = models.CharField(max_length=1024, blank=True)
    organization_logo = models.FileField(upload_to=get_upload_logo_path, default='default-logo.png')

    title = models.CharField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    cause = models.CharField(max_length=500, blank=True)
    large_media = models.FileField(upload_to=get_upload_large_media_path, blank=True)
    large_image = models.CharField(max_length=1000, blank=True)
    large_media_url = models.CharField(max_length=1000, blank=True)
    large_media_thumbnail = models.CharField(max_length=300, blank=True)
    large_media_cover = models.CharField(max_length=300, blank=True)
    large_media_cover_small = models.CharField(max_length=300, blank=True)
    large_is_video = models.BooleanField(default=False, blank=True)
    start_date = models.DateField(default=datetime.date.today)
    has_end_date = models.BooleanField(default=True)
    end_date = models.DateField(default=datetime.date.today)
    has_goal_amount = models.BooleanField(default=True)
    goal_amount = models.CharField(max_length=20, blank=True)

    full_name = models.CharField(blank=True, max_length=100)
    second_email = models.EmailField(blank=True)
    is_email_private = models.BooleanField(default=True)
    mobile = models.CharField(max_length=12, blank=True)
    is_mobile_private = models.BooleanField(default=True)
    your_title = models.CharField(max_length=100, blank=True)
    is_your_title_private = models.BooleanField(default=True)

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='campaign', blank=True, null=True)
    is_campaign_searchable = models.BooleanField(default=True)
    tags = models.CharField(max_length=1000, blank=True)
    is_campaign_private = models.BooleanField(default=True)

    is_published = models.BooleanField(default=False)

    raised_fund = models.DecimalField(default=0.00, max_digits=10, decimal_places=2)
    raised_percentage = models.IntegerField(default=0)

    is_closed = models.BooleanField(default=False, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'campaigns'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.owner.username}_{self.title}"

    def save(self, *args, **kwargs):
        if self.goal_amount.isnumeric():
            self.raised_percentage = int(float(self.raised_fund) / float(self.goal_amount) * 100)
        super(Campaign, self).save(*args, **kwargs)


def get_upload_media_path(instance, filename):
    current_date = datetime.datetime.now()
    return os.path.join(
        instance.campaign.owner.username, current_date.strftime('%m%d%y'), filename
    )


class Media(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='media')
    file = models.FileField(upload_to=get_upload_media_path, blank=True)
    image = models.CharField(max_length=1000, blank=True)
    media_url = models.CharField(max_length=1000, blank=True)
    thumbnail = models.CharField(max_length=300, blank=True)
    is_video = models.BooleanField(default=False, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'medias'

    def __str__(self):
        return f"{self.campaign.owner.username}_{self.file.name}"


class Manager(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campaign = models.ForeignKey(Campaign, on_delete=models.CASCADE, related_name='manager')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='manager')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'managers'

    def __str__(self):
        return f"{self.campaign.title}_{self.user.username}"
