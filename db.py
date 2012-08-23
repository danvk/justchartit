import hashlib
from google.appengine.ext import db
from google.appengine.api import users


class TabularData(db.Model):
  # key is the SHA224 hex checksum of data.
  data = db.BlobProperty(required=True)


class Chart(db.Model):
  owner = db.UserProperty(required=True)
  data_sha224 = db.StringProperty(required=True)
  options = db.TextProperty(required=True)


def ComputeChecksum(data):
  sha = hashlib.sha224()
  sha.update(data)
  return sha.hexdigest()


def GetEntityForTabularData(data):
  checksum = ComputeChecksum(data)
  return TabularData.get_or_insert(checksum, data=data.encode('utf-8'))


def StoreChart(user, options, data):
  tabular_data = GetEntityForTabularData(data)

  chart = Chart(
      data_sha224=tabular_data.key().name(),
      owner=user,
      options=options
  )
  key = chart.put()
  assert key.id()
  return chart
