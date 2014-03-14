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