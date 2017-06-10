const PersistentCollection = require("./index");
const myColl = new PersistentCollection({name: "test"});

console.time("1MillionInserts");
for(let i = 0; i<1000000;i++) {
  myColl.set(`test${i}`, {testValue: "This is a test Value"});
}
console.timeEnd("1MillionInserts");

console.time("10ThousandRandoms");
myColl.randomKey(10000);
console.timeEnd("10ThousandRandoms");

/*
console.time("DeleteAll");
Promise.all(myColl.deleteAll()).then(() => {
  console.timeEnd("DeleteAll");
});
*/