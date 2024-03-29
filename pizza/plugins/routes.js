/**
 * @overview Loads and/or generates routes based on the content of the project's
 *     routes or mocks directory (mocks if tds.use_mocks is true).
 */

(function(root) {

    'use strict';

    var BACKUPS,
        VERBS;

    BACKUPS = ['.bak', '.backup'];

    VERBS = ['get', 'put', 'post', 'patch', 'delete', 'trace', 'options',
        'head', 'connect'];

    /**
     * Load any routes (or mocks) in the project's routes and mocks directories.
     * @param {Object} options Configuration options shared across TDS modules.
     * @returns {Function} A function which will configure/activate the plugin.
     */
    module.exports = function(options) {
        var app,
            env,
            logger,
            TDS,
            useMocks,
            dirs,
            style,
            parsers,
            path,
            sh,
            list;

        app = options.app;
        logger = options.logger;
        TDS = app.TDS;

        //  Mocks are explicitly disabled except in development or test
        //  environments.
        env = app.get('env');
        if (env !== 'development' && env !== 'test') {
            useMocks = false;
        } else {
            useMocks = TDS.cfg('tds.use_mocks') || false;
        }

        dirs = ['routes'];
        if (useMocks) {
            dirs.unshift('mocks');
        }

        //  ---
        //  Requires
        //  ---

        path = require('path');
        sh = require('shelljs');

        //  ---
        //  Variables
        //  ---

        parsers = options.parsers;

        //  ---
        //  CORS options support
        //  ---

        //  Before loading any routes enable options for preflight checks.
        app.options('*', TDS.cors());

        //  ---
        //  Routes/Mocks
        //  ---

        dirs.forEach(function(dir) {
            var order;

            style = dir === 'mocks' ? 'mock' : 'route';

            //  Find all files in the directory, filtering out hidden files.
            list = sh.find(TDS.joinPaths(TDS.expandPath('~'), dir)).filter(
            function(file) {
                var filename,
                    base;

                filename = file.toString();

                base = path.basename(filename);

                return !base.match(/^(\.|_)/) &&
                    !base.match(/~$/) &&            //  tilde files for vi etc.
                    !base.match(/\.sw(.{1})$/) &&   //  swap files for vi etc.
                    !sh.test('-d', filename);
            });

            //  Adjust list by cross-referencing against any specific load order
            //  data in the tds.route.order config variable. We load that slice
            //  first, then any "leftovers" in sort order.
            order = TDS.getcfg('tds.route.order', []);
            order = order.map(function(item) {
                return TDS.joinPaths(TDS.expandPath('~'), dir, item);
            });
            list = list.filter(function(item) {
                return order.indexOf(item) === -1;
            });

            //  With the remaining list we need to sort such that all public
            //  routes are loaded prior to any private routes. If we don't do
            //  this we hit https://github.com/expressjs/express/issues/2760
            //  which means random public routes may end up private.
            list.sort().sort(function(a, b) {
                var parts,
                    aPub,
                    bPub;

                parts = a.split('_');
                aPub = parts[parts.length - 1] === 'public.js';
                parts = b.split('_');
                bPub = parts[parts.length - 1] === 'public.js';

                if (aPub) {
                    if (bPub) {
                        //  a public, b public...
                        return 0;
                    } else {
                        //  a public, b private...
                        return -1;
                    }
                } else {
                    if (bPub) {
                        //  a private, b public...
                        return 1;
                    } else {
                        // a private, b private...
                        return 0;
                    }
                }
            });
            list = order.concat(list);

            //  Process each file to produce a route if possible. File names and
            //  extentions drive how we process each file found.
            list.forEach(function(file) {
                var base,
                    ext,
                    route,
                    meta,
                    middleware,
                    parts,
                    part,
                    pub,
                    router,
                    verb,
                    tail,
                    name,
                    i,
                    len;

                base = path.basename(file);
                ext = path.extname(base);

                name = base.replace(ext, '');
                parts = name.split('_');

                if (parts.length > 1) {

                    //  Route file names should be of the form:
                    //  {name}[_router|_verb][_public].js
                    //  The 'name' can itself use underscore as a placeholder
                    //  for a '/' in the final registered path for the route.

                    tail = 0;
                    len = parts.length;
                    for (i = 0; i < len; i++) {
                        part = parts[i];
                        part = part.toLowerCase();

                        if (part === 'router') {
                            tail = tail || i;
                            if (verb) {
                                //  router files don't need verb; warn.
                                logger.warn('Router route file has verb: ' +
                                    file);
                            }
                            router = true;
                        } else if (VERBS.indexOf(part) !== -1) {
                            tail = tail || i;
                            if (router) {
                                //  router files don't need verb; warn.
                                logger.warn('Router route file has verb: ' +
                                    file);
                            }
                            verb = part;
                        } else if (part === 'public') {
                            tail = tail || i;
                            if (i !== len - 1) {
                                //  public should be last; warn.
                                logger.warn('Route `public` should be last: ' +
                                    file);
                            }
                            pub = true;
                        }
                    }

                    if (tail) {
                        parts = parts.slice(0, tail);
                    }
                    name = parts.join('/');
                }

                meta = {
                    type: style,
                    name: name
                };

                name = '/' + name;
                verb = verb || 'get';   //  Default to an idempotent verb.

                //  JavaScript source files should simply be loaded and run. We
                //  expect them to follow a module form that returns a function
                //  taking 'options' which allow the route to configure itself.
                if (ext === '.js') {

                    try {
                        route = require(file);
                    } catch (e) {
                        logger.error('Error loading ' + style + ': ' + name,
                            meta);
                        logger.error(e.message, meta);
                        TDS.ifDebug() ? logger.debug(e.stack, meta) : 0;
                        return;
                    }

                    if (typeof route === 'function') {

                        //  TODO:   configure an options.logger object that can
                        //  process logging requests with route-specific meta.
                        options.logger = logger.getContextualLogger(meta);

                        try {
                            middleware = route(options);
                        } catch (e) {
                            logger.error(e.message, meta);
                            TDS.ifDebug() ? logger.debug(e.stack, meta) : 0;
                            logger.warn('Disabling invalid route handler in: ' +
                                base, meta);
                        }

                        //  A bit of a hack..but router 'instances' aren't
                        //  really instances of something we can test well.
                        if (middleware &&
                                typeof middleware.propfind === 'function') {
                            //  Routers use this approach to registration where
                            //  no verb is provided since that's done route by
                            //  route.
                            if (pub) {
                                app.use(name, parsers.json, parsers.urlencoded,
                                    middleware);
                            } else {
                                app.use(name, parsers.json, parsers.urlencoded,
                                    options.loggedInOrLocalDev, middleware);
                            }
                        } else if (typeof middleware === 'function') {
                            //  Normal (non-router) routes need a verb.
                            if (pub) {
                                app[verb](name, parsers.json, parsers.urlencoded,
                                    middleware);
                            } else {
                                app[verb](name, parsers.json, parsers.urlencoded,
                                    options.loggedInOrLocalDev, middleware);
                            }
                        }
                    } else {
                        //  Not a function. Incorrect route construction.
                        logger.error('Route ' + name +
                            ' should export a function instance.', meta);
                    }
                } else if (BACKUPS.indexOf(ext) === -1) {
                    //  Files that aren't source files are treated as data
                    //  files. We generate a simple route for these based on
                    //  their name. A suffix of _get, _post, etc. defines the
                    //  verb or other method called on the app object to
                    //  register the route.

                    //  JS files do their own logging re: route vs. mock but we
                    //  need to do it for them when we're loading data files.
                    if (pub) {
                        logger.system(
                            TDS.colorize('building public ' + meta.type, 'dim') + ' ' +
                            TDS.colorize(verb.toUpperCase() + ' ' +
                                name, style), meta);
                        app[verb](name, parsers.json, parsers.urlencoded,
                            function(req, res, next) {
                                res.sendFile(file);
                            });
                    } else {
                        logger.system(
                            TDS.colorize('building secure ' + meta.type, 'dim') + ' ' +
                            TDS.colorize(verb.toUpperCase() + ' ' +
                                name, style), meta);
                        app[verb](name, parsers.json, parsers.urlencoded,
                            options.loggedInOrLocalDev, function(req, res, next) {
                                res.sendFile(file);
                            });
                    }
                }
            });
        });
    };

}(this));
