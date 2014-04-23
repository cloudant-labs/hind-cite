# Building HiNsight
[HiNsight](http://hnstage.k2company.com/) may look like a pretty simple website, but it's got a lot going on under
the covers, largely because it relies heavily on a lot of great tools. I'm a novice programmer,
but this little website has a sophisticated, scalable noSQL backend (Cloudant), a robust build system (Grunt),
a modern front-end MVC framework (Angular), and a powerful visualization library (D3).  So pretty cool for a novice!

Much of the effort, however, was setting up the infrastructure. This wasn't hard, but it *should* be easy. I'm hoping
 that sharing this will make it easier for others as well.  (Note: If you're an expert web developer,
 you'll learn little here. But if you can't whip up a website like HiNsight in a week, hopefully this will help.)

## Yeoman
[Yeoman](http://yeoman.io/) is a GREAT idea. Their website describes it well:

> Yeoman is an open source project which defines an opinionated stack for web application development. It includes a
golden bundle of tools and frameworks, provided with documentation and authority. Our aim is to help developers quickly build beautiful web apps.

What this means is you get some default structure, some scaffolding, and a lot of grunt tasks to build an application
as a pro. I think it is worth using, but there are a few gotchas.

The biggest challenge I found is that its
grunt-based build system is quite sophisticated.  When you couple this with buggy generators or a desire to do
something outside the default, it can be quite a challenge. I spent a week trying to get the angular-require
gernator to work (the bug has apparently since been fixed), but after reading a lot of grunt tasks and NPM code,
I finally gave up and switched to a straight angular generator. I also ran into slight problems getting Karma to run
properly.

The bottom line is that Yeoman is mostly great and will help you work more like a pro. But it isn't dead simple and
you'll probably spend a bunch of time getting small things to work properly.  Oh well.

> ### Takeaways:
> * Use the default angular generator
> * Use http-rewrite-middleware - With an angular app you want all the urls to redirect to index. For development,
Yeoman uses a grunt local server, but it doesn't have rewrite rules by default.  Search HiNsite's Gruntfile for
'http-rewrite-middleware'.
> * Karma - For some reason Karma wasn't included in my default yeoman install (maybe fixed?).  I manually installed:
 `npm install --save-dev karma-jasmine karma-chrome-launcher`
> * Other tidbits - these aren't as universal, but they took me time and I needed them. Maybe they'll save you some
time too.
>   * pushto/rsync (search for pushto) - Yeoman gives you a nice localhost serving method,
but I also wanted a publicly staged option. I built a rsync-based pushto task. (Note the use of grunt's process to
access local environment variables (stored outside of your repo) for UN/PW
>   * Sourcmap (search for SourceMap) - I had a bug that reguired a sourcemap to debug. Getting this setup wasn't
trivial for me.
>   * Markdown - A small one to enable live viewing of compiled markdown.

## Angular
I'm quite torn on Angular.  When I was learning web programming (a year ago), after getting my first taste of jquery
spaghetti code, I realized I needed some sort of MVC framework-type-thingy.  After reading a bunch of blogs,
I picked Angular.  It was *probably* a good call, but I'm not expert enought to know for sure.

The Good: When you have your structure set and your directives defined, you can be super productive. You can do
amazing things trivially. And you get a super-responsive website where it never goes back to the server unnecessarily. For a data visualization site, that means the only slow part is getting the data.

The Bad: The problem I've had with Angular is that it can be absolutely baffling to debug.  If you're lucky you'll
get a strange error that might help point you in the right direction. But not infrequently things simply don't work.
It's almost always been because I was doing something dumb, but figuring out what dumb thing I was doing took forever
.  There's a lot of magic going on and when the magic fails, its hard to know why.  With a huge code base and lots of
 asynchronous events going on, trying to trace the Angular code never helped.  As a non-angular expert,
 angular is maddening.

The Ugly: The documentation is often extremely frustrating.  I don't think I'm dumb as a brick,
but I can read a lot of Angular documentation and still not know what I need to. And did they recently remove a lot
of docs? Things I found 6 months ago seem to have disappeared.  If you use Angular,
be prepared to do a lot of Google searches for answers.

One side note - if you actually look at the code you'll see a whole mess where I dumbly integrated Algolia's
excellent search interface (the HN Search tool) with my code. I should have rebuilt the code as an Angular directive
 to match the rest of my application. It would have been simpler, more maintainable, and more elegant than just jury rigging it the way I did. It was a mistake.

> ### Takeaway:
> I'm 50/50 here. If you go with Angular, be prepared for some awesome results and some frustrating debugging.

## D3 & NVD3
> [d3js](http://d3js.org/) is a JavaScript library for manipulating documents based on data. D3 helps you bring data to life using HTML, SVG and CSS. D3’s emphasis on web standards gives you the full capabilities of modern browsers without tying yourself to a proprietary framework, combining powerful visualization components and a data-driven approach to DOM manipulation.

D3 gives awesome results, no doubt about it.  Chances are that if you're seeing a cool data visualization on a
website, it was built with D3.  I used it for my first project ([weather-explorer.com](http://www.weather-explorer
.com)).  The problem is it is SUPER low-level.  Want to draw a bar chart? You have to figure out the X & Y coordinates
 of each point!  With D3, hard things are doable, and easy things are hard. (Hard compared to matplotlib plt.bar()!)

For HiNsight, I wanted to see if I could code faster, maybe at the expense of some flexibility.  There are few
frameworks built on top of D3.  I first tried [Rickshaw](http:/code.shutterstock.com/rickshaw).  Rickshaw was super
cool and their code and their charts are beautiful. But in my day playing with it I realized: 1) I'd have to
customize it; 2) the rickshaw way of doing to things is pretty different from stock D3; and 3) the community is
pretty small.

So I then tried [NVD3](http://nvde3.org).  This was a good call. NVD3's community is larger than Rickshaws (though
still pretty small).  It's also got plenty of bugs and limitations. But it gives really good results with little
code, and when you need to fix NVD3 or supplement it, the code is easy to read and similar to D3. It's more of an
extension of D3 than a wrapper.  With NVD3, easy things are easy, medium things are pretty easy,
and hard things are doable.

> ### Takeaway
> Use NVD3 instead of stock D3.

## Cloudant
*Disclaimer: Cloudant hired me to build HiNsight so I'm not unbiased.*
At the heart of a data-based website is the data.  In this case, I built a scraper in Python (gevent, requests,
BeautifulSoup) that scrapes the first two pages of HackerNews every 5 minutes.  But where to store the data?

Obviously I used Cloudant, but let me tell you what I like about Cloudant (for this and two other projects I've done):

* Database as a *service* - By using a service, I don't have to worry about db installation, maintenance,
or scalability.  All those become complete non-issues for me.  Think about that - my *build process* is WAY more
difficult and time-consuming than my database. Awesome.
* Pricing - That was irrelevant here, but great for my other projects.  For small-scale usage,
Cloudant is free. I wouldn't have minded paying something, but I really didn't know what my usage would be.  With
Dynamo, for instance, you have predict your throughput needs. For my hobbyist site, I would have loved massive success
but probably
 wouldn't get it. What to I estimate? With Cloudant, that was a non-issue.
* NoSQL & REST Interface - Lot's have been said about that elsewhere, but those are pretty nice and easy.
* Website Scalability - With an Angular app and a Cloudant backend, you get fantastic scalability and responsiveness.
 Your web server simply serves some static files (which get cached). After that, all interaction is between the user
 and the db, which is designed to scale.  Nice.

When I started using Cloudant a year ago, my biggest beef was the thin documentation.  But they've improved that
dramatically.  And you can also ping them for quick answers on IRC / cloudant.

> ### Takeaway
> Use Cloudant.  Duh!

## Bootstrap
> [Bootstrap](http://getbootstrap.com) is "the most popular front-end framework for developing responsive,
mobile first projects on the web."

I won't say much about Bootstrap, but for completeness I should include it here. Bootstrap gives you a set of CSS and
 components that work well across devices. With a little custom skinning, you get a professional looking website
 without being a CSS expert.

## Conclusion
One of my personal goals in this project was to figure out how to remove the overhead in developing a website.  About
 a quarter of the project time was just in setting up infrastructure, even relying on a lot of robust tools.  Now
 with what I've learned, I think I could do that in a day or so. Which is great, because that means I can spend my
 time on my next project mostly focusing on adding value.