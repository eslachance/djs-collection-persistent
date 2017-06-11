const Collection = require("djs-collection");
const levelup = require('levelup');
const leveldown = require('leveldown');
const path = require("path");
const EventEmitter = require("events").EventEmitter;

/**
 * A persistent, disk-saved version of the Discord.js' Collections data structure.
 * @extends {Collection}
 */
class PersistentCollection extends Collection {

  constructor(iterable, options = {}) {
    if (typeof iterable[Symbol.iterator] !== 'function') {
        options = iterable || {};
        iterable = null;
    }
    super(iterable);
    if (!options.name) throw new Error("Must provide a name for the collection.");

    this.ready = false;
    this.event = new EventEmitter();
    this.inProgress = 0;
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
    this.db = levelup(this.path);
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
      this.event.emit("ready");
      this.ready = true;
    });
  }
  
  close() {
    this.db.close();
  }
  
  _validateName() {
    this.name = this.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  }
  
  set(key, val) {
    if(!key || !["String", "Number"].includes(key.constructor.name)) 
      throw new Error("Persistent Collections require keys to be strings or numbers.");
    this.inProgress++;
    val = (typeof val === "object" ? JSON.stringify(val) : val);
    this.db.put(key, val, () => this.inProgress--);
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
      this.inProgress++;
      this.db.del(key, () => this.inProgress--);
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
        leveldown.destroy(this.path, (err) => {
          if(err) return reject(err);
          resolve();
        });
      });
    });
  }
  
  waitUntil(condition, callback) {
    if(condition) callback();
    else setTimeout(this.waitUntil(condition,callback),50);
  }
}

module.exports = PersistentCollection;