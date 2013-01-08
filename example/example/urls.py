from django.conf.urls import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('example.views',
    url(r'^$', 'home', name='home'),
    url(r'^json/(?P<granularity>[^/]+)/(?P<name>[^/]+)/?$', 'json'),
    url(r'^names/(?P<tag>[^/]+)/?$', 'names'),
    url(r'^attrs/(?P<name>[^/]+)/?$', 'attrs'),
)

urlpatterns += staticfiles_urlpatterns()
