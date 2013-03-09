== Node Login Registration App ==

Login registration application build with node.js, express 3, mongoose and twitter bootstrap.

Installation

1. Set environment variable

    $ export NODE_ENV=development

2. Run mongodb database

If mongodb located on remote server, you should change parameters in server.js file.

    app.set('MONGODB_HOST', 'yourdomain.com');
    app.set('MONGODB_PORT', 'remote_mongodb_port');
    app.set('MONGODB_USERNAME', 'your_username');
    app.set('MONGODB_PASSWORD', 'your_password');

3. Run node server

    $ node server.js


