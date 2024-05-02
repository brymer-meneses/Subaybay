// https://www.mongodb.com/docs/mongodb-shell/reference/methods/
db = new Mongo().getDB("subaybay");

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

// [id, title]
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
          defaultHandlerId: "",
        },
      ],
      [
        {
          stageTitle: "Prepare Certification",
          defaultHandlerId: "",
        },
      ],
      [
        {
          stageTitle: "University Registrar Signature",
          defaultHandlerId: "",
        },
      ],
      [
        {
          stageTitle: "Notify Requester",
          defaultHandlerId: "",
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
          defaultHandlerId: "",
        },
      ],
      [
        {
          stageTitle: "RR and Edit of Draft",
          defaultHandlerId: "", //staff 1
        },
      ],
      [
        {
          stageTitle: "Checking and Printing of Initial Draft",
          defaultHandlerId: "", //staff 2
        },
      ],
      [
        {
          stageTitle: "Checking Printed Draft",
          defaultHandlerId: "", //staff 3
        },
      ],
      [
        {
          stageTitle: "Final Printing",
          defaultHandlerId: "", //staff 2
        },
      ],
      [
        {
          stageTitle: "Signature",
          defaultHandlerId: "", //staff 1
        },
        {
          stageTitle: "Signature",
          defaultHandlerId: "", //staff 3
        },
      ],
      [
        {
          stageTitle: "University Registrar Signature",
          defaultHandlerId: "",
        },
      ],
      [
        {
          stageTitle: "Prepare final copy and CTC OTR (if applicable)",
          defaultHandlerId: "", //staff 2
        },
      ],
      [
        {
          stageTitle: "Notify Requester",
          defaultHandlerId: "",
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
          defaultHandlerId: ""
        }
      ],
      [
        {
          stageTitle: "Print and Sign OTR",
          defaultHandlerId: "" //staff 2
        }
      ],
      [
        {
          stageTitle: "Signature",
          defaultHandlerId: "" //staff 1
        },
        {
          stageTitle: "Signature",
          defaultHandlerId: "" //staff 3
        }
      ],
      [
        {
          stageTitle: "Signature of University Registrar",
          defaultHandlerId: ""
        }
      ],
      [
        {
          stageTitle: "Prepare final copy and CTC OTR (if applicable)",
          defaultHandlerId: "", //staff 2
        },
      ],
      [
        {
          stageTitle: "Notify Requester",
          defaultHandlerId: "",
        },
      ]
    ]
  }
]);

db.requests.insertMany([
  {
    _id: "juststarted",
    requestTypeId: "coe",
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
        dateStarted: new Date('2024-04-27'),
        dateFinished: new Date('2024-04-28')
      },
    ],
    nextStages: [
      {
        stageTypeIndex: 1,
        substageTypeIndex: 0,
        handlerId: "mom",
        finished: false,
        dateStarted: new Date(0),
        dateFinished: new Date(0)
      },
    ],
    history: [],
  },
  {
    _id: "parallel",
    requestTypeId: "otr2",
    studentNumber: "2022",
    studentName: "Phoenix",
    studentEmail: "phoenix@val.com",
    purpose: "to show you how the boss does it",
    remarks: "Hello",
    currentStages: [
      {
        stageTypeIndex: 2,
        substageTypeIndex: 0,
        handlerId: "mom",
        finished: true,
        dateStarted: new Date('2024-04-29'),
        dateFinished: new Date('2024-04-29')
      },
      {
        stageTypeIndex: 2,
        substageTypeIndex: 1,
        handlerId: "gnar",
        finished: false,
        dateStarted: new Date('2024-04-29'),
        dateFinished: new Date('2024-04-29'),
      }
    ],
    nextStages: [
      {
        stageTypeIndex: 3,
        substageTypeIndex: 0,
        handlerId: "airylionsoul",
        finished: false,
        dateStarted: new Date(0),
        dateFinished: new Date(0)
      }
    ],
    history: [
      {
        stageTypeIndex: 0,
        substageTypeIndex: 0,
        handlerId: "gnar",
        finished: true,
        dateStarted: new Date('2024-04-28'),
        dateFinished: new Date('2024-04-28')
      },
      {
        stageTypeIndex: 1,
        substageTypeIndex: 0,
        handlerId: "gnar",
        finished: true,
        dateStarted: new Date('2024-04-28'),
        dateFinished: new Date('2024-04-28')
      },
    ]
  }
]);
