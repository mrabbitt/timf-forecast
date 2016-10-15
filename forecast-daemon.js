'use strict';  /*jslint node: true */
var https = require('https'),
    path = require('path'),
    fs = require('fs'),
    ghpages = require('gh-pages'),
    CronJob = require('cron').CronJob,
    log4js = require('log4js');
var git = require(path.join(__dirname, '/node_modules/gh-pages/lib/git.js'));

var logger = log4js.getLogger();

if (process.env.DARK_SKY_SECRET_KEY === undefined) {
    throw new Error('Environment variable missing: DARK_SKY_SECRET_KEY');
}

var fetchForecast = function(destFilePath, successCallback) {
    var requestOptions = {
        method: 'GET',
        hostname: 'api.darksky.net',
        port: 443,
        path: '/forecast/' + process.env.DARK_SKY_SECRET_KEY +  '/37.821266,-122.363837',
    };
    var req = https.request(requestOptions, function (response) {
        logger.info('entered handler for forecast data');

        if (response.statusCode != 200) {
            logger.error('Invalid response code=' + response.statusCode + ' response=' + response);
            return;
        }

        // Verify request headers echo'd back in response body.
        var respData = '';
        response.on('data', function(chunk) {
            respData += chunk;
        });
        response.on('end', function() {
            logger.info('got response body');
            fs.writeFileSync(destFilePath, respData);
            logger.info('Contents written to: %s', destFilePath);
            successCallback();
        });
    });

    req.on('error', function(e) {
        logger.error('problem with request: %s', e.message);
    });

    req.end();
};

var publishPages = function(dirPath, commitMessage) {
    ghpages.publish(dirPath, {
        message: commitMessage,
        logger: function(message) {
            logger.info(message);
         }
    }, function(error) {
        logger.info(error);
    });
};

logger.info('Scheduling forecast fetch job to run every 15 minutes.');
var job = new CronJob('00 0,15,30,45 * * * *', function() {
    logger.info('*** forecast cronjob started.');
    git(['pull', '--verbose'], __dirname).then(function(exitCode) {
        logger.info('Completed git pull: [%s]', exitCode);

        fetchForecast(path.join(__dirname, 'public/data/forecast.json'), function() {
            var commitMessage = 'Updated forecast data from Dark Sky at ' + new Date();
            publishPages(path.join(__dirname, 'public'), commitMessage);
        });

    }, function(exitCode) {
        logger.error('Git pull failed: [%s]', exitCode.toString());
    });

}, function() {
    logger.info('*** forecast cronjob stopped.');
},
    true, /* Start the job right now */
    'America/Los_Angeles' /* Time zone of this job. */
);



