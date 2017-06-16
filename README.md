# Discord.js Collections made Persistent

Persistent Collections are a data structure that can be used to store data in memory that is also saved in a database behind the scenes. The data is synchronized to the database automatically, seamlessly, and asynchronously so it should not adversely affect your performance compared to regular "Collections"


## FAQs

### Q: What is a "Collection"?

**A**: Collections are the Javascript Map() data structure with additional utility methods.
This is used throughout discord.js rather than Arrays for anything that has an ID, 
for significantly improved performance and ease-of-use.

[Learn more about Collections](https://discord.js.org/#/docs/main/stable/class/Collection)

### Q: What is "Persistent"?

**A**: With the use of the `levelup` module, any data added to the Collection
is stored not only in temporary memory but also backed up in a local file
database. This does not require a server. Saving things in memory enables
faster code, but it may take more memory.

### Q: How big can a persistent collection be?

**A**: In its initial implementation, upon loading a PersistentCollection, all
key/value pairs are loaded in memory. The size of the memory used is directly
proportional to the size of your actual database. 

Future versions will have ways to load partial or temporary values, etc.

## Installation

To use Persistent Collections, install them via NPM: 

```
npm install --save djs-collection-persistent
```

Inside your script, initialize a new PersistentCollection: 

```js
const PersistentCollection = require("djs-collection-persistent");

// Initialize or load existing PCollection
const myCollection = new PersistentCollection({name: 'myCollection'});

// Adding data is simply a `set` command: 
myCollection.set("myKey", "a value");

// Getting a value is done by key 
let result = myCollection.get("myKey");
```

Some important notes: 
- If the collection `name` already exists, *its keys and values loaded in memory*.
- If it does not exist, it is initialized (with no values).
- Keys *must* be either a string or a number. Other data types (Array, Object, Map, Set, etc) cannot be used as keys.
- Values *must* be "JSON.stringify()able", meaning they must be able to be converted to a string. This includes strings, numbers, arrays, and objects. Other Collections, Maps, or Sets cannot be inserted.

## Added Methods

On top of the regular Collection methods, the following have been added to PersistentCollection
for ease of use or actual functionality: 

### &lt;PersistentCollection&gt;.close()

Shuts down the database connection cleanly and clears the Collection from memory. 

## Example Usage

Here's one very quick example of how to use Persistent Collections. Here we're using them to store per-server configuration - one of the most useful things for developing Discord Bots that are growing to multiple servers. 

```js
// Regular Discord.js bootup
const Discord = require("discord.js");
const client = new Discord.Client();

// Loading Persistent Collections
const PersistentCollection = require("djs-collection-persistent");
const configs = new PersistentCollection({name: 'configs'});

// On guild create, initialize default confs
client.on("guildCreate", guild => {
  if(!configs.has(guild.id)) {
    configs.set(guild.id, {prefix: "!", mod-role: "Mods", admin-role: "Admins"});
  }
});

// Message Event (example)
client.on("message", message => {
  if (message.author.bot) return;
  if (!message.guild) return;

  // Loading the configuration for this guild
  const conf = configs.get(guild.id);

  // Get prefix from conf, or default to static prefix
  if(conf.prefix) {
    prefix = conf.prefix;
  } else {
    prefix = "!";
  }
  
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.split(" ");
  const command = args.shift().slice(prefix.length);

  if(command === "setconf") {
    const key = args[0];
    const value = args.shift(1).join(" ");
    conf[key] = value;
    confs.set(message.guild.id, conf);
  }
});
```

> Obviously this is a **very** basic example with no security on who can set a config, or check for proper values, etc. That's beyond the scope of this example!