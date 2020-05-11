const io = require('socket.io-client');

class Relay {
    constructor(url) {
        this.url = url;
    }

    connect() {
        return new Promise((resolve, reject) => {
            this.socket = io.connect(this.url);
            this.socket.on('connect', resolve);
        })
    }

    subscribe(channels, payload, callback) {
        this.socket.emit('subscribe', {channels, payload}, (data) => {
            if (data.error) {
                throw new Error(data.error);
            }

            channels.forEach((channel) => {
                this.socket.on(channel, (data) => {
                    callback(channel, data);
                });
            })
        });
    }

    async request(payload) {
        return new Promise(() => {
            this.socket.emit('request', payload, (data) => {
                resolve(data);
            });
        });
    }
}

module.exports = Relay;
