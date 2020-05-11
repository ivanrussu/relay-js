# Relay JS client

## Quickstart

1. **Install**. `npm i relay-js`

2. **Establish a connection**. Use `Relay` class and a link from backend:

   ```javascript
   const Relay = require('relay-js');
   const relay = new Relay('http://example.com/?id=259360a3-0082-4503-94bf-9385a5df42');
   ```

2. **Subscribe to channels**. Ask backend about available channels and join them if you need to. Example:

   ```javascript
    relay.connect().then(() => {
        relay.subscribe(['notifications'], {token: 'secret'}, (channel, data) => {
            if(channel === 'notifications') {
                Notification.show(data.message);
            }         
        });
    });
   ```

3. **Make a request to the server**. With Relay you can respond to channels messages or make independent requests. Relay will transmit the server's response.

   ```javascript
   let data = await relay.request({action: "notification_read", id: 795});
   ```

