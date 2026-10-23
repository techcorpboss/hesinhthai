/**
 * Forwarder entrypoint so both `pm2 start server.js` and `pm2 start server/server.js` work seamlessly.
 */
require("../server.js");
