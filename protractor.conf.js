exports.config = {
     seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.41.0.jar',  // start the selenium server first with ./node_modules/.bin/webdriver-manager start
    //seleniumAddress: 'http://localhost:4444/wd/hub',
    chromeDriver: 'node_modules/chromedriver/bin/chromedriver',
    baseUrl:'http://localhost:9000',
    capabilities: {
        'browserName': 'chrome'
    },

    specs: [
        'test/e2e/multiPost.js'
        //'test/e2e/**/*.js'
    ],
    exclude: [
        'test/e2e/suppport/*'
    ],


    jasmineNodeOpts: {
        showColors: true,
        isVerbose: true,
        defaultTimeoutInterval: 30000
    }
};
console.log('****************************');
console.log('****************************');
console.log('Only testing current WIP spec');
console.log('****************************');
console.log('****************************');
