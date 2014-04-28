# Project Notes

## Todo
* P1
    * Move to Cloudant.com hosting
        * Website
            * Apache config
            * Google analytics - page views & events
        * Scraper
    * Testing
        * Unit tests - Make more complete, esp. for new getData, and for statesService
        * End to End
    * Google analytics
    * Data validation
        * Make sure the data is right
        * Especially stats
    * HTML snapshots!

* P2
    * NVD3 - submit pull request
    * MC: unfound id - give visual info telling 'id not found'
    * Data cleanup
        * Charts with 0 comments
        * Horiz lines on points charts
        * Back angles on rank charts (all three - look at list - by points all time)
    * Stats - do on cloudant? (Currently on client)
    * Bug - sometimes the table wraps and sometimes it doesn't. Weird.


* ?
    * Data - what to do about posts where I don't have an id? (certain jobs)

## Yeoman setup
* Use angular html5mode
    * Do XXX to get it working again (I forget)
* Install http-rewrite-middleware
    * with rewrite rule to route everything to index.html
* Try jasmine 2.0 (1.3 is current verion)



## Features
* P3 LiveUpdate - see notes in git. Good feature, but nvd3 is buggy, so skip for now.  (If I do do it, have the new data show up with a highlight rect and text eg: Rank: -1, Comments: +2, Points: +4
