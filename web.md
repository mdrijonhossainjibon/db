# WebSocket API Documentation

## `/ws`

### WebSocket Endpoint for Real-Time Communication

#### `POST /ws`

Connect to the WebSocket server.

- **Parameters:**
  - `token` (string, required): Authentication token.

- **Response:**
  - `success` (boolean): Indicates if the connection was successful.
  - `event` (string): Event type, e.g., "connection".
  - `message` (string): Message indicating the connection status.

**Example Request:**

```json
{
  "token": "your_authentication_token"
}

```

`/ws/insert`

Handle Data Insertion through WebSocket

`POST /ws/insert`

Insert data into the database.

- **Parameters:**
  - `token` (string, required): Authentication token.

  - `type` (string, required): Message type. Allowed values: ["insert"].
  - `collection` (string, required): Name of the collection in the database.
  - `params` (object, required): Data parameters for insertion.


- **Response:**
  - `success` (boolean): Indicates if the connection was successful.
  - `event` (string): Event type, e.g., "connection".
  - `message` (string): Message indicating the connection status.


- **Example Request:**
``` {
  "token": "your_authentication_token",
  "type": "insert",
  "collection": "example_collection",
  "params": {
    "field1": "value1",
    "field2": "value2"
  }
}
```


`/ws/update`

Handle Data Updates through WebSocket

`POST /ws/update`

Update data in the database.


- **Parameters:**
  - `token` (string, required): Authentication token.

  - `type` (string, required): Message type. Allowed values: ["updated"].
  - `collection` (string, required): Name of the collection in the database.
  - `method` (string, required): Update method. Allowed values: ["findOneAndUpdate", "findByIdAndUpdate"].
  - `params` (array, required): Parameters for the update method.


- **Response:**

 - `success` (boolean): Indicates if the data update was successful.
 - `event` (string): Event type, e.g., "update".
 - `message` (string): Message indicating the success of data update.
- `results` (object): Sample results structure.

Example Request (findOneAndUpdate):

```
{
  "token": "your_authentication_token",
  "type": "update",
  "collection": "example_collection",
  "method": "findOneAndUpdate",
  "params": [{ "field1": "value1" }, { "field2": "new_value" }]
}

 ```

 Example Request (findByIdAndUpdate):

 ```
 {
  "token": "your_authentication_token",
  "type": "update",
  "collection": "example_collection",
  "method": "findByIdAndUpdate",
  "params": [ 
       "123456789012345678901234" , {
        "field1": "new_value1",
        "field2": "new_value2"
      }]
}
```
 