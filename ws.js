// websocketServer.js
const WebSocket = require("ws");

class WebSocketServer {
  constructor(server, db) {
    this.wss = new WebSocket.Server({ server });
    this.wss.on("connection", this.handleConnection.bind(this));
    this.db = db
  }

  handleConnection(ws) {
    
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);

        // Check if payload type is present and valid
        if (!data || typeof data !== 'object' || !data.type || typeof data.type !== 'string') {
          throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected { type: string, ... }");
        }

        // Check user authentication
        this.isUserAuthenticated(ws, data);

        switch (data.type) {
          case "insert":
            this.handleInsert(ws, data);
            break;

          case "update":
            this.handleUpdate(ws, data);
            break;

          default:
            break;
        }
      } catch (error) {
        if (error.message.startsWith("ERR_UNAUTHORIZED")) {
          // If unauthorized, send a custom WebSocket error message
          ws.send(JSON.stringify({ error: "Unauthorized access", code: "ERR_UNAUTHORIZED" }));
        } else if(error.message.startsWith('ERR_INVALID_MESSAGE_FORMAT')){
          // If invalid message format, send the error message back to the client
          ws.send(JSON.stringify({ error: error.message, code: "ERR_INVALID_MESSAGE_FORMAT" }));
        } else {
          // For other errors, send a generic internal server error message
          ws.send(JSON.stringify({ error: "Internal server error", code: "ERR_INTERNAL_SERVER" }));
        }
      }
    });

    // It seems like you intended to broadcast a default message here
    this.broadcastMessage({ event: 'default', modal: 'MarketModel' });
}


  isUserAuthenticated(ws, data) {
    const { token } = data;
    if (!token || typeof token !== 'string' || token !== "secretToken") {
      // If not authenticated, throw an error
      throw new Error("ERR_UNAUTHORIZED: Unauthorized");
    }
  }

  handleInsert(ws, data) {
    try {
      // Check if required properties are present and have the expected types
      if (!data.collection || typeof data.collection !== 'string' || !data.params || typeof data.params !== 'object') {
        throw new Error("ERR_INVALID_INSERT_FORMAT: Invalid insert message format. Expected { collection: string, params: object }");
      }

      const result = db.create(data.collection, data.params);
      ws.send(
        JSON.stringify({
          success: true,
          event: "insert",
          message: "Data inserted successfully",
          result,
        })
      );
    } catch (error) {
      ws.send(
        JSON.stringify({
          success: false,
          event: "insert",
          error: error.message,
          code: error.message.split(":")[0], // Extracting error code from the message
        })
      );
    }
  }
 
  handleUpdate(ws, data) {
    try {
      // Check if required properties are present and have the expected types
      if (!data.collection || typeof data.collection !== 'string' || !data.method || typeof data.method !== 'string' || !data.params || !Array.isArray(data.params)) {
        throw new Error("ERR_INVALID_UPDATE_FORMAT: Invalid update message format. Expected { collection: string, method: string, params: array }");
      }

      let results = null;

      if (data.method === "findOneAndUpdate") {
        results = this.db.findOneAndUpdate(
          data.collection,
          data.params[0],
          data.params[1]
        );
      } else if (data.method === "findByIdAndUpdate") {
        results = this.db.findByIdAndUpdate(
          data.collection,
          data.params[0],
          data.params[1]
        );
      }

      this.broadcastMessage({
        success: true,
        event: "update",
        message: "Updated successfully",
        results,
      });
    } catch (error) {
      ws.send(
        JSON.stringify({
          success: false,
          event: "update",
          error: error.message,
          code: error.message.split(":")[0], // Extracting error code from the message
        })
      );
    }
  }

  broadcastMessage(payload) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(payload));
      }
    });
  }

  setDatabase(database) {
    this.database = database;
  }
}

module.exports = WebSocketServer;
