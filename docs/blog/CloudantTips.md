# Developing with Cloudant - Tips & Best-Practices
I've built a couple of websites with Cloudant as a back end, the latest actually sponsored by Cloudant [HiNsight]
(http://hnstage.k2company.com). I'm no expert, but I've learned a bunch and also have had some guidance from the Cloudant team to help me make the right decisions.  Here are a few things I've learned that might help.

## Documentation
The main overview is here: https://cloudant.com/for-developers/

But after you've done the tutorial, my main go-to reference is the API documentation: https://docs.cloudant.com/api/index.html

## IRC
Often in coding you need a little tip or best-practice from an expert. The Cloudant team is quite happy to help.
Just find them on [IRC #cloudant](http://webchat.freenode.net/?channels=cloudant&uio=MTE9MTk117)

## Couchapp
You really want your design docs in your source control.  And it's nice to be able to use your editor of choice for
editing your views, etc.  Couchapp allows you to create a directory structure in your source tree and then upload it
to your Cloudant database as a design document.

* Install couchapp - [Couchapp Repo](https://github.com/couchapp/couchapp)
* Read the documentation - Unfortunately the documentation isn't very good and currently isn't even up! (Hopefully it
 will get fixed.)  But here's a link: [Couchapp documentation](http://www.couchapp.org/page/getting-started)
* Then set up your directory structure, build your design documents, and write a little script for easy uploading
* Rather than detail ever step, check out my code here: [HiNsight Design Docs & Scripts](https://github
.com/rr326/HiNsight/tree/master/scripts)
* Stuck? Reach out to Cloudant on [IRC](http://webchat.freenode.net/?channels=cloudant&uio=MTE9MTk117)!

## $.ajax()
Now you've got your sweet Cloudant db all set up.  How do you use it on a website? The guys as Cloudant suggested
just going the simple route - with a $.ajax() call. (That's jquery, btw.)

Probably the easiest way to see how to do this is to open [HiNsight](http://hnstage.k2company.com/multiPost) and open
 the developer console. Then every db query will print out the $.ajax() call used and the resulting JSON data. And
 you can see the code [here](https://github.com/rr326/HiNsight/blob/master/app/scripts/getData.js).

## CORS
If you're building a website that talks directly to your Cloudant database, you may well run into Cross Origin
restrictions. The ways to deal with that are to 1) route all your requests through a server that you control; 2) use
JSONP; or 3) set your db up with CORS.

 (Per [Wikipedia](http://en.wikipedia.org/wiki/Cross-origin_resource_sharing)) Cross-origin resource sharing (CORS) is a mechanism that allows JavaScript on a web page to make XMLHttpRequests to another domain, not the domain the JavaScript originated from. Such "cross-domain" requests would otherwise be forbidden by web browsers, per the same origin security policy.

If you don't NEED a server, set up CORS and you're good to go.  [How to set up CORS on Cloudant](https://gist.github.com/chewbranca/0f690f8c2bfad37a712a)

And if you need help, ping Cloudant via [IRC](http://webchat.freenode.net/?channels=cloudant&uio=MTE9MTk117).

## Search (Lucene)
When I think Cloudant / Couchdb, I think views / map/reduce. But there are some limitations with views (such as you
can't do a view on the results of a view (currently - I hear this is about to change),
and searches give you a lot of flexibility.
* Read about searchs [here (intro)](https://cloudant.com/for-developers/search/) and [here (API)](https://docs
.cloudant.com/api/search.html)
* Here are some examples of using a view or using a search (note - open your developer console)
    * [Query with a view](http://hnstage.k2company.com/multiPost?list=top&limit=all)
    * [Query with a search](http://hnstage.k2company.com/multiPost?list=points&limit=all)

*Note* - you can paste any of the urls into your browser to see the raw result, but you need to de-escape it first. For instance:

    https://cs.cloudant.com/news/_design/by/_search/posts?q=points:[0 TO Infinity]&sort=\"-points\"&include_docs=true&limit=10

 becomes

     https://cs.cloudant.com/news/_design/by/_search/posts?q=points:[0 TO Infinity]&sort="-points"&include_docs=true&limit=10


## UN/PW / Keys and Your Source Repo
If your repository is public, you don't want to store your Cloudant API keys in your source code.  I don't know what
the best practice is, but I've tried two ways.  The easiest is to store it in an environment variable (.bashrc) and then access it where needed. The other option is to store it in a file and read the file.

### Method 1: Environment Variable

#### .bashrc

    export CLOUDANT_WRITE_KEY='theatchissintingetselylu'
    export CLOUDANT_WRITE_PW='bjUb2sdVqcrPXxnIqiRHSQoM'

#### Access in Python

    import os
    print 'Here is my write key: ', os.environ['CLOUDANT_WRITE_KEY']

#### Access in Node

    var process = require('process');
    console.log('Here is my write key: ', process.env.CLOUDANT_WRITE_KEY);




### Method 2: File
I only used this one because I had a lot of trouble getting my upstart configuration to properly use an environment variable. (Upstart is a [ubuntu](http://upstart.ubuntu.com/cookbook/) tool for starting and stopping services, like [hnscrape](https://github.com/rr326/HNScraper).)
* Put a file OUTSIDE your repo with security credentials. [For example](https://github.com/rr326/HNScraper/blob/master/scripts/hn_credentials.json)
* Then read the file to get the credentials (python code from [hnscraper](https://github.com/rr326/HNScraper/blob/master/scripts/config.py))

        # Module main
        args = parseArgs()  # Get credential file's name from command-line
        config.setCredentials(args.pwfile)

        # Module config
        def setCredentials(pw_file):
        """
        Sets the module's (global) COUCH_UN & COUCH_PW & EMAIL_PW variables
        """
        global COUCH_UN, COUCH_PW, EMAIL_PW

        with open(pw_file, 'r') as f:
            tmp = json.load(f)
            COUCH_UN = tmp['COUCH_UN']
            COUCH_PW = tmp['COUCH_PW']
            EMAIL_PW = tmp['EMAIL_PW']


## Python couch
I'm a big fan of python, and accessing Cloudant in python is a snap. Use the [couchdb module](https://pythonhosted
.org/CouchDB/).
For example:

    couch=couchdb.Server(config.COUCH_SERVER)
    couch.resource.credentials=(config.COUCH_UN, config.COUCH_PW)
    db=couch[config.COUCH_DB]
    db.info()