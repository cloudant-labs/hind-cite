#!/usr/bin/env python

import json, subprocess as sp, os, sys
from pprint import pprint, pformat

# Set globals
COUCH_SERVER='cs.cloudant.com'
COUCH_DB='news'
with open('local_config.json','r') as f:
    localConfig=json.load(f)
    with open(localConfig['CLOUDANT_PW_FILE'], 'r') as f2:
        tmp=json.load(f2)
        COUCH_UN=tmp['COUCH_UN']
        COUCH_PW=tmp['COUCH_PW']

COUCH_FULLPATH='https://{0}:{1}@{2}/{3}'.format(COUCH_UN, COUCH_PW, COUCH_SERVER, COUCH_DB)



def setView():
    cmd=['couchapp', 'push', COUCH_FULLPATH]
    wd= os.path.join(os.path.dirname(os.path.realpath(__file__)), 'couch_design')

    print ('Going to do: {0} in cwd: {1}'.format(' '.join(cmd), wd))
    sp.check_call(cmd, cwd=wd)

def main():
    setView()

if __name__=='__main__':
    main()