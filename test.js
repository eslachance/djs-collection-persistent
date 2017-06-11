const PersistentCollection = require("./index");
const myColl = new PersistentCollection({name: "test"});

myColl.waitUntil(()=>this.ready, ()=>{
  
  console.time("100kInserts");
  for(let i = 0; i<100000;i++) {
    myColl.set(`test${i}`, {testValue: "This is a test Value"});
  }
  console.timeEnd("100kInserts");
  
  myColl.waitUntil(
    () => myColl.inProgress = 0,
    () => {
      console.time("10kRandoms");
      myColl.randomKey(10000);
      console.timeEnd("10kRandoms");
      
      
      console.time("DeleteAll");
      const arrPromises = myColl.deleteAll();
      Promise.all(arrPromises).then(() => {
        console.timeEnd("DeleteAll");
      });
    });
  
  
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});