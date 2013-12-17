var reader    = require('./reader.js');
var sshclient = require('./sshclient.js');

var clients       = reader.getClientInfo();
var clientCounter = reader.getClientCount();

var sshClientSet               = new Array();
var alreadyConnectionCounter   = 0;
var alreadyFinishExecuteClient = 0;

(function main() {
 
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    getClientTotalExecuteTime();
}());

function getClientTotalExecuteTime() {
    process.stdout.write('|===== Start connection all client =====|\n');

    for(key in clients) {
        client = clients[key];
        var newSSHConnection = new sshclient(client.hostIP, client.username, client.password);
        sshClientSet.push(newSSHConnection);
    
        sshClientSet[key].startConnection(alreadyConnectionAllClient);
    }
}

function alreadyConnectionAllClient() {
    if(isAlreadyConnectToAllClient()) {
        process.stdout.write('|===== Already connection all client =====\n');

        startExecuteCommand();
    }
}

function isAlreadyConnectToAllClient() {
    alreadyConnectionCounter++;
    return alreadyConnectionCounter == clientCounter;
}

function startExecuteCommand() {
    console.log('plese input your command line : ');
    process.stdout.write('$ ');
    process.stdin.once('data', function(chunk) {
        commandLine = chunk;
        console.log('|===== Start execute command =====|');
        for(key in clients) {
            sshClientSet[key].startExecuteShell(commandLine, alreadyFinishExecuteAllClient);
        }
    });
}

function askUserContinue() {
    process.stdout.write('do you want continue execute command line[y/n]:');
    process.stdin.once('data', function(chunk) {
        answer = chunk.trim();
        if(answer == 'y' || answer == 'Y') {
            startExecuteCommand(); 
        }
        else {
            closeAllConnection();
        }
    });
}

function alreadyFinishExecuteAllClient(hostIP) {
    if(isAlreadyFinishExecuteAllClientCommand()) {
        console.log('\tFinish execute at ' + hostIP);
        console.log('|===== Already finish exeucte all command =====|');
        alreadyFinishExecuteClient = 0;
        askUserContinue(); 
    }
    else {
        if(alreadyFinishExecuteClient == 1) process.stdout.write('\n');
        console.log('\tFinish execute at ' + hostIP);
    }
}

function isAlreadyFinishExecuteAllClientCommand() {
    alreadyFinishExecuteClient++;
    return alreadyFinishExecuteClient == clientCounter;
}

function closeAllConnection() {
    console.log('|===== Start close all connection =====|');
    for(key in clients) {
        sshClientSet[key].closeConnection();
    }
    console.log('|===== Alrady close all connection =====|');
    process.exit();
}

