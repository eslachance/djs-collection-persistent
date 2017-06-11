const PersistentCollection = require("./index");
const myColl = new PersistentCollection({name: "test"});

console.time("1MillionInserts");
console.time("1MillionInsertsReady");
for(let i = 0; i<100000;i++) {
  myColl.set(`test${i}`, {testValue: "This is a test Value"});
}
console.timeEnd("1MillionInserts");
myColl.event.on("ready", () =>{
  console.timeEnd("1MillionInsertsReady");
  
  
  console.time("10ThousandRandoms");
  myColl.randomKey(10000);
  console.timeEnd("10ThousandRandoms");
  
  console.time("DeleteAll");
  const arrPromises = myColl.deleteAll();
  Promise.all(arrPromises).then(() => {
    console.timeEnd("DeleteAll");
  });  
  
});

process.on("unhandledRejection", err => {
  console.error("Uncaught Promise Error: ", err);
});