## django-monsieur
========

monsieur is a Django app designed to track/monitor/query arbitrary
events over periods of time.

## Usage
========

Once installed (instructions below), simply import monsieur and start
logging events.

```python
# views.py
import monsieur

def handler(request):
    try:
        handle_request(request)
    except Exception as e:
        # log exception to monsieur and add os/browser attributes
        os, browser = parse_ua(request.META.get('HTTP_USER_AGENT'))
        name = e.message or 'Unknown exception in handler()'
        monsieur.incr(name, 1, 'view errors', os=os, browser=browser)
```

monsieur has a query system similar to Django's querysets.

```python

>>> import monsieur
>>> q = monsieur.Q.tag('view errors')
>>> q = q.filter(os='windows')
>>> q = q.granularity('hour')
>>> q.eval()
{'integer division or modulo by zero': [{'dt': datetime.datetime(2013, 1, 7, 20, 0, 0, 0), 'count': 1}, ...]}
```