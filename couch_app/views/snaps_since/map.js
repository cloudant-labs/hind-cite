function (doc) {
    var numPosts = 0;
    if (doc.history) {
        for (i = 0; i < doc.history.length; i++) {
            rec = doc.history[i];
            if (rec.timestamp_str) {
                numPosts++;
            }
        }
    }
    emit(doc._id, numPosts);
}