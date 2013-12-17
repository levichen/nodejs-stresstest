

var stdio = require('stdio');

var options = stdio.getopt({
    'name': {args:1}
});

console.log(options);
