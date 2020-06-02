import io = require('socket.io-client');
import Socket = SocketIOClient.Socket;

export default class Relay {
    private _url: string;
    private _socket: Socket;

    constructor(url: string) {
        this._url = url;
    }

    public connect(onError?: Function) {
        return new Promise<any>((resolve) => {
            this._socket = io.connect(this._url);

            if(onError) {
                this._socket.on('connect_timeout', onError);
                this._socket.on('error', onError);
                this._socket.on('reconnect_error', onError);
                this._socket.on('reconnect_failed', onError);
            }

            this._socket.on('disconnect', this.connect);
            this._socket.on('connect', resolve);
        });
    }

    public subscribe(channels: string[], payload: any, callback: Function) {
        return new Promise<any>((resolve, reject) => {
            this._socket.emit('subscribe', {channels, payload}, (data) => {
                if (data.error) {
                    reject(data.error);
                    return;
                }

                channels.forEach((channel) => {
                    this._socket.on(channel, (data) => {
                        callback(channel, data);
                    });
                });

                resolve();
            });
        });
    }

    public request(payload: any) {
        return new Promise(resolve => {
            this._socket.emit('request', payload, (data) => {
                resolve(data);
            });
        });
    }
}
