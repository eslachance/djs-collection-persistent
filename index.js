const Collection = require("djs-collection");
const levelup = require('levelup');
const path = require("path");

/**
 * A persistent, disk-saved version of the Discord.js' Collections data structure.
 * @extends {Collection}
 */
class PersistentCollection extends Collection {

  constructor(options = {}) {
    super();
    if (!options.name) throw new Error("Must provide a name for the collection.");
    
    this.ready = false;
    this.name = options.name;
    //todo: check for "unique" option for the DB name and exit if exists
    this._validateName();
    this.dataDir = (options.dataDir || "data");
    if(!options.dataDir) {
      const fs = require("fs");
      if (!fs.existsSync("./data")) {
        fs.mkdirSync("./data");
      }
    }
    this.path = path.join(process.cwd(), this.dataDir, this.name);
    console.log(this.path);
    this.db = levelup(this.path);
    this.init();
  }
  
  init() {
    const stream = this.db.keyStream();
    stream.on('data', key => {
      this.db.get(key, (err, value) => {
        if(err) console.log(err);
        this.set(key, JSON.parse(value));
      });
    });
    stream.on('end', () => this.ready = true);
  }
  
  _validateName() {
    this.name = this.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
  
  set(key, val) {
    if(!key || key.constructor.name !== "String") 
      throw new Error("Persistent Collections require keys to be strings.");
    this.db.put(key, JSON.stringify(val));
    return super.set(key, val);
  }

  delete(key, bulk = false) {
    if(bulk) this.db.del(key);
    return super.delete(key);
  }
  
  async deleteAll() {
    const returns = [];
    const ops = [];
    for (const key of this.keys()) {
      returns.push(this.delete(key));
      ops.push({type: 'del', key});
    }
    await this._purge();
    return returns;
  }
  
  _purge() {
    return new Promise((resolve, reject) => {
      require("levelup").destroy(this.path, (err) => {
        if(err) return reject(err);
        this.db = levelup(this.path);
        resolve();
      });
    });
  }
}

module.exports = PersistentCollection;