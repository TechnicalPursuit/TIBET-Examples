/**
 * @overview Simple task runner template.
 */

(function(root) {

    'use strict';

    /**
     *
     * @param {Object} options Configuration options shared across TDS modules.
     * @returns {Function} A function which will configure/activate the plugin.
     */
    module.exports = function(options) {
        var app,
            logger,
            TDS,
            meta;

        //  ---
        //  Intro
        //  ---

        app = options.app;
        logger = options.logger;
        TDS = app.TDS;

        meta = {
            comp: 'TWS',
            type: 'task',
            name: 'sample'
        };
        logger = logger.getContextualLogger(meta);

        //  ---
        //  Task name
        //  ---

        module.exports.taskName = 'sample';

        //  ---
        //  Runtime
        //  ---

        /**
         * The actual task execution function which will be invoked by the task
         * runner.
         */
        return function(job, step, params) {

            logger.trace(TDS.beautify(step));

            //  ---
            //  Check task parameters
            //  ---

            //  Repeat this kind of block for all necessary parameters.
            /*
            if (!params.fluffy) {
                return TDS.Promise.reject(new Error(
                    'Misconfigured task. No params.fluffy.'));
            }
            */

            return new TDS.Promise(function(resolve, reject) {

                //  Do the real work here...
                return resolve();
            });
        };
    };

}(this));
