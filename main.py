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
from google.appengine.ext.webapp import template


###############################################################################################
# ADMIN
###############################################################################################

class Admin(webapp2.RequestHandler):
    def get(self):
        videos = models.VideoEntity().all().order("order")
        template_values = {
            'videos' : videos
        }
        print ""
        print videos
        path = os.path.join(os.path.dirname(__file__), 'admin.html')
        self.response.out.write(template.render(path, template_values))

class AddVideo(webapp2.RequestHandler):
    
    """Resource that saves video entries on datastore """
    
    def post(self):
        
        # Get post data
        videourl = self.request.get('p_videourl')
        order = self.request.get('p_order')
        
        # Update Datastore  
        videoModel = models.VideoEntity()                   
        videoModel.url = videourl
        videoModel.order = int(order)
        
        key = videoModel.put()


###############################################################################################
# ADMIN
###############################################################################################
        
class MainHandler(webapp2.RequestHandler):
    def get(self):
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.out.write(template.render(path, {}))
        

app = webapp2.WSGIApplication([('/', MainHandler),
                               ('/admin', Admin),
                               ('/a/addvideo', AddVideo)],
                              debug=True)