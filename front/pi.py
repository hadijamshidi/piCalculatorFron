from django.conf import settings
import requests
from django.core.cache import cache


def solve(a=1, b=2, c=1):
    key = '{}_a={}&b={}&c={}'.format(settings.EQUATION_PREFIX, a, b, c)
    value = cache.get(key)
    if value:
        return value
    url = settings.PI_URL + '/calculator/solve?a={}&b={}&c={}'.format(a, b, c)
    response = requests.get(url=url)
    solutions = response.json()
    cache.set(key, solutions, settings.EQUATION_TTL)
    return solutions


def clear_cache():
    cache.clear()
