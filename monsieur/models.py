from django.db import models

class DataPoint(models.Model):
    name = models.CharField(max_length=100)
    count = models.FloatField()
    dt = models.DateTimeField(db_index=True)
    attributes = models.ManyToManyField('DataAttribute', related_name='points')

    def __unicode__(self):
        return '%s=%s' % (self.name, self.count)

class DataAttribute(models.Model):
    key = models.CharField(max_length=200, primary_key=True)

    @classmethod
    def make(cls, key, value):
        return '%s=%s' % (key, value)

    def __unicode__(self):
        return self.key
