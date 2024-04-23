# Express API with WebSocket Integration

## Version: 1.0.0

Documentation for the Express.js API with WebSocket Integration

### Servers

- **Local development server**
  - Base URL: [http://localhost:5000](http://localhost:5000)

### Paths

#### 1. Create a new record in the database

- **Path**: `/api/create`
- **Method**: `GET`
- **Summary**: Create a new record in the database
- **Responses**:
  - `200`: Data inserted successfully
  - `500`: Internal Server Error

#### 2. Retrieve data from the specified collection

- **Path**: `/api/{collection}/find`
- **Method**: `GET`
- **Summary**: Retrieve data from the specified collection
- **Parameters**:
  - `{collection}` (Path parameter, required, string): Collection name
- **Responses**:
  - `200`: Data retrieved successfully
  - `500`: Internal Server Error

#### 3. Retrieve a single record from the specified collection

- **Path**: `/api/{collection}/finone`
- **Method**: `GET`
- **Summary**: Retrieve a single record from the specified collection
- **Parameters**:
  - `{collection}` (Path parameter, required, string): Collection name
- **Responses**:
  - `200`: Data retrieved successfully
  - `500`: Internal Server Error

#### 4. Retrieve data from the specified collection by ID

- **Path**: `/api/{collection}/findById/{_id}`
- **Method**: `GET`
- **Summary**: Retrieve data from the specified collection by ID
- **Parameters**:
  - `{collection}` (Path parameter, required, string): Collection name
  - `{_id}` (Path parameter, required, string): Record ID
- **Responses**:
  - `200`: Data retrieved successfully
  - `500`: Internal Server Error

#### 5. Update a single record in the specified collection

- **Path**: `/api/{collection}/findOneAndUpdate`
- **Method**: `GET`
- **Summary**: Update a single record in the specified collection
- **Parameters**:
  - `{collection}` (Path parameter, required, string): Collection name
- **Responses**:
  - `200`: Updated successfully
  - `500`: Internal Server Error

#### 6. Update a single record in the specified collection by ID

- **Path**: `/api/{collection}/findByIdAndUpdate/{_id}`
- **Method**: `GET`
- **Summary**: Update a single record in the specified collection by ID
- **Parameters**:
  - `{collection}` (Path parameter, required, string): Collection name
  - `{_id}` (Path parameter, required, string): Record ID
- **Responses**:
  - `200`: Updated successfully
  - `500`: Internal Server Error
# db
