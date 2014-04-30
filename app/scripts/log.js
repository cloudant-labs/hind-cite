/* exported log */
/* global config:false, ga:false, logit: false */

var log = (function (config) {
    'use strict';
    var site, extra = {};

    //
    // Initialize
    //

    // GA tracking code
    (function (i, s, o, g, r, a, m) {
        i['GoogleAnalyticsObject'] = r;
        i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments)
        }, i[r].l = 1 * new Date();
        a = s.createElement(o),
            m = s.getElementsByTagName(o)[0];
        a.async = 1;
        a.src = g;
        m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');


    function page(url) {
        ga('send', 'pageview', {
            page: url,
            title: url
        });

        logit('log.page:', url);
    }

    function event(category, action, label, value) {
        ga('send', 'event', category, action, label, value);
        logit('log.event:', category, action, label, value);
    }

    function error(message, url, lineeno) {
        // TODO Would be nice to add better error logging, esp. of Angular errors, but that is a whole project
        event('error : '+window.location.pathname, 'occurred', message+" : "+ url + " : " + lineeno);
        return false;
    }

    function init() {
        if (document.domain === config.GA_PROD.domain) {
            site = config.GA_PROD;
        } else if (document.domain === config.GA_STAGE.domain) {
            site = config.GA_STAGE;
        } else {
            site = config.GA_DEV;
            extra = {'cookieDomain': 'none'};
        }

        ga('create', site.code, 'hind-cite.com', extra);
        logit('ga.create:', site.code, extra);

        window.onerror=error;
    }


    init();

    return {
        page: page,
        event: event,
        error: error
    };


}(config));