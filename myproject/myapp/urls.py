from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView
from django.http import HttpResponse

my_robots_txt="""
User-agent: *
Disallow: /
Allow: /$
Allow: /ko/
Allow: /en/
Allow: /favicon.ico
"""

urlpatterns = [
    path('',                  views.root_redirect,          name='root_redirect'),
    # ko/ 아래: 빈 문자열이면 곧바로 KO 뷰
    path('ko/', views.ko_index, name='ko_index'),
    # en/ 아래: 빈 문자열이면 EN 뷰
    path('en/', views.en_index, name='en_index'),
    path('contact/', views.contact, name='contact'),
    path('ko/calculate/<str:item_type>/<int:stage>/',views.calculate_view,       name='calculate'),
    path('en/calculate/<str:item_type>/<int:stage>/',views.en_calculate_view,       name='en_calculate'),
    path('api/update-tablet/',
         views.update_tablet,        name='update_tablet'),
    path('apple-touach-icon.png',  RedirectView.as_view(url=static('apple-touch-icon.png'), permanent=True)),
    path('robots.txt/', lambda x: HttpResponse(my_robots_txt,content_type="text/plain")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
