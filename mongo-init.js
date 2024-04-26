// https://www.mongodb.com/docs/mongodb-shell/reference/methods/
db = new Mongo().getDB("subaybay");
db.createCollection("requestTypes");
db.createCollection("requests");

db.users.insertMany([
  {
    _id: "12345",
    name: "Yuumi",
    email: "yuumi@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/yuumi.png",
    isAdmin: false,
  },
  {
    _id: "mom",
    name: "Smolder",
    email: "smolder@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/smolder.png",
    isAdmin: true,
  },
  {
    _id: "gnar",
    name: "Gnar",
    email: "gnar@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/gnar.png",
    isAdmin: true,
  },
  {
    _id: "airylionsoul",
    name: "Aurelion Sol",
    email: "sol@lol.com",
    profileUrl:
      "https://www.mobafire.com/images/champion/square/aurelion-sol.png",
    isAdmin: false,
  },
  {
    _id: "23523452345",
    name: "Kog' Maw",
    email: "kogmaw@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/kogmaw.png",
    isAdmin: false,
  },
]);

basicCerts = [
  ["coe", "Certificate of Enrolment"],
  ["cge", "Certificate of Grade Equivalence"],
  ["cg", "Certificate of Graduation"],
  ["cmi", "Certificate of Medium of Instruction"],
  ["gmc", "Certificate of No Disciplinary Case (GMC)"],
  ["cnhdg", "Certificate of Non-Issuance of Honorable Dismissal for Graduates"],
  ["cue", "Certificate of Units Earned"],
  ["cft", "Certificate of Free Tuition"],
  ["cnstpsn", "Certificate of NSTP Serial No."],
  ["cnson", "Certificate of No S.O. Number"],
  ["ctc", "Certificate of Transfer Credential"],
  ["tcg", "True Copy of Grades"],
  ["cd", "Course Description"],
];

let requestTypesToAdd = [];

for (const item of basicCerts) {
  requestTypesToAdd.push({
    _id: item[0],
    title: item[1],
    stages: [
      [
        {
          stageTitle: "Create Request",
          defaultHandler: "",
        },
      ],
      [
        {
          stageTitle: "Prepare Certification",
          defaultHandler: "",
        },
      ],
      [
        {
          stageTitle: "University Registrar Signature",
          defaultHandler: "",
        },
      ],
      [
        {
          stageTitle: "Notify Requester",
          defaultHandler: "",
        },
      ],
    ],
  });
}

db.requestTypes.insertMany([
  ...requestTypesToAdd,
  {
    _id: "otr1",
    title: "Official Transcript of Records (OTR) - First Request",
    stages: [
      [
        {
          stageTitle: "Create Request",
          defaultHandler: "",
        },
      ],
      [
        {
          stageTitle: "RR and Edit of Draft",
          defaultHandler: "", //staff 1
        },
      ],
      [
        {
          stageTitle: "Checking and Printing of Initial Draft",
          defaultHandler: "", //staff 2
        },
      ],
      [
        {
          stageTitle: "Checking Printed Draft",
          defaultHandler: "", //staff 3
        },
      ],
      [
        {
          stageTitle: "Final Printing",
          defaultHandler: "", //staff 2
        },
      ],
      [
        {
          stageTitle: "Signature",
          defaultHandler: "", //staff 1
        },
        {
          stageTitle: "Signature",
          defaultHandler: "", //staff 3
        },
      ],
      [
        {
          stageTitle: "University Registrar Signature",
          defaultHandler: "",
        },
      ],
      [
        {
          stageTitle: "Prepare final copy and CTC OTR (if applicable)",
          defaultHandler: "", //staff 2
        },
      ],
      [
        {
          stageTitle: "Notify Requester",
          defaultHandler: "",
        },
      ],
    ],
  },
  {
    _id: "otr2",
    title: "Official Transcript of Records (OTR) - Second Request",
    stages: [
      [
        {
          stageTitle: "Create Request",
          defaultHandler: ""
        }
      ],
      [
        {
          stageTitle: "Print and Sign OTR",
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
          stageTitle: "Signature of University Registrar",
          defaultHandler: ""
        }
      ],
      [
        {
          stageTitle: "Prepare final copy and CTC OTR (if applicable)",
          defaultHandler: "", //staff 2
        },
      ],
      [
        {
          stageTitle: "Notify Requester",
          defaultHandler: "",
        },
      ]
    ]
  }
]);

db.requests.insertMany([
  {
    _id: "juststarted",
    requestType: "coe",
    studentNumber: "2020",
    studentName: "Hello World",
    studentEmail: "student@student.com",
    purpose: "Purpose",
    currentStages: [
      {
        stageTypeIndex: 0,
        substageTypeIndex: 0,
        handlerId: "airylionsoul",
        finished: false,
      },
    ],
    nextStages: [
      {
        stageTypeIndex: 1,
        substageTypeIndex: 0,
        handlerId: "mom",
        finished: false,
      },
    ],
    history: [],
  },
  {
    _id: "ongoing",
    requestType: "coe",
    studentNumber: "2021",
    studentName: "Emz",
    studentEmail: "emz@brawl.com",
    purpose: "only here for the trophies",
    currentStages: [
      {
        stageTypeIndex: 1,
        substageTypeIndex: 0,
        handlerId: "mom",
        finished: false,
      },
    ],
    nextStages: [
      {
        stageTypeIndex: 2,
        substageTypeIndex: 1,
        handlerId: "mom",
        finished: false,
      },
    ],
    history: [
      {
        stageTypeIndex: 0,
        substageTypeIndex: 0,
        handlerId: "airylionsoul",
        finished: true,
      },
    ],
  },
]);
