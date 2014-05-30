/**
 * Created by jfl on 5/8/2014.
 */
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochacli: {
            options: {
                reporter: 'spec',
                filesRaw: ['tests/*.js'],
                timeout: 300000
            },
            all: []
        },
        mocha_istanbul : {
            coveralls: {
                src: 'tests', // the folder, not the files
                options: {
                    timeout: 300000,
                    reporter: 'spec',
                    coverage:true,
                    check: {
                        lines: 30,
                        statements: 30
                    },
                    root: './lib', // define where the cover task should consider the root of libraries that are covered by tests
                    reportFormats: ['cobertura','html']
                }
            }
        }
    });

    grunt.event.on('coverage', function(lcovFileContents, done){
        // Check below
        done();
    });

    // Default task(s).
    grunt.registerTask('test', ['mochacli']);
    grunt.registerTask('test-coverage', ['mocha_istanbul:coveralls']);
};