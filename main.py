#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import os
import re
import models
from google.appengine.ext import db
from google.appengine.ext.webapp import template


###############################################################################################
# ADMIN
###############################################################################################

class Admin(webapp2.RequestHandler):
    def get(self):
        
        videos = models.VideoEntity().all().order("order")
        
        if videos.count() > 0:
            lastofplaylist = models.VideoEntity().all().order('-order').get().order
        else:
            lastofplaylist = 0

        template_values = {
            'videos' : videos,
            'lastofplaylist' : lastofplaylist
        }
        path = os.path.join(os.path.dirname(__file__), 'admin.html')
        self.response.out.write(template.render(path, template_values))

class Add(webapp2.RequestHandler):
    """Saves video entries on datastore """
    def post(self):
        
        # Get post data
        videourl = self.request.get('p_videourl')
        order = int(self.request.get('p_order'))
        
        #Instantiate Model
        videoModel = models.VideoEntity()
        videos = models.VideoEntity().all().order("order")
        
        if videos.count() > 0:
            # Caclulate what's the last of the playlist
            lastofplaylist = models.VideoEntity().all().order('-order').get().order
            
            # Add to end of the playlist if user doesn't change number
            if order == lastofplaylist:
                order = lastofplaylist + 1
            
        else:
            # No videos have been stored
            lastofplaylist = 0

        # Update Datastore  
        videoModel.url = videourl
        videoModel.order = order
        
        key = videoModel.put()
        self.response.out.write('Video Stored')

class Remove(webapp2.RequestHandler):
    """ Removes video entries on datastore """
    def post(self):
        videoid = self.request.get('p_id')
        video = models.VideoEntity.get_by_id(int(videoid))
        video.delete()
        self.response.out.write('Video Deleted')

class Reorder(webapp2.RequestHandler):
    """ Changes order of video on datastore """
    def post(self):
        videoid = self.request.get('p_id')
        videoorder = self.request.get('p_order')
        video = models.VideoEntity.get_by_id(int(videoid))
        video.order = int(videoorder)
        video.put()
        self.response.out.write('Video Reordered')

                
###############################################################################################
# ADMIN
###############################################################################################
        
class MainHandler(webapp2.RequestHandler):
    def get(self):
        
        videos = models.VideoEntity().all().order("order")
        template_values = {
            'videos' : videos
        }
        
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, template_values))
        

app = webapp2.WSGIApplication([('/', MainHandler),
                               ('/admin', Admin),
                               ('/a/add', Add),
                               ('/a/remove', Remove),
                               ('/a/reorder', Reorder)],
                              debug=True)