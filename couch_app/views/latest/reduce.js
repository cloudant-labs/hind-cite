/**
 * Returns the latest posting per rank.  Basically gives you the current HN top page.
 * EX: https://cs.cloudant.com/news/_design/by/_view/latest?reduce=true&group=true&limit=5&group_level=1
 *
 *
 * Reduce:
 * @param keys = [[key1, id1]...]  key1=[rank, last timestamp_str]
 * @returns {key: [rank, last timestamp_str], doc: {doc}}
 */


// Key, value:  [rank, last timestamp_str], doc
function (keys, values, rereduce) {
    var i, maxidx=0;

    if (! rereduce) {
        for (i=0; i< keys.length; i++){
            if (keys[i][0][1]> keys[maxidx][0][1]) {
                maxidx=i;
            }
        }
        return {key: keys[maxidx][0], doc: values[maxidx]};
    } else {
        for (i=0; i < values.length; i++) {
            if("key" in values[i] && (values[i].key[1] > values[maxidx].key[1])){
                maxidx=i;
            }
        }
        return values[maxidx];
    }
}


