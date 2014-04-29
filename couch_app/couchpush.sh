#!/opt/local/bin/zsh

echo
echo '****************************'
echo 'Update production couchapp'
echo '****************************'

USE_SOURCE="False"


if [[ $USE_SOURCE = "True" ]]; then
        echo 'Going to use SOURCE code (not dist) for push to couchapp'
        SOURCE_DIR="../app/"
    else
        echo 'Going to use DIST'
        SOURCE_DIR="../dist/"
fi

echo "Rsyncing $SOURC_DIR to _attachments"
rsync -ra --stats $SOURCE_DIR  _attachments/

echo
echo "couchapp push . prod"
couchapp push . prod

echo 'Done'
