
function serial(fn, cb) {
    var self = this;
    self.count = 0;
    next();
    
    function next() {
        if(self.count<fn.length) {
            encapsulation(fn[self.count], next);
            self.count++;
        }
        else {
            cb();
        }
    }
}

function encapsulation(fn, next) {
    setTimeout(function() {
         fn(next);   
    }, 1);
}

module.exports = serial;


