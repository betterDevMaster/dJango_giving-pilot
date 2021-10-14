import base64
import datetime
import os
import random
import string
from io import BytesIO
import cv2
from PIL import Image
from django.conf import settings
import requests

from dashboard.models import Campaign, Category


def base64_to_image(bs64_data, username):
    img_type, img_data = bs64_data.split(';')
    img_data = BytesIO(base64.b64decode(img_data[7:]))
    img_type = img_type.split('/')[-1]
    file_name = f'{utils.generate_random_string}.{img_type}'
    date_now = datetime.date.today().strftime('%m%d%y')
    folder_dir = os.path.join(settings.MEDIA_ROOT, username, date_now)
    full_filename = os.path.join(folder_dir, file_name)
    os.makedirs(folder_dir, exist_ok=True)
    with Image.open(img_data) as img:
        img.save(full_filename)
    return os.path.join('media', username, date_now, file_name)


class Utils:
    @staticmethod
    def get_all_published_campaigns():
        return Campaign.objects.select_related('owner').filter(is_published=True)

    @property
    def generate_random_string(self, length=5):
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))
        return result_str

    @property
    def get_all_categories(self):
        return Category.objects.all()

    @staticmethod
    def get_protocol_and_host(request):
        protocol = 'https' if request.is_secure() else 'http'
        return f"{protocol}://{request.get_host()}/"

    @staticmethod
    def get_thumbnail(file_name, media_type, is_small=False):
        t_filename = ''.join(random.choices(string.ascii_uppercase + string.digits, k=20))
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'thumbnail'), exist_ok=True)
        t_data_dict = {
            'thumbnail': [260, 185,
                          os.path.join(settings.MEDIA_ROOT, 'thumbnail', t_filename + '_thumbnail.jpg')],
            'cover': [620, 300, os.path.join(settings.MEDIA_ROOT, 'thumbnail', t_filename + '_cover.jpg')],
            'cover_small': [300, 230,
                            os.path.join(settings.MEDIA_ROOT, 'thumbnail', t_filename + '_cover_small.jpg')]
        }

        def crop_image(img_pil):
            try:
                for key, (width, height, thumbnail_filename) in t_data_dict.items():
                    img_width, img_height = img_pil.size
                    ratio = min(img_width / width, img_height / height)
                    crop_width, crop_height = ratio * width, ratio * height
                    left = (img_width - crop_width) / 2
                    top = (img_height - crop_height) / 2
                    right = left + crop_width
                    bottom = top + crop_height
                    img_pil = img_pil.crop((left, top, right, bottom))
                    img_pil = img_pil.resize((width, height))
                    img_pil.convert('RGB').save(thumbnail_filename)
                    if is_small:
                        break

            except Exception as e:
                print(e)

        if media_type == 'url':
            if 'youtube' in file_name:
                url = "http://img.youtube.com/vi/%s/0.jpg" % file_name.split('/')[-1]
            elif 'vimeo' in file_name:
                url = f'http://vimeo.com/api/oembed.json?url={file_name}'
            else:
                url = file_name
            crop_image(Image.open(requests.get(url, stream=True).raw))

        elif media_type == 'video':
            video = cv2.VideoCapture(os.path.join(settings.MEDIA_ROOT, file_name))
            index = 0
            while True:
                index += 1
                # reading from frame
                ret, frame = video.read()

                if ret:
                    if index == 100:
                        img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                        im_pil = Image.fromarray(img)
                        crop_image(im_pil)
                        break
                else:
                    break
        else:
            im_pil = Image.open(file_name)
            crop_image(im_pil)
        return t_filename + '_thumbnail.jpg' if is_small else t_filename


utils = Utils()
