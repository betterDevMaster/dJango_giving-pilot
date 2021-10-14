from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()


@stringfilter
def check_url(value):
    if 'youtube' in value:
        return 'youtube'
    elif 'vimeo' in value:
        return 'vimeo'


@stringfilter
def add_host(value):
    return f'http://149.28.36.228:8000/{value}'
    # return f'http://127.0.0.1:8000/{value}'


register.filter('check_url', check_url)
register.filter('add_host', add_host)
