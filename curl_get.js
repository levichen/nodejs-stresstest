var sys  = require('sys');
var exec = require('child_process').exec;
var child;

//var url         = ' 140.133.76.44/~levis/index.php ';
var url  = ' ' + process.argv[2] + ' ';
var clientCount = parseInt(process.argv[3]);

//var timeFormat  = '"%{time_namelookup}\\t%{time_connect}\\t%{time_pretransfer}\\t%{time_starttransfer}\\t%{time_total}\\n"';
//var commandLine = 'curl -w ' + timeFormat + ' -o /dev/null -s' + url + logFile;
var timeFormat  = '"%{time_total}"';
var commandLine = 'curl -w ' + timeFormat + ' -o /dev/null -s ' + url;

for(i=0;i<clientCount;i++) {
  child = exec(commandLine, puts);
}

function puts(error, stdout, stderr) {
  sys.puts(stdout);
}

