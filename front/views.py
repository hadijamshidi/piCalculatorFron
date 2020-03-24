from django.http import JsonResponse, HttpResponse
from front import pi
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from front.models import Post, Program, Parameter
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login


def get_posts(request):
    posts = Post.get_posts()
    return JsonResponse({"posts": posts})


def get_programs(request):
    return JsonResponse(Program.get_programs())


def get_solution(request):
    a = int(request.GET.get('a', 0))
    b = int(request.GET.get('b', 0))
    c = int(request.GET.get('c', 0))
    return JsonResponse({
        "solutions": pi.solve(coeffs=[a, b, c]),
        "unlimited": request.user.is_authenticated,
        "unAuthorizedWaiting": settings.UNAUTHORIZED_USER_WAITING_SECS
    })


def get_info(request):
    return JsonResponse({
        "contact": {
            "phone": settings.PHONE,
            "email": settings.EMAIL,
            "site": settings.SITE_ADDRESS,
        },
        "social": {
            "instagram": {
                "id": settings.INSTAGRAM,
                "link": "https://instagram.com/" + settings.INSTAGRAM,
            },
            "telegram": {
                "id": settings.TELEGRAM,
                "link": "https://t.me/" + settings.TELEGRAM,
            },
            # "aparat": {
            #     "id": settings.APARAT,
            #     "link": "https://aparat.com/" + settings.APARAT,
            # }
        },
        "other": {
            "app_install_count": Parameter.get_app_install_count() + settings.APP_INSTALL_COUNT_PLUS
        }
    })


def new_install(request):
    Parameter.raise_view_count()
    return HttpResponse('OK')


@csrf_exempt
def signup(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    if User.objects.filter(username=username).exists():
        return JsonResponse({'successful': False, 'msg': 'نام کاربری تکراریه'})
    User.objects.create_user(username=username, password=password)
    user = authenticate(request, username=username, password=password)
    login(request, user=user)
    return JsonResponse({'successful': True, 'msg': 'ممنون'})


@csrf_exempt
def sign_in(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user=user)
        return JsonResponse({'successful': True, 'msg': 'ممنون'})
    return JsonResponse({'successful': False, 'msg': 'نام کاربری یا پسورد اشتباهه!'})
