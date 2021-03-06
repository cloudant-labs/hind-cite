# hind-cite
_Hacker News data, charts, and statistics_

# BUG
Currently the snaps per day shows one bar per data item. So if there is no data for 2 months, you can't tell.
Fix this!

## Overview
This is the source code for the [hind-cite website](http://www.hind-cite.com/) .

The purpose of the site is to give meaningful data and analysis of how individual posts do on Hacker News. You can currently retrieve point-in-time data on the number of points or comments a post received, but you can't get timeseries data of rank, points, or comments. hind-cite provides that data, and the beginnings of an analysis of that data.

## The Data
This site relies on data scraped from news.ycombinator.com /news and /news2 (ie: page 1 and 2) every 5 minutes. We take a snapshot of the data and store it in a publicly accessible couch database with a REST interface, hosted on Cloudant.  The data starts in early February 2014 and is pretty flakey and with gaps until mid February. After that it is MOSTLY complete, though there are times where our scraper or HN was down and the data has gaps - eg: 3/20/14.  See: http://www.hind-cite.com/snapsPerDay

## This Site
We are hosting this site and have provided an initial start on some analysis, but we are hoping the community will contribute and turn this from moderately interesting to utterly awesome.  Have at it.

## Development Installation
    mkdir hind-cite
    git clone https://github.com/rr326/hind-cite hind-cite
    cd hind-cite
    npm install
    bower install
    ./node_modules/protractor/bin/webdriver-manager update
    pip install couchapp
    grunt build   # Make sure it builds
    grunt serve   # Make sure it serves (and keep running for test)
    grunt test:all  # Make sure tests work
    # You're up and running. 

## Check the Website for More...
The website should have all this information and much more.