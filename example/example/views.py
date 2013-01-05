import monsieur
import simplejson
import datetime
from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return render(request, 'home.html')

def data(request):
    dt_fn = lambda obj: obj.isoformat() if isinstance(obj, datetime.datetime) else None
    data = simplejson.dumps({'data': monsieur.q('key').get()}, default=dt_fn)
    return HttpResponse(data, status=200, content_type='text/json')
