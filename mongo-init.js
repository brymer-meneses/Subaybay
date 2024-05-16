// https://www.mongodb.com/docs/mongodb-shell/reference/methods/
db = new Mongo().getDB("subaybay");

db.permittedEmails.insertMany([
  { email:"yuumi@lol.com" },
  { email:"smolder@lol.com" },
  { email:"gnar@lol.com" },
  { email:"sol@lol.com" },
  { email:"kogmaw@lol.com" },
])

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
    version: 1,
    stages: [
      {
        stageTitle: "Newly Created Request",
        defaultHandlerId: "",
      },
      {
        stageTitle: "Prepare Certification",
        defaultHandlerId: "",
      },
      {
        stageTitle: "University Registrar Signature",
        defaultHandlerId: "",
      },
      {
        stageTitle: "Notify Requester",
        defaultHandlerId: "",
      },
    ],
  });
}

db.requestTypes.insertMany([
  ...requestTypesToAdd,
  {
    _id: "otr1",
    title: "Official Transcript of Records (OTR) - First Request",
    version: 1,
    stages: [
        {
          stageTitle: "Newly Created Request",
          defaultHandlerId: "",
        },
        {
          stageTitle: "RR and Edit of Draft",
          defaultHandlerId: "", //staff 1
        },
        {
          stageTitle: "Checking and Printing of Initial Draft",
          defaultHandlerId: "", //staff 2
        },
        {
          stageTitle: "Checking Printed Draft",
          defaultHandlerId: "", //staff 3
        },
        {
          stageTitle: "Final Printing",
          defaultHandlerId: "", //staff 2
        },
        {
          stageTitle: "Signature",
          defaultHandlerId: "", //staff 1
        },
        {
          stageTitle: "Signature",
          defaultHandlerId: "", //staff 3
        },
        {
          stageTitle: "University Registrar Signature",
          defaultHandlerId: "",
        },
        {
          stageTitle: "Prepare final copy and CTC OTR (if applicable)",
          defaultHandlerId: "", //staff 2
        },
        {
          stageTitle: "Notify Requester",
          defaultHandlerId: "",
        },
    ]
  },
  {
    _id: "otr2",
    title: "Official Transcript of Records (OTR) - Second Request",
    version: 1,
    stages: [
        {
          stageTitle: "Newly Created Request",
          defaultHandlerId: ""
        },
        {
          stageTitle: "Print and Sign OTR",
          defaultHandlerId: "" //staff 2
        },
        {
          stageTitle: "Signature",
          defaultHandlerId: "" //staff 1
        },
        {
          stageTitle: "Signature",
          defaultHandlerId: "" //staff 3
        },
        {
          stageTitle: "Signature of University Registrar",
          defaultHandlerId: ""
        },
        {
          stageTitle: "Prepare final copy and CTC OTR (if applicable)",
          defaultHandlerId: "", //staff 2
        },
        {
          stageTitle: "Notify Requester",
          defaultHandlerId: "",
        },
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
    remarks: "Good Morning",
    currentStage: 
      {
        stageTypeIndex: 0,
        handlerId: "airylionsoul",
        finished: false,
        dateStarted: new Date('2024-04-27'),
        dateFinished: new Date(0),
        roomId: "134333412"
      },
    history: [],
    nextHandlerId: ""
  },
  {
    _id: "ongoing",
    requestTypeId: "otr1",
    studentNumber: "2021",
    studentName: "Hello World",
    studentEmail: "student@student.com",
    purpose: "Purpose",
    remarks: "Hello",
    currentStage: 
      {
        stageTypeIndex: 2,
        handlerId: "airylionsoul",
        finished: true,
        dateStarted: new Date('2024-04-27'),
        dateFinished: new Date(0),
        roomId: "13212"
      },
    history: [
      {
        stageTypeIndex: 0,
        handlerId: "gnar",
        finished: true,
        dateStarted: new Date('2024-04-27'),
        dateFinished: new Date('2024-04-27'),
        roomId: "1231232"
      },
      {
        stageTypeIndex: 1,
        handlerId: "airylionsoul",
        finished: false,
        dateStarted: new Date('2024-04-27'),
        dateFinished: new Date('2024-04-27'),
        roomId: "453435"
      },
    ],
    nextHandlerId: "mom"
  },
  {
    _id: "stale",
    requestTypeId: "coe",
    studentNumber: "2020",
    studentName: "Hello World",
    studentEmail: "student@student.com",
    purpose: "Purpose",
    remarks: "Good Morning",
    isFinished: true,
    currentStage: {
      stageTypeIndex: 3,
      handlerId: "airylionsoul",
      finished: false,
      dateStarted: new Date("2024-04-27T00:00:00.000Z"),
      dateFinished: new Date("1970-01-01T00:00:00.000Z"),
      roomId: "134333412"
    },
    history: [],
    nextHandlerId: ""
  },
  {
    _id: "finished",
    requestTypeId: "coe",
    studentNumber: "2020",
    studentName: "Hello World",
    studentEmail: "student@student.com",
    purpose: "Purpose",
    remarks: "Good Morning",
    isFinished: true,
    currentStage: {
      stageTypeIndex: 3,
      handlerId: "airylionsoul",
      finished: false,
      dateStarted: new Date("2024-04-27T00:00:00.000Z"),
      dateFinished: new Date("2024-05-13T08:00:00.000Z"),
      roomId: "134333412"
    },
    history: [],
    nextHandlerId: ""
  }
]);
