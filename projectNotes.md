# Project Notes

## Todo
* P1
    * Multichart: Stats - add stats such as highest rank, total points, total comments, time on page 1, etc
    * Move to Cloudant.com hosting
        * Website
            * Apache config
        * Scraper
    * CSS - integrate with cloudant css
    * Formatting / controls - make it look much better!
    * Tests - fix broken unit tests
    * E2E - add end to end testing
    * Content - add content for cloudant, api, etc.
    * Blog post - write
    * Console.log - use wrapper so no errros if no console.

* P2
    * MC: unfound id - give visual info telling 'id not found'

* P3
    * NVD3 - submit pull request


* ?
    * Data - what to do about posts where I don't have an id? (certain jobs) - get from algolia?

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
