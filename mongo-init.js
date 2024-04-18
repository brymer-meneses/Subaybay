// https://www.mongodb.com/docs/mongodb-shell/reference/methods/

db = new Mongo().getDB("subaybay");
db.createCollection("cats");
db.createCollection("requestTypes");

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

db.users.insertMany([
  {
    name: "Yuumi",
    email: "yuumi@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/yuumi.png",
    isAdmin: false
  },
  {
    name: "Smolder",
    email: "smolder@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/smolder.png",
    isAdmin: false
  },
  {
    name: "Gnar",
    email: "gnar@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/gnar.png",
    isAdmin: false
  },
  {
    name: "Aurelion Sol",
    email: "sol@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/aurelion-sol.png",
    isAdmin: false
  },
  {
    name: "Kog' Maw",
    email: "kogmaw@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/kogmaw.png",
    isAdmin: false
  }
])
