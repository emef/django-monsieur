from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('example.views',
    url(r'^$', 'home', name='home'),
    url(r'^json/(?P<granularity>[^/]+)/(?P<tag>[^/]+)/?$', 'json'),
    url(r'^json/(?P<tag>[^/]+)/?$', 'json'),
)

urlpatterns += staticfiles_urlpatterns()
