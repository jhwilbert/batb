#!/usr/bin/env python
from google.appengine.ext import db

class ImageEntity(db.Model):
	flag = db.BooleanProperty()
	url = db.StringProperty()
	
	pluscount = db.IntegerProperty()
	datetime = db.DateTimeProperty(auto_now_add=True)