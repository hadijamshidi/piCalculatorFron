from django.conf import settings
import requests
import json


def solve(coeffs=None):
    if not coeffs:
        coeffs = [1, 2, 1]
    url = settings.PI_URL + '/calculator/solve'
    response = requests.post(url=url, data=json.dumps({"coeffs": coeffs}))
    return response.json()
