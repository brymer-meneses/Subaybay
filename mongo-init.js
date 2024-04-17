// https://www.mongodb.com/docs/mongodb-shell/reference/methods/

db = new Mongo().getDB("subaybay");
db.createCollection("cats")

db.cats.insertMany([
  {
    name: 'mr. fresh',
  },
  {
    name: 'mr. grandpa',
  },
  {
    name: 'mr. fuhrer',
  }
]);
