var syscalls   = require('syscalls'),
    loop       = require('../lib/loop/loop'),
    config     = require('../config/server.js'),
    logger = l = require('../lib/utils/logger.js');

var KittenServer = {};

exports.create = function(callback) {
    var self = this;

    var fd = syscalls.socket(syscalls.AF_INET, syscalls.SOCK_STREAM, 0);
    syscalls.fcntl(fd, syscalls.F_SETFL, syscalls.O_NONBLOCK);

    self.listen = function(port, host) {
        config.PORT(port);
        config.HOST(host);
        syscalls.bind(fd, config.PORT(), config.HOST());
        syscalls.listen(fd, config.QUEUE_SIZE());

        loop.on(fd, 'read', function() {
            try {
                var connectionFd = syscalls.accept(fd);
            } catch (e) {
                logger.p(e.message);
            }
            if (connectionFd) {
                syscalls.fcntl(connectionFd, syscalls.F_SETFL, syscalls.O_NONBLOCK);
                new KittenServer.Connect(connectionFd, callback);
            }
        })
        loop.run();
    };

    self.fork = function(count, port, host) {
        config.PORT(port);
        config.HOST(host);
        if (syscalls.fork() == 0) {
            self.listen(config.PORT(), config.HOST());
        } else {
            count--;
            if (count > 0) self.fork(count, config.PORT(), config.HOST());
        }
    };

    return self;
};


KittenServer.Connect = function(fd, callback) {
    loop.on(fd, 'read', function() {
        var data = syscalls.read(fd, config.CHUNK_SIZE());
        logger.p(data);
        syscalls.close(fd);
        loop.remove(fd, 'read');
        // Handle data
    })
/*
    parser.onMessageComplete = function() {
        loop.remove(fd, 'read');
        process(parser.info);
    }
*/
    function process(request) {
        console.log(request);
        var response = callback(request);
        console.log(response);

        sendResponse("HTTP/1.1 200 OK\r\n" +
                     "Content-Type: text/plain\r\n" +
                     "Content-Length: " + response.length + "\r\n" +
                     "\r\n" +
                     response);
    }

    function sendResponse(data) {
        loop.on(fd, 'write', function() {
            syscalls.write(fd, data); // TCP_NOPUSH, TCP_CORK
            syscalls.close(fd);
            loop.remove(fd, 'write');
        })
    }
}
