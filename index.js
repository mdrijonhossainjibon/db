const express = require("express");
const http = require("http");
const mongoose = require('mongoose');
const NOSQL = require('./Database');
const app = express();
app.use(express.json());
const fs = require("fs");
const path = require("path");

const Database = require("./db");

const WebSocketServer = require("./ws");


const server = http.createServer(app);

const uri = 'mongodb+srv://admin:admin@myddata.pjfv1oi.mongodb.net/trading' //'mongodb://127.0.0.1:27017/trading';

mongoose.connect(uri).then(() => console.log('Connected to MongoDB'));

const dbDirectoryPath = path.join(__dirname, "Store");
 
// Check if the directory exists, create it if not
if (!fs.existsSync(dbDirectoryPath)) {
  try {
    fs.mkdirSync(dbDirectoryPath, { recursive: true });
  } catch (error) {
    console.error("Error creating directory:", error.message);
  }
}

const db = new Database();

const wsServer = new WebSocketServer(server, db);

app.post("/api", async (req, res, next) => {
  try {
    let result = null;
    let successMessage = "";
    let eventType = "insert"; // Default event type

    const { method, params, modal, limit, skip, sort, select } = req.body;

    if (!method || typeof modal !== 'string' || typeof method !== 'string') {
      throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected { type: string, ... }");
    }

    if (!NOSQL[modal]) {
      throw new Error('Error modal not found');
    }


    const query = NOSQL[modal];


    switch (method) {
      case 'find':

        const queryFind = NOSQL[modal][method](params);

        if (Array.isArray(params)) {
          throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected { _id : string } ");
        }

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
        result = await queryFind
        successMessage = "Data retrieved successfully";
        eventType = "retrieve";
        break;

      case 'create':

        result = query[method](params);

        successMessage = "Data created successfully";
        eventType = "create";
        wsServer.broadcastMessage({ success: true, event: eventType, message: successMessage, result: result });
        break;

      case 'findById':

        if (!Array.isArray(params)) {
          throw new Error("ERR_INVALID_MESSAGE_FORMAT: params should be an array.");
        }

        if (params.length === 0) {
          throw new Error("ERR_INVALID_MESSAGE_FORMAT: params array is empty.");
        }




        for (let item of params) {
          if (typeof item !== 'object' || !('_id' in item && typeof item._id === 'string')) {
            throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected [{ _id : string }]");
          }
        }


        result = await query[method](params[0]._id)
        successMessage = "Data retrieved by ID successfully";
        break;


      case 'findByIdAndDelete':

        if (!Array.isArray(params)) {
          throw new Error("ERR_INVALID_MESSAGE_FORMAT: params should be an array.");
        }

        if (params.length === 0) {
          throw new Error("ERR_INVALID_MESSAGE_FORMAT: params array is empty.");
        }

        for (let item of params) {
          if (typeof item !== 'object' || !('_id' in item && typeof item._id === 'string')) {
            throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected [{ _id : string }]");
          }
        }

        result = await query[method](params[0]._id);
        successMessage = "Data deleted by ID successfully";
        eventType = "deleteById";
        
        wsServer.broadcastMessage({ success: true, event: eventType, message: successMessage, result: result });
        break;
      case 'aggregate':
        if (!Array.isArray(params)) {
          throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected [{ $limit : number }]");
        }
        result = await query[method](params)
        break
      case 'findByIdAndUpdate':
        break;
      case 'findOne':
        let queryFindOne =  query[method](params);
        if(sort){
          queryFindOne.sort(sort)
        }
        if (skip) {
          queryFindOne.skip(skip);
        }
        if (typeof limit === 'number') {
          queryFindOne.limit(limit);
        }
        if (!limit) {
          queryFindOne.limit(500);
        }
        if (Array.isArray(select)) {
          queryFindOne.select(select);
        }
        result = await queryFindOne

        break;
      case 'findOneAndUpdate':
        eventType = "findOneAndUpdate";
        if (!Array.isArray(params)) {
          throw new Error("ERR_INVALID_MESSAGE_FORMAT: params should be an array.");
        }

        if (params.length === 0) {
          throw new Error("ERR_INVALID_MESSAGE_FORMAT: params array is empty.");
        }

        for (let item of params) {
          if (typeof item !== 'object'  ) {
            throw new Error("ERR_INVALID_MESSAGE_FORMAT: Invalid message format. Expected [{ _id : string },{ _id : string }]");
          }
        }

        if (!params[0] || !params[1]) {
          throw new Error("ERR_INVALID_PARAMETERS: Missing required parameters. Expected [{ _id : string },{ _id : string }]");
       } 
       successMessage = "Data Update successfully";
      
        result = await query[method](params[0], {...params[1] , updated_at : Date.now() },{  new: true })
        wsServer.broadcastMessage({ success: true, event: eventType, message: successMessage, result: result });
       
        break;
      case 'insertMany':


      default:
        throw new Error(`Unsupported method: ${method}`);
    }


    if(!result){
      throw new Error(`Not Found result try and fix code server error`);
    }

    res.status(200).json({ success: true, message: successMessage, result });
  } catch (error) {
    next({ error: error.message });
  }
});

// Catch-all middleware for 404 errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  let errorMessage = "Internal Server Error";
  if (err) {
    errorMessage = err;
  }
  if (err.message) {
    errorMessage = err.message;
  }
  const errorDetails = process.env.NODE_ENV === 'development' ? err.stack : undefined;

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    details: errorDetails,
  });
});

server.listen(9004, () => {
  console.log("Server is running on port 9004");
});
