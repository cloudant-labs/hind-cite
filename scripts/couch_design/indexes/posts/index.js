/* global index:false */
//noinspection JSHint
function(doc) {
    function lasthistVal(rec, field){
        if (!rec.history) {
            return null;
        }
        return rec.history[rec.history.length-1][field];
    }

    function highestRank(rec) {
        if (!rec.history) {
            return null;
        }

        return rec.history.reduce(function(prevVal, curVal){
            return Math.max(prevVal, curVal);
        });
    }

    index('points', lasthistVal(doc, 'points'), {store: true});
    index('comments', lasthistVal(doc, 'comments'), {store: true});
    index('highestrank', highestRank(doc), {store: true});
    index('created', doc.created), {store: true};
    index('lastTimestamp', lasthistVal(doc, 'timestamp_str'), {store: true});
    index('id', doc.id);
    index('title', doc.title);
    index('domain', doc.domain);

}

// TODO - remove Store