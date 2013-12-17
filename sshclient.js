var Connection = require('ssh2');

function sshclient(hostIP, username, password) {
    var self   = this;

    self.client           = new Connection();
    self.hostIP           = hostIP;
    self.username         = username;
    self.password         = password;
    self.totalExecuteTime = 0;

};

sshclient.prototype.startConnection = function (cb) {
    var self   = this;
    var client = self.client;
   
    client.connect({
        host     : self.hostIP,
        port     : 22,
        username : self.username,
        password : self.password
    });  
    self.connectionLisener(cb);
};

sshclient.prototype.connectionLisener = function(alreadyConnectionAllClient) {
    var self   = this;
    var client = self.client;

    client.on('connect', function() {
        console.log('\tConnect to host ' + self.hostIP + '.....');
    });

    client.on('error', function(error) {
        console.log('Connection get error message :: ' + error);
    });

    client.on('ready', function() {
        alreadyConnectionAllClient && alreadyConnectionAllClient(); 
    });
};

sshclient.prototype.startExecuteShell = function(commandLine, alreadyFinishExecuteAllClient) {
    var self   = this;
    var client = self.client;

    client.exec(commandLine, function(err, stream) {
        console.log('\tStarting execute shell at ' + self.hostIP);
        self.streamListener(err, stream, alreadyFinishExecuteAllClient);        
    });
};

sshclient.prototype.streamListener = function(err, stream, callback) {
    var self = this;
    var client = self.client;

    if(err) throw err;
    
    stream.on('data', function(data, extended) {
        self.totalExecuteTime += parseFloat(data);
    });

    stream.on('close', function() {
        callback && callback(self.hostIP);
    });
};

sshclient.prototype.closeConnection = function() {
    var self = this;
    var client = self.client;

    console.log('\tClose connection of ' + self.hostIP);
    client.end();
};

sshclient.prototype.getExecuteTotalTime = function() {
    return this.totalExecuteTime;
};

sshclient.prototype.getCommandResult = function(stream) {
    console.log((extended === 'stderr' ? 'STDERR: ' : 'is happen at '+ self.hostIP+'STDOUT: ') + parseFloat(data));
}

module.exports = sshclient;
