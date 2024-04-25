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
    _id: "mom",
    name: "Smolder",
    email: "smolder@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/smolder.png",
    isAdmin: true
  },
  {
    _id: "gnar",
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
  {
    _id: "coe",
    title: "Certificate of Enrollment",
    stages: [
      [
        {
          stageTitle: "Create Request",
          defaultHandler: ""
        }
      ],
      [
        {
          stageTitle: "Prepare COE",
          defaultHandler: ""
        }
      ],
      [
        {
          stageTitle: "University Registrar Signature",
          defaultHandler: ""
        }
      ],
      [
        {
          stageTitle: "Notify Requester",
          defaultHandler: ""
        }
      ]
    ]
  },
  {
    _id: "otr1",
    title: "Official Transcript of Records (OTR) - First Request",
    stages: [
      [
        {
          stageTitle: "Create Request",
          defaultHandler: ""
        }
      ],
      [
        {
          stageTitle: "RR and Edit of Draft",
          defaultHandler: "" //staff 1
        }
      ],
      [
        {
          stageTitle: "Checking and Printing of Initial Draft",
          defaultHandler: "" //staff 2
        }
      ],
      [
        {
          stageTitle: "Checking Printed Draft",
          defaultHandler: "" //staff 3
        }
      ],
      [
        {
          stageTitle: "Final Printing",
          defaultHandler: "" //staff 2
        }
      ],
      [
        {
          stageTitle: "Signature",
          defaultHandler: "" //staff 1
        },
        {
          stageTitle: "Signature",
          defaultHandler: "" //staff 3
        }
      ],
      [
        {
          stageTitle: "University Registrar Signature",
          defaultHandler: ""
        }
      ],
      [
        {
          stageTitle: "Prepare of final copy and CTC OTR (if applicable)",
          defaultHandler: "" //staff 2
        }
      ],
      [
        {
          stageTitle: "Notify Requester",
          defaultHandler: ""
        }
      ],
    ]
  },
])

db.requests.insertMany([
  {
    _id: "juststarted",
    requestType: "otrId",
    studentNumber: "2020",
    studentName: "Hello World",
    studentEmail: "student@student.com",
    purpose: "Purpose",
    currentStages: [
      {
        stageTypeIndex: 0,
        substageTypeIndex: 0,
        handlerId: "airylionsoul",
        finished: false
      }
    ],
    nextStages: [
      {
        stageTypeIndex: 1,
        substageTypeIndex: 0,
        handlerId: "",
        finished: false
      },
      {
        stageTypeIndex: 1,
        substageTypeIndex: 1,
        handlerId: "",
        finished: false
      }
    ],
    history: []
  },
  {
    _id: "ongoing",
    requestType: "otrId",
    studentNumber: "2021",
    studentName: "Emz",
    studentEmail: "emz@brawl.com",
    purpose: "only here for the trophies",
    currentStages: [
      {
        stageTypeIndex: 1,
        substageTypeIndex: 0,
        handlerId: "mom",
        finished: false
      },
      {
        stageTypeIndex: 1,
        substageTypeIndex: 1,
        handlerId: "gnar",
        finished: false
      }
    ],
    nextStages: [
      {
        stageTypeIndex: 2,
        substageTypeIndex: 1,
        handler: "mom",
        finished: false
      }
    ],
    history: [
      {
        stageTypeIndex: 0,
        substageTypeIndex: 0,
        handler: "airylionsoul",
        finished: true
      }
    ]
  },
])