import datetime
from django.db import transaction
from django.db.models import Sum
from django.utils.timezone import now
from monsieur.models import DataPoint, DataAttribute

@transaction.commit_on_success
def incr(name, amt, *args, **kwargs):
    attrs = get_attrs(*args, **kwargs)

    data_attrs = []
    for key, val in attrs.items():
        pk = DataAttribute.make(key, val)
        attr, created = DataAttribute.objects.get_or_create(key=pk)
        data_attrs.append(attr)

    dp = DataPoint.objects.create(
        name=name,
        count=amt,
        dt=this_minute(),
    )

    dp.attributes.add(*data_attrs)
    dp.save()

@transaction.commit_on_success
class q(object):
    def __init__(self, name, *args, **kwargs):
        self.name = name
        self.qs = DataPoint.objects.filter(name=name)

        attrs = get_attrs(*args, **kwargs)
        pks = [DataAttribute.make(key, val) for key, val in attrs.items()]
        if len(pks) > 0:
            data_attrs = DataAttribute.objects.filter(pk__in=pks)
            self.qs = self.qs.filter(attributes__in=data_attrs)

    def get(self, start=None, end=None):
        if start is not None:
            self.qs = self.qs.filter(dt__gte=start)
        if end is not None:
            self.qs = self.qs.filter(dt__lte=end)

        return list(self.qs.values('dt').annotate(count=Sum('count')))


##################################################
# utils
def this_minute():
    return now().replace(
        second=0,
        microsecond=0
    )

def get_attrs(*args, **kwargs):
    attrs = {}
    if len(args) == 1:
        attrs = args[0]
        assert isinstance(attrs, dict)
    elif len(kwargs):
        attrs = dict(**kwargs)

    return attrs
