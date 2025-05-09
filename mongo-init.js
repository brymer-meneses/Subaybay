// https://www.mongodb.com/docs/mongodb-shell/reference/methods/
db = new Mongo().getDB("subaybay");

// [id, title, prepares]
basicCerts = [
  ["coe", "Certificate of Enrollment", "Certifications"],
  ["cge", "Certificate of Grade Equivalence", "Certifications"],
  ["cg", "Certificate of Graduation", "Certifications"],
  ["cmi", "Certificate of Medium of Instruction", "Certifications"],
  ["gmc", "Certificate of No Disciplinary Case (GMC)", "Certifications"],
  [
    "cnhdg",
    "Certificate of Non-Issuance of Honorable Dismissal for Graduates",
    "Certifications",
  ],
  ["cue", "Certificate of Units Earned", "Certifications"],
  ["cft", "Certificate of Free Tuition", "Certifications"],
  ["cnstpsn", "Certificate of NSTP Serial No.", "Certifications"],
  ["cnson", "Certificate of No S.O. Number", "Certifications"],
  ["ctc", "Certificate of Transfer Credential", "Certifications"],
  ["tcg", "True Copy of Grades", "Certifications"],
  ["cd", "Course Description", "Certifications"],
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
    deprecated: false,
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
    deprecated: false,
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
    ],
  },
  {
    _id: "otr2",
    title: "Official Transcript of Records (OTR) - Second Request",
    version: 1,
    deprecated: false,
    stages: [
      {
        stageTitle: "Newly Created Request",
        defaultHandlerId: "",
      },
      {
        stageTitle: "Print and Sign OTR",
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
        stageTitle: "Signature of University Registrar",
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
    ],
  },
  {
    _id: "wes",
    title: "WES",
    version: 1,
    deprecated: false,
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
        defaultHandlerId: "",
      },
      {
        stageTitle: "Preparation of WES", //staff 2
        defaultHandlerId: "",
      },
      {
        stageTitle: "University Registrar Signature (WES Verification)",
        defaultHandlerId: "",
      },
      {
        stageTitle: "Notify Requester",
        defaultHandlerId: "",
      },
    ],
  },
  {
    _id: "cav",
    title: "Certification, Authentication and Verification",
    version: 1,
    deprecated: false,
    stages: [
      {
        stageTitle: "Newly Created Request",
        defaultHandlerId: "",
      },
      {
        stageTitle: "Preparation of CTC Diploma",
        defaultHandlerId: "",
      },
      {
        stageTitle: "University Registrar Signature (CTC Diploma)",
        defaultHandlerId: "",
      },
      {
        stageTitle: "Preparation of CTC Diploma Translation", // staff 1
        defaultHandlerId: "",
      },
      {
        stageTitle: "University Registrar Signature (CTC Diploma Translation)", // staff 1
        defaultHandlerId: "",
      },
      {
        stageTitle: "Preparation of OTR", // staff 2
        defaultHandlerId: "",
      },
      {
        stageTitle: "Preparation of CAV",
        defaultHandlerId: "",
      },
      {
        stageTitle: "University Registrar Signature", // staff 1
        defaultHandlerId: "",
      },
      {
        stageTitle: "Notify Requester",
        defaultHandlerId: "",
      },
    ],
  },
]);

