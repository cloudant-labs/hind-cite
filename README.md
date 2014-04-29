# hind-cite
_Hacker News data, charts, and statistics_

## Overview
This is the source code for the HiNsite website (currently hosted at http://hnstage.k2company.com but soon to be
hosted in a proper location).

The purpose of the site is to give meaningful data and analysis of how individual posts do on Hacker News. You can
currently retrieve point-in-time data on the number of points or comments a post received,
but you can't get timeseries data of rank, points, or comments. HiNsite provides that data,
and the beginnings of an analysis of that data.

## The Data
This site relies on data scraped from news.ycombinator.com /news and /news2 (ie: page 1 and 2)
every 5 minutes. We take a snapshot of the data and store it in a publicly accessible couch database with a REST
interface, hosted on Cloudant.  The data starts in early February 2014 and is pretty flakey and with gaps until mid
February. After that it is MOSTLY complete, though there are times where our scraper or HN was down and the data has
gaps - eg: 3/20/14.  See: http://hnstage.k2company.com/snapsPerDay

## This Site
We are hosting this site and have provided an initial start on some analysis, but we are hoping the community will
contribute and turn this from moderately interesting to utterly awesome.  Have at it.

## Check the Website for More...
The website should have all this information and much more.