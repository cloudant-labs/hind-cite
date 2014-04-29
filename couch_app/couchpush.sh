#!/bin/sh

echo
echo '****************************'
echo 'Update production couchapp'
echo '****************************'


echo 'Going to use SOURCE code (not dist) for push to couchapp'

cp -rf ../app/*  ./_attachments
couchapp push . prod
