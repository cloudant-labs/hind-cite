# Couchapp to host hind-cite

### Steps to create this
1. Install couchapp.py
1. `couchapp generate couch_app`
1. Update .couchapprc to point to your database
    * Be sure you are setting UN & PW in your shell OUTSIDE your repo and referencing properly
1. Go through the generated boilerplate and delete all the stuff you don't need
1. Add rewrites.json
1. Copy actual website code to _attachments folder
1. Push to Cloudant: `couchapp push <folder> <dest db>`
    * Note: See Gruntfile pushto:prod task to see the details

