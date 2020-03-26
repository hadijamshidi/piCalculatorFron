from django.conf import settings
import requests


def solve(a=1, b=2, c=1):
    url = settings.PI_URL + '/calculator/solve?a={}&b={}&c={}'.format(a, b, c)
    response = requests.get(url=url)
    return response.json()
