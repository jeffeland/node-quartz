/**
 * Created by jfl on 5/6/2014.
 */

exports.QuartzSyncrhonizer = function() {

    var clients = new Array();
    var jobs = {};

    this.connectClient = function(client)
    {
        clients.push(client);
    }

    this.disconnectClient = function(client)
    {
        for(var i = clients.length - 1; i >= 0; i--) {
            if(clients[i] === client) {
                clients.splice(i, 1);
                break;
            }
        }
    }

    this.scheduleCronJob = function(jobId, crontabSchedule, callbackName)
    {
        for(var i = clients.length - 1; i >= 0; i--) {
            clients[i].doScheduleCronJob(jobId, crontabSchedule, callbackName);
        }
    }

    this.delayJob = function(jobId, delay, callbackName)
    {
        for(var i = clients.length - 1; i >= 0; i--) {
            clients[i].doDelayJob(jobId, delay, callbackName);
        }
    }

    this.unscheduleJob = function(jobId)
    {
        for(var i = clients.length - 1; i >= 0; i--) {
            clients[i].doUnscheduleJob(jobId);
        }
    }

    this.runJob = function(jobId, callbackName)
    {
        if(!jobs[jobId])
        {
            var clientNumber = Math.floor((Math.random() * clients.length));
            clients[clientNumber].doRunJob(callbackName);
            jobs[jobId] = 1;
        }
        else
        {
            jobs[jobId] += 1;
            if(jobs[jobId] == clients.length)
            {
                delete jobs[jobId];
            }
        }
    }
}