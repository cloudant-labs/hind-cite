# Algolia Search Functionality

## Summary
This is a bit of a mess! In retrospect, I should have rebuilt algolia's HNSearch widget directly in Angular. I would have lost a bit of functionality (largely the autocompletion), but could have had 90% of the functionality in a fraction of the effort, with simpler and more maintainable code. Oh well.

## Purpose
The motivation was to use the same functionality that HN people are used to using in HNSearch. I felt that the best way to do that was to essentially use the exact same code as Algolia uses.

## Integration
In the end, I got it to work, but there is a lot of jquery-hardcoding involved. And it is VERY un-angular. It is so un-angular, that I didn't bother wrapping it in a directive. Instead it's all hardcoded in hnsearch, wired to an hnsearch controller, and that talks to the parent controller. Ugly.

## Elements
* Base code
    * Algolia.css, algoliaSearchl.js, bootstrap-tagautocomplete, bootstrap-typeahead, jquery-timeago - These are directly taken from their repository and are used by hnSearch
    * Hogan - in bower
* hnsearch.js - this is their main wrapper function. I tried to make as few modifications as possible.
    * (Search code for /RR tag to see changes)
    * $scope - I pass $scope in to the constructor function
    * HNSearch.setSelected - the code that runs when you select a button
    * $('#inputfield input').change() function - had to comment out - was causing problems
    * SearchArgs / self.search(0) - they ususally call w/o args. I added "SearchArgs" to return only 10 per page and not to change the url (which was messing things up and is unnecessary)
    * Hogan - change delimeters: {delimiters: '<% %>'}
* controllers.hnsearchCtrl
    * Pretty self-explanatory, except
        * Need to wait for initialization
        * Expects parent scope to set $scope.d=Object container
        * Will pass back to parent d.selectedId
* controllers (parent)
    * requires $scope.d = object
    * Set watch on $scope.d.selectedId
* views/templates
    * hnsearch_hit_template
        * Changed {{}} to <% %>
        * Deleted stuff I don't need
        * Note - this project uses Hogan / mustache within angular, which is clearly redudant, but I didn't want to mess with their code
    * hnsearchBox
        * Tweaked to remove stuff I don't need and fixed a few things that weren't working


## Implementing future changes
* If Algolia ever changes their stuff significantly, seriously consider rewriting in angular rather than updating the code. It would probably take 2-4 hours to get a clean directive working at 90% of their functionality.