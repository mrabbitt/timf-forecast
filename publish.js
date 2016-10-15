var ghpages = require('gh-pages');
var path = require('path');

ghpages.publish(path.join(__dirname, 'public'), {
    logger: function(message) {
        console.log(message);
     }
}, function(error) {
    console.log(error);
});
