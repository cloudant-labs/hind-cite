// out
//   yyyy-mm-dd, 1
//   1000-00-00 and 0000-00-00 are error flags. Data is wrong.
function(doc) {
    if(doc.history) {
        doc.history.forEach(function(snap){
            var dateOnly= snap.timestamp_str && snap.timestamp_str.split(' ')[0];
            if (dateOnly) {
                emit(dateOnly, 1);
            } else {
                emit('1000-00-00',1);
            }
        });

    } else {
        emit('0000-00-00',1);
    }
}

// TODO - Clean up db so all records have doc_type='post', then add doc_type check