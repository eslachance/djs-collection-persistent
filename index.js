const Collection = require("djs-collection");
const level = require('level');
const path = require("path");

/**
 * A persistent, disk-saved version of the Discord.js' Collections data structure.
 * @extends {Collection}
 */
class PersistentCollection extends Collection {
  /**
   * @typedef PersistentCollectionOptions
   * @property {string} name - Unique database name
   * @property {string} [dataDir="./data"] - Directory where data is stored
   */

  /**
   * Creates a new Collection that saves its data to a file.
   * @param {*} [iterable] - Iterable Object to initialize Collection from
   * @param {PersistentCollectionOptions} options - Options for database name and location
   */
  constructor(iterable, options = {}) {
    console.log('DeprecationWarning: djs-collection-persistent is no longer maintained. Please migrate to enmap (available on npm).')
    if (typeof iterable[Symbol.iterator] !== 'function') {
        options = iterable || {};
        iterable = null;
    }
    super(iterable);
    if (!options.name) throw new Error("Must provide a name for the collection.");

    this.defer = new Promise(resolve => this.ready = resolve);
    this.inProgress = 0;
    this.name = options.name;
    //todo: check for "unique" option for the DB name and exit if exists
    this.validateName();
    this.dataDir = (options.dataDir || "data");
    if(!options.dataDir) {
      const fs = require("fs");
      if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data");
      }
    }
    this.path = path.join(process.cwd(), this.dataDir, this.name);
    this.db = level(this.path);
    this.init();
  }
  
  init() {
    const stream = this.db.keyStream();
    stream.on('data', key => {
      this.db.get(key, (err, value) => {
        if(err) console.log(err);
        try{
          this.set(key, JSON.parse(value));
        } catch(e) {
          this.set(key, value);
        }
        
      });
    });
    stream.on('end', () => {
      this.ready();
    });
  }
  
  /**
   * Closes database cleanly ensuring data is saved.
   */
  close() {
    this.db.close();
  }
  
  validateName() {
    this.name = this.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
  
  set(key, val) {
    if(!key || !["String", "Number"].includes(key.constructor.name)) 
      throw new Error("Persistent Collections require keys to be strings or numbers.");
    const insert = (typeof val === "object" ? JSON.stringify(val) : val);
    this.db.put(key, insert);
    return super.set(key, val);
  }
  
  get(key) {
    let val = super.get(key);
    try{
      return JSON.parse(val);
    } catch (e) {
      return val;
    }
  }

  delete(key, bulk = false) {
    if(!bulk) {
      this.db.del(key);
    }
    return super.delete(key);
  }
  
  deleteAll() {
    const returns = [];
    for (const key of this.keys()) {
      returns.push(this.delete(key, true));
    }
    returns.push(this.purge());
    return returns;
  }
  
  purge() {
    return new Promise((resolve, reject) => {
      this.db.close(err=> {
        if(err) return reject(err);
        level.destroy(this.path, (err) => {
          if(err) return reject(err);
          resolve();
        });
      });
    });
  }
}

module.exports = PersistentCollection;
