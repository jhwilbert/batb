#!/usr/bin/env python
from google.appengine.ext import db

class VideoEntity(db.Model):
	url = db.StringProperty()
	order = db.IntegerProperty()