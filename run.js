var reader    = require('./reader.js');
var sshclient = require('./sshclient.js');
var serial    = require('./serial.js');
var stdio     = require('stdio');

var clients       = reader.getClientInfo();
var clientCounter = reader.getClientCount();

var testUrl;
var concurrencePerClient;
var nodePath             = '/root/.nvm/v0.10.22/bin/node ';
var executionFilePath    = ' /root/stressTest/curl_get.js ';
var commandLine;

var sshClientSet               = new Array();
var alreadyConnectionCounter   = 0;
var alreadyFinishExecuteClient = 0;


(function main() {
    getUserInputOptions();
    getClientTotalExecuteTime();
}());


function getUserInputOptions() {
    var options = stdio.getopt({
        'url' : {description: 'user want to test URL', args : 1 },
        'c' : {description: 'user want to test concurrence per client', args : 1 }
    }); 

    testUrl              = options.url;
    concurrencePerClient = ' ' + options.c;
    commandLine          = nodePath + executionFilePath + testUrl + concurrencePerClient;
}

function getClientTotalExecuteTime() {
    console.log('|===== Start connection all client =====|');

    for(key in clients) {
        client = clients[key];
        var newSSHConnection = new sshclient(client.hostIP, client.username, client.password);
        sshClientSet.push(newSSHConnection);
    
        sshClientSet[key].startConnection(alreadyConnectionAllClient);
    }
}

function alreadyConnectionAllClient() {
    if(isAlreadyConnectToAllClient()) {
        console.log('|===== Already connection all client =====\n');

        startExecuteCommand();
    }
}

function isAlreadyConnectToAllClient() {
    alreadyConnectionCounter++;
    return alreadyConnectionCounter == clientCounter;
}

function startExecuteCommand() {
    console.log('|===== Start execute command =====|');
    for(key in clients) {
        sshClientSet[key].startExecuteShell(commandLine, alreadyFinishExecuteAllClient);
    }
}

function alreadyFinishExecuteAllClient(hostIP) {
    if(isAlreadyFinishExecuteAllClientCommand()) {
        console.log('\tFinish execute at ' + hostIP);
        console.log('|===== Already finish exeucte all command =====|\n');
        closeAllConnection();
        showResult();
    }
    else {
        if(alreadyFinishExecuteClient == 1) console.log();
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
}

function showResult() {
    console.log('\n\n|===== The result is =====|\n');
    console.log('Total client count\t: ' + clientCounter);
    console.log('Concurrent per client\t:' + concurrencePerClient);
    console.log('Total Concurrent\t: '+ getTotalConcurrent());
    console.log('The total execute time\t: ' + getTotalExecuteTime());
    console.log('The average time is\t: ' + getAverageExecuteTime());
    console.log('\n|=========================|\n');
}

function getTotalConcurrent() {
    return clientCounter * concurrencePerClient;
}

function getAverageExecuteTime() {
    return myRound(getTotalExecuteTime() / getTotalConcurrent());
}

function getTotalExecuteTime() {
    var totalExecuteTime = 0;
    for(key in clients) {
        totalExecuteTime += sshClientSet[key].getExecuteTotalTime();
    }
    return myRound(totalExecuteTime);
}

function myRound(num, decimal) {
    if(decimal == null) {
        k = Math.pow(10, 2); 
    }
    else {
        k = Math.pow(10, dicimal); 
    }
    return Math.round(num * k) / k;
}
