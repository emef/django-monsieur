from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('example.views',
    url(r'^$', 'home', name='home'),
    url(r'^data/?$', 'data'),
)
