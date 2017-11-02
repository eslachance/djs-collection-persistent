# Discord.js Collections made Persistent

***__THIS REPOSITORY IS NOW OBSOLETE AND WILL NO LONGER BE UPDATED__***

## Moving to Enmap

`djs-collection-persistent` and `djs-collection` have been merged into a more efficient system that's been renamed *Enmap*.

To get enmap, see [The NPMJS Page](https://www.npmjs.com/package/enmap). 

Updating requires no migration, only a change in code: 

```
// OLD CODE

const PersistentCollection = require("djs-collection-persistent");
const myCollection = new PersistentCollection({name: 'myCollection'});

// NEW CODE

const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const myCollection = new Enmap({ provider: new EnmapLevel({ name: 'myCollection' }); });
```

Note that persistence requires a *Provider*. If you're using `djs-collection-persistent` you'll need to install both `enmap` and `enmap-level` to migrate. No data will be lost.

## Support

For support join [〈evie.codes〉](https://discord.gg/PhT8scR) and talk to me, 〈evie.codes〉!