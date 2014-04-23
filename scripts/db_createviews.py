#!/usr/bin/env python

import json, subprocess as sp, os, sys
from pprint import pprint, pformat

# Set globals
COUCH_SERVER='cs.cloudant.com'
COUCH_DB='news'

#
# Note - this requires environment variables
# eg: .bshrc contains export HN_UN='XXXX'
#
if ('HN_UN' not in os.environ or 'HN_PW' not in os.environ):
    print '*'*80+'\n'+'You must set HN_UN & HN_PW as environment variables (in .bashrc)\n'+'*'*80
    raise

COUCH_UN=os.environ['HN_UN']
COUCH_PW=os.environ['HN_PW']

COUCH_FULLPATH='https://{0}:{1}@{2}/{3}'.format(COUCH_UN, COUCH_PW, COUCH_SERVER, COUCH_DB)


"""
This uses couchapp to manage views http://couchapp.org
http://couchapp.org/page/couchapp-us
In essence:
    couchapp clone https://UN:PW@cs.cloudant.com/news
    # Creates a directory structure with all the view data
    # Simply manipulate that data (and save in source control) then do the following to update
    couchapp push https://UN:PW@cs.cloudant.com/news
"""

def setView():
    cmd=['couchapp', 'push', COUCH_FULLPATH]
    wd= os.path.join(os.path.dirname(os.path.realpath(__file__)), 'couch_design')

    print ('Going to do: {0} in cwd: {1}'.format(' '.join(cmd), wd))
    sp.check_call(cmd, cwd=wd)

def main():
    setView()

if __name__=='__main__':
    main()