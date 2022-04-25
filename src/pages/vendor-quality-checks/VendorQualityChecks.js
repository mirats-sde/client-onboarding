import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import VendorProgress from "../../components/vendor-progress/VendorProgress";
import VendorQuestions from "../../components/vendor-questions/VendorQuestions";
import styles from "./VendorQualityChecks.module.css";
import cx from "classnames";
import { db } from "../../firebase-config";
import { Link } from "react-router-dom";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import Error from "../../components/error/Error";

const left = [
  {
    name: "Registration Attributes",
    value: "registration-attributes",
  },
  {
    name: "Registration Identities",
    value: "registration-identities",
  },
  {
    name: "Registration Requirements",
    value: "registration-requirements",
  },
  {
    name: "Registration Validation",
    value: "registration-validation",
  },
  {
    name: "Quality Checks",
    value: "quality-checks",
  },
];

const VendorQualityChecks = () => {
  const [regattributes, setRegattributes] = useState();

  const { questionType } = useParams();
  const { id } = useParams();
  const { sid } = useParams();
  const [flag, setFlag] = useState(true);

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  let decode_id = hashids.decode(id);
  let decode_sid = hashids.decode(sid);

  let encode_id = hashids.encode(id);
  let encode_sid = hashids.encode(sid);
  // console.log(encode_id);
  // console.log(encode_sid);

  //check whether the first id exist or not:
  async function checkID(id, sid) {
    // console.log("checking ids");
    const Hashids = require("hashids/cjs");
    const hashids = new Hashids("client-vendor");
    const q = query(
      collection(db, "supply_partners"),
      where("id", "==", decode_id[0]),
      where("sid", "==", decode_sid[0])
    );
    const querysnapshot = await getDocs(q);
    if (querysnapshot.docs.length != 0) {
      setFlag(true);
      setRegattributes(querysnapshot.docs[0].data());
    } else {
      setRegattributes();
    }
  }

  // console.log(regattributes);

  useEffect(() => {
    checkID(id, sid);
  }, []);

  //registration attributes:
  const regAttributes = [
    {
      questionText: "Mandatory Registration Attributes",
      questionLabel:
        "How many attributes are required for a user to join or become an active user eligible for surveys?",
      questionWarning: "preferred",
      questionName: "Mandatory_Registration_Attributes",
      questionAnswer:
        regattributes?.Registration_Attributes
          ?.Mandatory_Registration_Attributes,
      questionObj: "Registration_Attributes",
    },
    {
      questionText: "Minimum Registration Information Requirements",
      questionLabel:
        "What Are The Minimum Pieces Of Information required for registration? Please List All.",
      questionWarning: "preferred",
      questionName: "Minimum_Registration_Information_Requirements",
      questionAnswer:
        regattributes?.Registration_Attributes
          ?.Minimum_Registration_Information_Requirements,
      questionObj: "Registration_Attributes",
    },
    {
      questionText: "Verification Of Minimum Attributes",
      questionLabel:
        "Do you have procedures in place for verifying the minimum attributes? Please describe.",
      questionWarning: "preferred",
      questionName: "Verification_Of_Minimum_Attributes",
      questionAnswer:
        regattributes?.Registration_Attributes
          ?.Verification_Of_Minimum_Attributes,
      questionObj: "Registration_Attributes",
    },
  ];

  //registration identities
  const regIdentities = [
    {
      questionText: "Post code Format Verification",
      questionLabel:
        "Do you have procedures in place to verify post code? Please describe.",
      questionWarning: "preferred",
      questionName: "Post_code_Format_Verification",
      questionAnswer:
        regattributes?.Registration_Identities?.Post_code_Format_Verification,
      questionObj: "Registration_Identities",
    },
    {
      questionText: "Linking Accounts",
      questionLabel:
        "Do you have checks in please to flag linked members, based on cookie technology, that are potential duplicates? Please describe.",
      questionWarning: "preferred",
      questionName: "Linking_Accounts",
      questionAnswer: regattributes?.Registration_Identities?.Linking_Accounts,
      questionObj: "Registration_Identities",
    },
    {
      questionText: "Email-Duplication",
      questionLabel:
        "Do you have checks in place to prevents duplicate emails from registering? Please describe.",
      questionWarning: "preferred",
      questionName: "Email_Duplication",
      questionAnswer: regattributes?.Registration_Identities?.Email_Duplication,
      questionObj: "Registration_Identities",
    },
  ];

  //registration requirements:
  const regRequirements = [
    {
      questionText: "Email Validation",
      questionLabel:
        "Do you have checks for to validate correct email format? Please describe.",
      questionWarning: "preferred",
      questionName: "Email_Validation",
      questionAnswer:
        regattributes?.Registration_Requirements?.Email_Validation,
      questionObj: "Registration_Requirements",
    },
    {
      questionText: "DOI",
      questionLabel:
        "Is your panel Single or Double Opted in? If you do not have your own panel please respond based on your publisher's set up",
      questionWarning: "preferred",
      questionName: "DOI",
      questionAnswer: regattributes?.Registration_Requirements?.DOI,
      questionObj: "Registration_Requirements",
    },
    {
      questionText: "Email Domain Blocklist",
      questionLabel:
        "Do you have a check in place for comparing user email domains against known problematic domains? Please describe.",
      questionWarning: "preferred",
      questionName: "Email_Domain_Blocklist",
      questionAnswer:
        regattributes?.Registration_Requirements?.Email_Domain_Blocklist,
      questionObj: "Registration_Requirements",
    },
  ];

  //registration validation:
  const regValidation = [
    {
      questionText: "Registration Captcha",
      questionLabel:
        "Do you have a registration captcha in place? Please describe.",
      questionWarning: "preferred",
      questionName: "Registration_Captcha",
      questionAnswer:
        regattributes?.Registration_Validation?.Registration_Captcha,
      questionObj: "Registration_Validation",
    },
    {
      questionText: "Unique Quick Check",
      questionLabel:
        "Do you have checks in place for confirming if a user's information is unique? Please describe.",
      questionWarning: "preferred",
      questionName: "Unique_Quick_Check",
      questionAnswer:
        regattributes?.Registration_Validation?.Unique_Quick_Check,
      questionObj: "Registration_Validation",
    },
    {
      questionText: "Minimum Age Check",
      questionLabel:
        "Do you have a check in place for age range within a given country / culture? Please describe.",
      questionWarning: "preferred",
      questionName: "Minimum_Age_Check",
      questionAnswer: regattributes?.Registration_Validation?.Minimum_Age_Check,
      questionObj: "Registration_Validation",
    },
  ];

  //quality checks
  const qualityChecks = [
    {
      questionText: "3rd Party Address & Validation",
      questionLabel:
        "Do you have a check in place that validates user information- specifically address,first name, last name, and birth date in US and CA. Please describe.",
      questionWarning: "preferred",
      questionName: "Party_Address_Validation",
      questionAnswer: regattributes?.Quality_Checks?.Party_Address_Validation,
      questionObj: "Quality_Checks",
    },
    {
      questionText: "Unique Full Check",
      questionLabel:
        "Do you have a check in place that validate the full user information given (i.e. unique first name, stripped email username, ip address, full address, last name, postal code, birthdate, and country), with different combinations of the data? Please describe.",
      questionWarning: "preferred",
      questionName: "Quality_Unique_Full_Check",
      questionAnswer: regattributes?.Quality_Checks?.Quality_Unique_Full_Check,
      questionObj: "Quality_Checks",
    },
    {
      questionText: "Quality Check",
      questionLabel:
        "Please outline the details around the fraud/quality check you conducts during a users lifetime.",
      questionWarning: "preferred",
      questionName: "Quality_Check",
      questionAnswer: regattributes?.Quality_Checks?.Quality_Check,
      questionObj: "Quality_Checks",
    },
  ];

  return (
    <>
      {regattributes !== undefined ? (
        <div className={styles.vendor_onboarding}>
          <div className={styles.left_pages}>
            {left.map((l) => {
              return (
                <div className={styles.pages}>
                  <h2
                    className={cx(styles.light, {
                      [styles.active]:
                        questionType === l?.value ? styles.active : "",
                    })}
                  >
                    {l.name}
                  </h2>
                  <div className={styles.circle_wrapper}>
                    <div
                      className={cx(styles.circle, {
                        [styles.active_circle]: questionType === l?.value,
                      })}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.question_container}>
            <div className={styles.text_progress}>
              <div className={styles.vendor_text}>
                <h2>Vendor Onboarding</h2>
                <span>Quality Checks</span>
              </div>
              <div className={styles.onboarding_process}>
                {(() => {
                  switch (questionType) {
                    case "registration-attributes":
                      return <VendorProgress vendorProgress="20" />;
                    case "registration-identities":
                      return <VendorProgress vendorProgress="40" />;
                    case "registration-requirements":
                      return <VendorProgress vendorProgress="60" />;
                    case "registration-validation":
                      return <VendorProgress vendorProgress="80" />;
                    case "quality-checks":
                      return <VendorProgress vendorProgress="100" />;
                    default:
                  }
                })()}
              </div>
            </div>
            <div className={styles.questions}>
              {(() => {
                switch (questionType) {
                  case "registration-attributes":
                    return (
                      <VendorQuestions
                        questionData={regAttributes}
                        regattributes={regattributes}
                        setRegattributes={setRegattributes}
                      />
                    );
                  case "registration-identities":
                    return (
                      <VendorQuestions
                        questionData={regIdentities}
                        regattributes={regattributes}
                        setRegattributes={setRegattributes}
                      />
                    );
                  case "registration-requirements":
                    return (
                      <VendorQuestions
                        questionData={regRequirements}
                        regattributes={regattributes}
                        setRegattributes={setRegattributes}
                      />
                    );
                  case "registration-validation":
                    return (
                      <VendorQuestions
                        questionData={regValidation}
                        regattributes={regattributes}
                        setRegattributes={setRegattributes}
                      />
                    );
                  case "quality-checks":
                    return (
                      <VendorQuestions
                        questionData={qualityChecks}
                        regattributes={regattributes}
                        setRegattributes={setRegattributes}
                      />
                    );
                  default:
                }
              })()}
            </div>
          </div>
          {/* buttons */}
        </div>
      ) : (
        <>
          <Error />
        </>
      )}
    </>
  );
};

export default VendorQualityChecks;
