/**
 * @overview The route handler for the /orders endpoint.
 */

(function(root) {

    'use strict';

    module.exports = function(options) {
        var app,
            logger,
            TDS;

        //  Default references we'll need.
        app = options.app;
        logger = options.logger;
        TDS = app.TDS;

        //  Announce the loading/config of this route.
        logger.system(
            TDS.colorize('loading route ', 'dim') +
            TDS.colorize('POST /order', 'route'));

        //  ---
        //  Route(s)
        //  ---

        /*
         test from the project directory using variations (adjust port etc) of:

            curl -XPOST http://127.0.0.1:1407/order \
                --header "Content-Type: application/json" \
                --data "@./mocks/mock_neworder_post.json"

            curl -XPOST -k https://127.0.0.1:1407/order \
                --header "Content-Type: application/json" \
                --data "@./mocks/mock_pendingorder_post.json"
         */

        //  NOTE: to parse JSON or other content you need to define the specific
        //  options.parsers value(s) your route relies upon. Here it's 'json'.
        app.post('/order', options.parsers.json, function(req, res) {
            let response;

            logger.info(TDS.beautify(req.body));

            //  Simple implementation updates the order timestamp value and sets
            //  a new status based on whatever status was sent to us.
            req.body.received = Date.now();
            switch (req.body.status) {
                case 'pending':
                case 'cancelled':
                    req.body.status = 'cancelled';
                    break;
                default:
                    req.body.status = 'pending';
            }

            res.json(req.body);
        });
    };

}(this));
