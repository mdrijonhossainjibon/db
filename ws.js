// websocketServer.js
const WebSocket = require("ws");
const NOSQL = require("./Database");

let eventType = "create"; // Default event type

class WebSocketServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.wss.on("connection", this.handleConnection.bind(this));
    this.db = NOSQL;
  }

  handleConnection(ws) {
    ws.on("message", (message) => {
      try {
        const data = JSON.parse(message);
        const { method, modal } = data;

        // Check if payload type is present and valid
        if (!data || typeof data !== 'object') {
          throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected an object.");
        }

        if (!NOSQL[modal]) {
          throw new Error(`Error: Modal "${modal}" not found in database`);
        }

        // Check user authentication
        this.isUserAuthenticated(data);

        const query = this.db[modal];

        switch (method) {
          case 'find':
            this.handleFind(ws, data, query);
            break;
          case 'findOne':
            this.handleFindOne(ws, data, query);
            break;

          case 'create':
            this.handleInsert(ws, data, query);
            break;

          case 'findOneAndUpdate':
            this.handleUpdate(ws, data, query);
            break;

          case 'findByIdAndDelete':
            this.handleDelete(ws, data, query);
            break;
          case 'aggregate':
            this.handleAggregate(ws, data, query);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
      } catch (error) {
        this.sendErrorMessage(ws, error);
      }
    });

    // It seems like you intended to broadcast a default message here
    this.broadcastMessage(ws, { event: 'default', modal: 'MarketModel' });
  }

  isUserAuthenticated(data) {
    const { token } = data;
    if (!token || typeof token !== 'string' || token !== "jibon018") {
      throw new Error("ERR_UNAUTHORIZED: Unauthorized");
    }
  }

 

  async handleInsert(ws, data, query) {
    try {
      const { method, params } = data;
  
      // Step 1: Check if params is defined and is an object
      if (!params || typeof params !== 'object') {
        throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected an object for insertion parameters.");
      }
  
      const result = await query[method](params);
      this.broadcastMessage(ws, { success: true, event: eventType, message: "Data inserted successfully", result });
    } catch (error) {
      this.sendErrorMessage(ws, error);
    }
  }
  

  async handleAggregate(ws, data, query) {
    try {
      const { method, params } = data;
  
      // Step 1: Check if params is an array
      if (!Array.isArray(params)) {
        throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected an array of aggregation pipeline stages.");
      }
  
      const result = await query[method](params);
      this.broadcastMessage(ws, { success: true, event: 'aggregate', message: "Aggregation performed successfully", result });
    } catch (error) {
      this.sendErrorMessage(ws, error);
    }
  }
  
  async handleUpdate(ws, data, query) {
    try {
      const { method, params } = data;
  
      // Step 1: Check if params is an array
      if (!Array.isArray(params)) {
        throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected an array for search and update parameters.");
      }
  
      // Step 2: Check if params array has at least two elements
      if (params.length < 2) {
        throw new Error("ERR_INVALID_MESSAGE_FORMAT: Params array should have at least two elements for search and update.");
      }
  
      const searchParam = params[0];
      const updateParam = params[1];
  
      const result = await query[method](searchParam, { ...updateParam, updated_at: Date.now() }, { new: true });
      this.broadcastMessage(ws, { success: true, event: 'updated', message: "Data updated successfully", result });
    } catch (error) {
      this.sendErrorMessage(ws, error);
    }
  }
  


  async handleFind(ws, data, query) {
    try {
      const { method, params, limit, skip, sort, select } = data;

      if (Array.isArray(params)) {
        throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected { _id : string } ");
      }

      const queryFind = query[method](params);

      if (sort) {
        queryFind.sort(sort);
      }
      if (skip) {
        queryFind.skip(skip);
      }
      if (typeof limit === 'number') {
        queryFind.limit(limit);
      }
      if (!limit) {
        queryFind.limit(500);
      }
      if (Array.isArray(select)) {
        queryFind.select(select);
      }

      const result = await queryFind;
      this.broadcastMessage(ws, { success: true, event: 'retrieve', message: "Data retrieved successfully", result });
    } catch (error) {
      this.sendErrorMessage(ws, error);
    }
  }

  broadcastMessage(ws, payload) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }


  async handleFindOne(ws, data, query) {
    try {
      const { method, params, sort } = data;
  
      // Step 1: Check if params is an array
      if (Array.isArray(params)) {
        throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected an object for findOne parameters.");
      }
  
      const queryFindOne = query[method](params);
  
      if (sort) {
        queryFindOne.sort(sort);
      }
  
      const result = await queryFindOne;
      this.broadcastMessage(ws, { success: true, event: 'retrieve', message: "Data retrieved successfully", result });
    } catch (error) {
      this.sendErrorMessage(ws, error);
    }
  }
  





  async handleDelete(ws, data, query) {
    try {
      const { method, params } = data;
      const result = await query[method](params);
      this.broadcastMessage(ws, { success: true, event: 'deleted', message: "Data deleted successfully", result });
    } catch (error) {
      this.sendErrorMessage(ws, error);
    }
  }



  broadcastMessage(ws, payload) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(payload));
    }
  }





  sendErrorMessage(ws, error) {
    let errorMessage = "Internal server error";
    let errorCode = "ERR_INTERNAL_SERVER";

    if (error.message.startsWith("ERR_UNAUTHORIZED")) {
      errorMessage = "Unauthorized access";
      errorCode = "ERR_UNAUTHORIZED";
    } else if (error.message.startsWith('ERR_INVALID_MESSAGE_FORMAT')) {
      errorMessage = error.message;
      errorCode = "ERR_INVALID_MESSAGE_FORMAT";
    }
    errorMessage = error.message;

    this.broadcastMessage(ws, { success: false, event: eventType, error: errorMessage, code: errorCode });
  }
}

module.exports = WebSocketServer;
