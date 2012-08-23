import webapp2
from google.appengine.api import users


import db


class SaveHandler(webapp2.RequestHandler):
  def post(self):
    config = self.request.get('config')
    data = self.request.get('data')
    
    chart = db.StoreChart(users.get_current_user(),
                          config,
                          data)

    self.response.out.write('id = %s<br/>chart.data_sha224 = %s<br/>config = %s\n' % (
        chart.key().id(), chart.data_sha224, chart.options))


class FooHandler(webapp2.RequestHandler):
  def get(self):
    user = users.get_current_user()
    self.response.out.write('You are: %s\n' % user)


app = webapp2.WSGIApplication([
    ('/save', SaveHandler),
    ('/foo', FooHandler)
], debug=True)
