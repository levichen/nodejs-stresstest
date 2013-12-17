var fs = require('fs');

function client(hostIP, username, password) {
    this.hostIP   = hostIP;
    this.username = username;
    this.password = password;
};

var clientIPInfoFilePath = './clientIPInfo.txt';
var clients       = new Array();
var clientCounter = 0;

module.exports = {
    getClientInfo : function() {
        var data  = fs.readFileSync(clientIPInfoFilePath).toString();
        var lines = data.split('\n');

        lines.forEach(function(line) {
            if(line != '') {
                var clientInfo = line.split(',');
                var newClient  = new client(clientInfo[0], clientInfo[1], clientInfo[2]);
                clients.push(newClient);
            }
        });
        //callback && callback(clients);
        return clients;
    },
    getClientCount : function() {
        return clients.length;
    }
}
