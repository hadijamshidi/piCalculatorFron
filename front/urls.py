from django.urls import path
from django.views.generic import TemplateView
from front import views

urlpatterns = [
    path('', TemplateView.as_view(template_name="landing.html")),
    path('api/posts', views.get_posts),
    path('api/programs', views.get_programs),
    path('api/solve', views.get_solution),
    path('api/info', views.get_info),
    path('api/installed', views.new_install),
    path('api/signup', views.signup),
    path('api/signin', views.sign_in),
    path('api/clearcache', views.clear_cache),
    path('loaderio-2908c3aab2442c3277a13ddaf0c680bd/', views.loader),
]
