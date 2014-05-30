/**
 * Created by jfl on 5/6/2014.
 */
var scheduler = require("./schedule");

exports.Quartz = function()
{
    // private
    var self = this;
    var jobs = {};

    var createGuid = function(){
        function _p8(s) {
            var p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }



    // public
    this.init = function(listener, synchronizer)
    {
        self.listener = listener;
        self.synchronizer = synchronizer;
        if(synchronizer)
            synchronizer.connectClient(self);
    }

    this.finalize = function()
    {
        if(self.synchronizer)
            self.synchronizer.disconnectClient(self);
        for(var jobId in jobs)
        {
            self.doUnscheduleJob(jobId);
        }
    }

    this.scheduleCronJob = function(crontabSchedule, callbackName)
    {
        var jobId = createGuid();
        if(self.synchronizer)
        {
            self.synchronizer.scheduleCronJob(jobId, crontabSchedule, callbackName);
        }
        else
        {
            self.doScheduleCronJob(jobId, crontabSchedule, callbackName);
        }
        return jobId;
    }

    this.doScheduleCronJob = function(jobId, crontabSchedule, callbackName)
    {
        if(crontabSchedule)
        {
            jobs[jobId] = scheduler.scheduleJob(crontabSchedule, function jobFunction(){
                runJob(jobId, callbackName);
            });
        }
    }

    this.delayJob = function(delay, callbackName)
    {
        var jobId = createGuid();
        if(self.synchronizer)
        {
            self.synchronizer.delayJob(jobId, delay, callbackName);
        }
        else
        {
            self.doDelayJob(jobId, delay, callbackName);
        }
        return jobId;
    }

    this.doDelayJob = function(jobId, delay, callbackName)
    {
        if(delay)
        {
            var now = new Date();
            var delayDate = new Date(now.getTime() + delay * 1000);
            jobs[jobId] = scheduler.scheduleJob(delayDate, function jobFunction(){
                runJob(jobId, callbackName);
            });
        }
    }

    this.unscheduleJob = function(jobId)
    {
        if (self.synchronizer) {
            self.synchronizer.unscheduleJob(jobId);
        }
        else {
            self.doUnscheduleJob(jobId);
        }
    }

    this.doUnscheduleJob = function(jobId)
    {
        var job = jobs[jobId];
        job.cancel();
    }

    var runJob = function(jobId, callbackName){
        if(self.synchronizer)
        {
            self.synchronizer.runJob(jobId, callbackName);
        }
        else
        {
            self.doRunJob(callbackName);
        }
    }

    this.doRunJob = function(callbackName)
    {
        var callback = self.listener[callbackName];
        if (typeof callback === "function") callback();
    }
}