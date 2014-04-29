/**
 * map:
 * Emits:[rank,last timestamp_str], doc
 */

function (doc){
    if(doc.history){
        emit([ doc.history[doc.history.length - 1].rank, doc.history[doc.history.length -1].timestamp_str], doc);
    }
}