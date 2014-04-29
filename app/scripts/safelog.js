// Safe logging call
/* global logit:false */


// Based on http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
// Modified to print just a string (with newlines) if that's what it is

// usage: logit('inside coolFunc',this,arguments);
window.logit = function () {
    //noinspection JSHint
    logit.history = logit.history || [];   // store logs to an array for reference
    logit.history.push(arguments);
    if (window.console) { // was 'this.console) Note - in concat with strict mode, this.console fails
        if (arguments.length === 1 && typeof(arguments[0]) === 'string') {
            console.log(arguments[0]);
        } else {
            console.log(Array.prototype.slice.call(arguments));
        }
    }

};