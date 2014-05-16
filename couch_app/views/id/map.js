function (doc) {
    if (doc.id) {
        emit(doc.id, doc);
    }
}