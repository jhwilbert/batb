#!/usr/bin/env python
from google.appengine.ext import db

class DesktopVideoEntity(db.Model):
	url = db.StringProperty()
	order = db.IntegerProperty()
	
class MobileVideoEntity(db.Model):
	url = db.StringProperty()