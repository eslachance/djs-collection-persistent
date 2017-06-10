# Discord.js Collections made Persistent

This repository simply makes Collections ("stolen" from discord.js with permissions) persistent.

## Installation

To use Persistent Collections, install them via NPM: 

```
npm install --save djs-collection-persistent
```

Inside your script, initialize a new PersistentCollection: 

```js
const PersistentCollection = require("djs-collection-persistent");

// `name` is the only required value
const myCollection = new PersistentCollection({name: 'myCollection'});
```

If the collection `name` already exists, *its keys and values loaded in memory*.
If it does not exist, it is initialized (with no values).

The rest of the regular Collection methods are then used, with no difference in
actual usage. 

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