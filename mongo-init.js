// https://www.mongodb.com/docs/mongodb-shell/reference/methods/
db = new Mongo().getDB("subaybay");
db.createCollection("cats");
db.createCollection("requestTypes");
db.createCollection("requests");

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
    _id: "12345",
    name: "Yuumi",
    email: "yuumi@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/yuumi.png",
    isAdmin: false
  },
  {
    _id: "1782838901709",
    name: "Smolder",
    email: "smolder@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/smolder.png",
    isAdmin: true
  },
  {
    _id: "237890847",
    name: "Gnar",
    email: "gnar@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/gnar.png",
    isAdmin: true
  },
  {
    _id: "airylionsoul",
    name: "Aurelion Sol",
    email: "sol@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/aurelion-sol.png",
    isAdmin: false
  },
  {
    _id: "23523452345",
    name: "Kog' Maw",
    email: "kogmaw@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/kogmaw.png",
    isAdmin: false
  }
])

db.requestTypes.insertMany([
  {
    _id: "otrId",
    title: "OTR",
    stages: [
      [
        {
          stageTitle: "Create Request",
          defaultHandler: ""
        }
      ],
      [
        {
          stageTitle: "Signature 1",
          defaultHandler: ""
        },
        {
          stageTitle: "Signature 2",
          defaultHandler: ""
        }
      ],
      [
        {
          stageTitle: "University Registrar Signature",
          defaultHandler: ""
        }
      ]
    ]
  },
])

db.requests.insertMany([
  {
    _id: "dummy",
    requestType: "otrId",
    studentNumber: "2020",
    studentName: "Hello World",
    studentEmail: "student@student.com",
    purpose: "Purpose",
    currentStages: [
      {
        stageTypeIndex: 0,
        substageTypeIndex: 0,
        handler: "airylionsoul",
        finished: true
      }
    ],
    nextStages: [
      {
        stageTypeIndex: 1,
        substageTypeIndex: 0,
        handler: "",
        finished: true
      },
      {
        stageTypeIndex: 1,
        substageTypeIndex: 1,
        handler: "",
        finished: true
      }
    ]
  },
])