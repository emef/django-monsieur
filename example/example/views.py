import monsieur
import simplejson
import datetime
from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return render(request, 'home.html')

def json(request, tag=None, granularity='minute'):
    attrs = dict(request.GET.items())
    q = monsieur.q(tag, attrs).granularity(granularity)
    return JsonResponse(q.eval())


class JsonResponse(HttpResponse):
    def __init__(self, obj, status=200):
        def default(obj):
            if isinstance(obj, datetime.datetime):
                return obj.isoformat()
            else:
                return None

        data = simplejson.dumps(obj, default=default)
        super(JsonResponse, self).__init__(data, status=status, content_type='text/json')
