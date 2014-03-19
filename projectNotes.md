# Project Notes

## Yeoman setup
* Use angular-require (with the fix on the github issue)
* Use angular html5mode
    * Do XXX to get it working again (I forget)
* Install http-rewrite-middleware
    * with rewrite rule to route everything to index.html
* Questionable
    * Dir structure - instead of controllers dir, all controllers in one file
    * Instead of hardcoding app name for services, directives, etc (hnApp.module(...) do generically (module('servicesProvider')) and then include dependency in main application
* Try jasmine 2.0 (1.3 is current verion)


## Features
* P3 LiveUpdate - see notes in git. Good feature, but nvd3 is buggy, so skip for now.  (If I do do it, have the new data show up with a highlight rect and text eg: Rank: -1, Comments: +2, Points: +4
