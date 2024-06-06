// https://www.mongodb.com/docs/mongodb-shell/reference/methods/
db = new Mongo().getDB("subaybay");

db.users.insertMany([
  {
    _id: "sampleid1",
    name: "Yuumi",
    email: "yuumi@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/yuumi.png",
    isAdmin: false,
  },
  {
    _id: "sampleid2",
    name: "Smolder",
    email: "smolder@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/smolder.png",
    isAdmin: true,
  },
  {
    _id: "sampleid3",
    name: "Gnar",
    email: "gnar@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/gnar.png",
    isAdmin: true,
  },
  {
    _id: "sampleid4",
    name: "Aurelion Sol",
    email: "sol@lol.com",
    profileUrl:
      "https://www.mobafire.com/images/champion/square/aurelion-sol.png",
    isAdmin: false,
  },
  {
    _id: "sampleid5",
    name: "Kog' Maw",
    email: "kogmaw@lol.com",
    profileUrl: "https://www.mobafire.com/images/champion/square/kogmaw.png",
    isAdmin: false,
  },
]);

// [id, title, prepares]
basicCerts = [
  ["coe", "Certificate of Enrollment", "certifications"],
  ["cge", "Certificate of Grade Equivalence", "certifications"],
  ["cg", "Certificate of Graduation", "certifications"],
  ["cmi", "Certificate of Medium of Instruction", "certifications"],
  ["gmc", "Certificate of No Disciplinary Case (GMC)", "certifications"],
  ["cnhdg", "Certificate of Non-Issuance of Honorable Dismissal for Graduates", "certifications"],
  ["cue", "Certificate of Units Earned", "certifications"],
  ["cft", "Certificate of Free Tuition", "certifications"],
  ["cnstpsn", "Certificate of NSTP Serial No.", "certifications"],
  ["cnson", "Certificate of No S.O. Number", "certifications"],
  ["ctc", "Certificate of Transfer Credential", "certifications"],
  ["tcg", "True Copy of Grades", "certifications"],
  ["cd", "Course Description", "certifications"],
  ["ctcotr", "Authentication of OTR", "CTC OTR"],
  ["ctcd", "Authentication of Diploma", "CTC Diploma"],
  ["dt", "Diploma Translation", "Diploma Translation"],
  ["cttd", "Certified True Text of Diploma", "2nd copy of diploma"],
  ["hd", "Honorable Dismissal", "HD and GMC"],
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
        stageTitle: "Prepare " + item[2],
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
  },
  {
    _id: "wes",
    title: "WES",// todo find out what this means
    version: 1,
    stages: [
      {
        stageTitle: "Newly Created Request",
        defaultHandlerId: "",
      },
      {
        stageTitle: "Preparation of OTR", //staff 2
        defaultHandlerId: "",
      },
      {
        stageTitle: "University Registrar Signature (OTR)",
        defaultHandlerId: ""
      },
      {
        stageTitle: "Preparation of WES", //staff 2
        defaultHandlerId: ""
      },
      {
        stageTitle: "University Registrar Signature (WES Verification)",
        defaultHandlerId: ""
      },
      {
        stageTitle: "Notify Requester",
        defaultHandlerId: ""
      }
    ],
  },
  {
    _id: "cav",
    title: "Certification, Authentication and Verification",
    version: 1,
    stages: [
      {
        stageTitle: "Newly Created Request",
        defaultHandlerId: ""
      },
      {
        stageTitle: "Preparation of CTC Diploma",
        defaultHandlerId: ""
      },
      {
        stageTitle: "University Registrar Signature (CTC Diploma)",
        defaultHandlerId: ""
      },
      {
        stageTitle: "Preparation of CTC Diploma Translation", // staff 1
        defaultHandlerId: ""
      },
      {
        stageTitle: "University Registrar Signature (CTC Diploma Translation)", // staff 1
        defaultHandlerId: ""
      },
      {
        stageTitle: "Preparation of OTR", // staff 2
        defaultHandlerId: ""
      },
      {
        stageTitle: "Preparation of CAV",
        defaultHandlerId: ""
      },
      {
        stageTitle: "University Registrar Signature", // staff 1
        defaultHandlerId: ""
      },
      {
        stageTitle: "Notify Requester",
        defaultHandlerId: ""
      },
   ]
  }
]);