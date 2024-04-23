const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * A simple database implementation using JSON files for data storage.
 * @class
 */
class Database {
  /**
   * Creates a new Database instance.
   * @constructor
   * @param {string} databasePath - The path to the directory where database files are stored.
   */
  constructor() {
    /**
     * The path to the directory where database files are stored.
     * @type {string}
     */
    this.databasePath = path.join(__dirname, "Store");
    ;

    /**
     * A dictionary to store collections in memory.
     * @type {Object.<string, Array>}
     */
    this.collections = {};
  }

  /**
   * Loads data from a JSON file into the specified collection.
   * @param {string} collectionName - The name of the collection to load.
   */
  loadDatabase(collectionName) {
    const filePath = `${this.databasePath}/${collectionName}.json`;
    try {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsedData = JSON.parse(data);
      this.collections[collectionName] = parsedData || [];
    } catch (error) {
      this.collections[collectionName] = [];
    }
  }

  /**
   * Saves the data of a collection to a JSON file.
   * @param {string} collectionName - The name of the collection to save.
   */
  saveDatabase(collectionName) {
    const filePath = `${this.databasePath}/${collectionName}.json`;
    const collection = this.getCollection(collectionName);
    fs.writeFileSync(filePath, JSON.stringify(collection, null, 2), "utf-8");
  }

  /**
   * Retrieves the collection data from memory or loads it from the file if not present.
   * @param {string} collectionName - The name of the collection to retrieve.
   * @returns {Array} - The array representing the collection.
   */
  getCollection(collectionName) {
    if (!(collectionName in this.collections)) {
      this.loadDatabase(collectionName);
    }
    return this.collections[collectionName];
  }

  /**
   * Adds a new document to the specified collection.
   * @param {string} collectionName - The name of the collection to add the document to.
   * @param {Object} data - The data to be added to the collection as a new document.
   * @returns {Object} - The newly added document.
   */
  create(collectionName, data) {
    if(!data){
    throw new Error('data emty')
    }

    const collection = this.getCollection(collectionName);
    const id = uuidv4(); // Generate a random ID
    const document = { _id: id, ...data };
    collection.push(document);
    this.appendToFile(collectionName);
    return document;
  }

  /**
   * Finds documents in a collection that match a specified query.
   * @param {string} collectionName - The name of the collection to search.
   * @param {Object} query - The query object specifying the criteria for matching documents.
   * @returns {Array} - An array of documents that match the query.
   */
  find(collectionName, query) {
    const collection = this.getCollection(collectionName);
    return collection.filter((item) => this.matchesQuery(item, query));
  }

  findOne (collectionName,query){
    const collection = this.getCollection(collectionName);
    return collection.find((item) => this.matchesQuery(item, query));
  }

 // findOneAndUpdate method
findOneAndUpdate(collectionName, query, newData) {
 
  try {
    if (typeof collectionName !== 'string') {
      throw new Error('Collection name must be a string');
    }

    if (typeof query !== 'object' || query === null || Array.isArray(query)) {
      throw new Error('Query must be a non-null object');
    }

    if (typeof newData !== 'object' || newData === null || Array.isArray(newData)) {
      throw new Error('New data must be a non-null object');
    }

    const collection = this.getCollection(collectionName);
    const foundIndex = collection.findIndex((item) => this.matchesQuery(item, query));
    


    if (foundIndex !== -1) {
      const updatedDocument = { ...collection[foundIndex] };

      for (const key in newData) {
        
       
       
        if(key === '$set' && typeof newData[key] === 'object' ){
          
        for (let value in newData[key]){
          
          if(typeof updatedDocument[value] !== 'number'){
            throw new Error(`shema set ${typeof updatedDocument[value] } not allow only $set use number`)
          }
 
          if(typeof newData[key][value] === 'number'){
             updatedDocument[value] += newData[key][value]
          }

        } 
        }
       else {
         if(updatedDocument[key] === '_id'){
          throw new  Error('error updated not allow _id ')
         }
        updatedDocument[key] = newData[key]
       }

       
         
      }
      collection[foundIndex] = updatedDocument;
      this.appendToFile(collectionName);
      return updatedDocument;
    } else {
      throw new Error(`Document with query ${JSON.stringify(query)} not found in ${collectionName}`);
    }
  } catch (error) {
    console.error("Error in findOneAndUpdate:", error.message);
    throw error; // Rethrow the error to propagate it up
  }
}

// findByIdAndUpdate method
findByIdAndUpdate(collectionName, id, newData) {
 try { 
    if (typeof collectionName !== 'string') {
      throw new Error('Collection name must be a string');
    }

    if (typeof id !== 'string') {
      throw new Error('Document ID must be a string');
    }

    if (typeof newData !== 'object' || newData === null || Array.isArray(newData)) {
      throw new Error('New data must be a non-null object');
    }

    const collection = this.getCollection(collectionName);
    const foundIndex = collection.findIndex((item) => item._id === id);

    if (foundIndex !== -1) {
      const updatedDocument = { ...collection[foundIndex] };


       

      for (const key in newData) {
        
       
       
        if(key === '$set' && typeof newData[key] === 'object' ){
          
        for (let value in newData[key]){
          
          if(typeof updatedDocument[value] !== 'number'){
            throw new Error(`shema set ${typeof updatedDocument[value] } not allow only $set use number`)
          }
 
          if(typeof newData[key][value] === 'number'){
             updatedDocument[value] += newData[key][value]
          }

        } 
        }
       else {
         
        updatedDocument[key] = newData[key]
       }

       
         
      }

      

      collection[foundIndex] = updatedDocument;
      this.appendToFile(collectionName);
      return updatedDocument;
    } else {
      throw new Error(`Document with ID ${id} not found in ${collectionName}`);
    }
  } catch (error) {
    console.error("Error in findByIdAndUpdate:", error.message);
    throw error; // Rethrow the error to propagate it up
  }
}

  
  
  
  

  /**
   * Updates the data of a document in the specified collection.
   * @param {string} collectionName - The name of the collection containing the document.
   * @param {string} id - The unique identifier of the document to update.
   * @param {Object} newData - The new data to merge into the existing document.
   * @returns {Object|null} - The updated document if successful, otherwise null.
   */
  updateCollectionItem(collectionName, id, newData) {
    const collection = this.getCollection(collectionName);
    const index = collection.findIndex((item) => item._id === id);

    if (index !== -1) {
      collection[index] = { ...collection[index], ...newData };
      this.appendToFile(collectionName);
      return collection[index];
    }

    return null;
  }

  /**
   * Appends the current collection data to the corresponding JSON file.
   * @param {string} collectionName - The name of the collection to update in the file.
   */
  appendToFile(collectionName) {
    const filePath = `${this.databasePath}/${collectionName}.json`;
    const collection = this.getCollection(collectionName);
    fs.writeFileSync(filePath, JSON.stringify(collection, null, 2), "utf-8");
  }

  /**
   * Finds a document in a collection by its unique identifier.
   * @param {string} collectionName - The name of the collection to search.
   * @param {string} id - The unique identifier of the document to find.
   * @returns {Object|null} - The found document if it exists, otherwise null.
   */
  findById(collectionName, id) {
    const collection = this.getCollection(collectionName);
    return collection.find((item) => item._id === id);
  }

 
  /**
   * Checks if an item matches a given query.
   * @param {Object} item - The item to be checked against the query.
   * @param {Object} query - The query object specifying the criteria for matching.
   * @returns {boolean} - True if the item matches the query, otherwise false.
   */
  matchesQuery(item, query) {
    for (const key in query) {
      if (item[key] !== query[key]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Groups documents in a collection based on a specified key.
   * @param {string} collectionName - The name of the collection to group.
   * @param { [ { $match :  }] } pipeline - The key to group by.
   * @returns {Object} - An object where keys are the grouped values, and values are arrays of documents.
   */

  aggregate(collectionName, pipeline) {
    let result = this.getCollection(collectionName);

    pipeline.forEach((stage) => {
      const stageName = Object.keys(stage)[0];
      const stageParams = stage[stageName];

      switch (stageName) {
        case "$match":
          result = this.match(collectionName, stageParams);
        case "$group":
          result = this.group(collectionName, stageParams);
          break;
        case "$project":
          result = this.project(collectionName, stageParams);
          break;
        case "$sort":
          result = this.sort(collectionName, stageParams);
          break;
        case "$limit":
        ///result = this.limit(collectionName, stageParams);
        case "$skip":
        //result = this.skip(collectionName, stageParams);
        default:
          console.error(`Unknown aggregation stage: ${stageName}`);
      }
    });

    return result;
  }
 

  /**
   * Sorts documents in a collection based on specified fields and orders.
   * @param {string} collectionName - The name of the collection to sort.
   * @param {Object} sortOptions - An object specifying the fields and orders for sorting.
   * @returns {Array} - An array of sorted documents.
   */
  sort(collectionName, sortOptions) {
    const collection = this.getCollection(collectionName);
    return collection.slice().sort((a, b) => {
      for (const field in sortOptions) {
        const order = sortOptions[field];
        if (a[field] < b[field]) return order === "asc" ? -1 : 1;
        if (a[field] > b[field]) return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  /**
   * Filters documents in a collection based on a specified query.
   * @param {string} collectionName - The name of the collection to filter.
   * @param {Object} query - The query object specifying the criteria for matching documents.
   * @returns {Array} - An array of documents that match the query.
   */
  match(collectionName, query) {
    const collection = this.getCollection(collectionName);
    return collection.filter((item) => this.matchesQuery(item, query));
  }

  /**
   * Limits the number of documents in a collection.
   * @param {string} collectionName - The name of the collection to limit.
   * @param {number} limit - The maximum number of documents to include in the result.
   * @returns {Array} - An array of documents limited by the specified count.
   */
  limit(collectionName, limit) {
    const collection = this.getCollection(collectionName);
    return collection.slice(0, limit);
  }
}

module.exports = Database;
