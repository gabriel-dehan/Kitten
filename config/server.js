var HOST, PORT;

exports.HOST = function(host) {
    var DEFAULT_HOST = '0.0.0.0';

    HOST = host || DEFAULT_HOST;
    return HOST;
};

exports.PORT = function(port) {
    var DEFAULT_PORT = 9000;

    PORT = port || DEFAULT_PORT;
    return PORT;
};

exports.QUEUE_SIZE = function(queue_size) {
    var DEFAULT_QUEUE_SIZE = 100;

    QUEUE_SIZE = queue_size || DEFAULT_QUEUE_SIZE;
    return QUEUE_SIZE;
};

exports.CHUNK_SIZE = function(chunk_size) {
    var DEFAULT_CHUNK_SIZE = 1024;

    CHUNK_SIZE = chunk_size || DEFAULT_CHUNK_SIZE;
    return CHUNK_SIZE;
};
