var assert = require("assert");
var quartz = require("../lib/quartz.js");
var quartzSynchronizer = require("../lib/quartzSynchronizer.js");

describe('Quartz', function(){
    it('should be an object', function(){
        var quartzInstance = new quartz.Quartz();
        assert.notDeepEqual(quartzInstance, undefined);
    });

    it('should have an init method', function(){
        var quartzInstance = new quartz.Quartz();
        quartzInstance.init();
    });

    it('should have a schedule job method', function(){
        var quartzInstance = new quartz.Quartz();
        var jobId = quartzInstance.scheduleCronJob();
        assert.notEqual(jobId, undefined, "valid JobId");
        var jobId2 = quartzInstance.scheduleCronJob();
        assert.notEqual(jobId2, jobId, "which is unique");
    });

    it('should provide a way to schedule a job using cron syntax', function(done){
        var quartzInstance = new quartz.Quartz();
        var Listener = function()
        {
            var counter = 0;
            this.jobFunction = function(){
                counter++;
                if(counter == 1) done(); // call done only once.
            }
        }

        quartzInstance.init(new Listener());
        quartzInstance.scheduleCronJob("* * * * *", "jobFunction");
    });

    it('should have provide a way to unschedule a job scheduled with a cron syntax', function(done){
        var quartzInstance = new quartz.Quartz();
        var jobExecuted = false;
        var Listener = function()
        {
            this.jobFunction = function(){
                jobExecuted = true;
            }
        }

        quartzInstance.init(new Listener());
        var jobId = quartzInstance.scheduleCronJob("* * * * *", "jobFunction");
        setTimeout(function afterABitMoreThanAMinute(){
            assert.equal(jobExecuted, false);
            done();
        }, 61000);
        quartzInstance.unscheduleJob(jobId);
    });

    it('should provide a way to execute a job after a delay', function(done){
        var quartzInstance = new quartz.Quartz();
        var Listener = function()
        {
            var counter = 0;
            this.jobFunction = function(){
                counter++;
                if(counter == 1) done(); // call done only once.
            }
        }

        quartzInstance.init(new Listener());
        quartzInstance.delayJob(2, "jobFunction");
    });

    it('should have provide a way to unschedule a delayed job', function(done){
        var quartzInstance = new quartz.Quartz();
        var jobExecuted = false;
        var Listener = function()
        {
            this.jobFunction = function(){
                jobExecuted = true;
            }
        }

        quartzInstance.init(new Listener());
        var jobId = quartzInstance.delayJob(2, "jobFunction");
        setTimeout(function afterTheDelay(){
            assert.equal(jobExecuted, false);
            done();
        }, 3000);
        quartzInstance.unscheduleJob(jobId);
    });

    it('should be possible to synchronize two quartz, when one is down the other one continue to work.', function(done) {
        var quartzInstance1 = new quartz.Quartz();
        var quartzInstance2 = new quartz.Quartz();
        var synchronizer = new quartzSynchronizer.QuartzSyncrhonizer();
        var jobExecuted = false;

        var Listener = function()
        {
            this.jobFunction = function(){
                jobExecuted = true;
            }
        }

        quartzInstance1.init(new Listener(), synchronizer);
        quartzInstance2.init(new Listener(), synchronizer);

        quartzInstance1.delayJob(2, "jobFunction");
        setTimeout(function afterTheDelay(){
           assert.equal(jobExecuted, true, "the job should have been executed even if the original quartz has been finalized");
           done();
        }, 3000);
        quartzInstance1.finalize();
    });

    it('should be possible to synchronize two quartz, only one runs the delayed job', function(done) {
        var quartzInstance1 = new quartz.Quartz();
        var quartzInstance2 = new quartz.Quartz();
        var synchronizer = new quartzSynchronizer.QuartzSyncrhonizer();
        var jobExecutedCounter = 0;

        var Listener = function()
        {
            this.jobFunction = function(){
                jobExecutedCounter++;
            }
        }

        quartzInstance1.init(new Listener(), synchronizer);
        quartzInstance2.init(new Listener(), synchronizer);

        quartzInstance1.delayJob(2, "jobFunction");
        setTimeout(function afterTheDelay(){
            assert.equal(jobExecutedCounter, 1, "the job should have been executed once");
            done();
        }, 3000);
    });
});

describe('Synchronizer', function() {
    it('should allow to connect a client', function () {
        var synchronizer = new quartzSynchronizer.QuartzSyncrhonizer();
        synchronizer.connectClient(null);
    });
});