import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import cx from "classnames";
import { Link } from "react-router-dom";
import VendorQuestions from "../../components/vendor-questions/VendorQuestions";
import VendorProgress from "../../components/vendor-progress/VendorProgress";
import styles from "./VendorBusinessModel.module.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { decode } from "@firebase/util";
import { db } from "../../firebase-config";
import Error from "../../components/error/Error";

const left = [
  {
    name: "Business Model",
    value: "business-model",
  },
  {
    name: "Panel Type",
    value: "panel-type",
  },
  {
    name: "Recruitment Method",
    value: "recruitment-method",
  },
  {
    name: "Traffic Sources",
    value: "traffic-sources",
  },
  {
    name: "Communication",
    value: "communication",
  },
  {
    name: "Incentive Model",
    value: "incentive-model",
  },
];

const businessModelQues = [
  "business-model",
  "panel-type",
  "recruitment-method",
  "traffic-sources",
  "communication",
  "incentive-model",
];

const VendorBusinessModel = () => {
  const { questionType } = useParams();
  const [regattributes, setRegattributes] = useState();
  const [flag, setFlag] = useState(true);
  const { id } = useParams();
  const { sid } = useParams();

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  let decode_id = hashids.decode(id);
  let deocode_sid = hashids.decode(sid);

  //check whether the id exists or not:
  async function checkID(id, sid) {
    // console.log("checking ids");
    const Hashids = require("hashids/cjs");
    const hashids = new Hashids("client-vendor");
    const q = query(
      collection(db, "supply_partners"),
      where("id", "==", decode_id[0]),
      where("sid", "==", deocode_sid[0])
    );
    const querysnapshot = await getDocs(q);
    if (querysnapshot.docs.length != 0) {
      setFlag(true);
      setRegattributes(querysnapshot.docs[0].data());
    } else {
      setRegattributes();
    }
  }

  useEffect(() => {
    checkID(id, sid);
  }, []);

  // console.log(regattributes);
  // console.log(decode_id[0]);

  //business model:
  const businessModel = [
    {
      questionLabel: "How does the partner generate revenue?",
      questionWarning: "preferred",
      questionName: "partner_generate_revenue",
      questionAnswer: regattributes?.Business_Model?.partner_generate_revenue,
      questionObj: "Business_Model",
    },
    {
      questionLabel:
        "What is the partner's value proposition to attract consumers i.e. Is the partner a panel company, student site for discount or community?",
      questionWarning: "preferred",
      questionName: "partners_value_proposition",
      questionAnswer: regattributes?.Business_Model?.partners_value_proposition,
      questionObj: "Business_Model",
    },
    {
      questionLabel:
        "Does the partner need unique survey opportunities? Is there mystery shopping, digital tracking, test products, online services, websites ratings, etc.?",
      questionWarning: "preferred",
      questionName: "unique_survey_opportunities",
      questionAnswer:
        regattributes?.Business_Model?.unique_survey_opportunities,
      questionObj: "Business_Model",
    },
  ];

  //panel type:
  const panelType = [
    {
      questionLabel:
        "Is the partner's panel proprietary (managed by the partner) or is the partner using other partner panels in aggregate?",
      questionWarning: "preferred",
      questionName: "partners_panel_proprietary",
      questionAnswer: regattributes?.Panel_Type?.partners_panel_proprietary,
      questionObj: "Panel_Type",
    },
  ];

  //Recruitement method:
  const recruitmentMethod = [
    {
      questionLabel: "What is the partner's recruitment method?",
      questionWarning: "preferred",
      questionName: "partners_recruitment_method",
      questionAnswer:
        regattributes?.Recruitment_Method?.partners_recruitment_method,
      questionObj: "Recruitment_Method",
    },
    {
      questionLabel: "What is the marketing message?",
      questionWarning: "preferred",
      questionName: "marketing_message",
      questionAnswer: regattributes?.Recruitment_Method?.marketing_message,
      questionObj: "Recruitment_Method",
    },
    {
      questionLabel: "Describe the registration process.",
      questionWarning: "preferred",
      questionName: "Describe_registration_process",
      questionAnswer:
        regattributes?.Recruitment_Method?.Describe_registration_process,
      questionObj: "Recruitment_Method",
    },
  ];

  //traffic sources:
  const trafficSources = [
    {
      questionLabel:
        "What is the partner's traffice source? i.e. Affiliate Networks, Direct Purchasing of Online Inventory (Google Ads, Social Media), Agencies, Gaming Platforms (CandyCrush)?",
      questionWarning: "preferred",
      questionName: "partners_traffice_source",
      questionAnswer: regattributes?.Traffic_Sources?.partners_traffice_source,
      questionObj: "Traffic_Sources",
    },
    {
      questionLabel:
        "What online or mobile sources are used to the partner's site to acquire traffic/members?",
      questionWarning: "preferred",
      questionObj: "Traffic_Sources",
      questionName: "online_or_mobile_sources",
      questionAnswer: regattributes?.Traffic_Sources?.online_or_mobile_sources,
    },
    {
      questionLabel: "Describe the registration process. ",
      questionWarning: "preferred",
      questionObj: "Traffic_Sources",
      questionName: "the_registration_process",
      questionAnswer: regattributes?.Traffic_Sources?.the_registration_process,
    },
  ];

  //communication
  const communication = [
    {
      questionLabel:
        "What is the method of communication to the partner's panelists? What is the frequency? ",
      questionWarning: "preferred",
      questionObj: "Communication",
      questionName: "method_of_communication",
      questionAnswer: regattributes?.Communication?.method_of_communication,
    },
  ];

  //incentive model
  const incentiveModel = [
    {
      questionLabel:
        "What incentives are paid to the partner's panelists for their opinion? Please include threshold amounts, time for delivery, incentive options.",
      questionWarning: "preferred",
      questionName: "incentives_paid_to_partners_panelists",
      questionAnswer:
        regattributes?.Incentive_Model?.incentives_paid_to_partners_panelists,
      questionObj: "Incentive_Model",
    },
  ];

  return (
    <>
      {regattributes != undefined ? (
        <div className={styles.vendor_onboarding}>
          <div className={styles.flex}>
            <div className={styles.left_pages}>
              {left.map((l) => {
                // console.log(questionType === l?.value);
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
                  <span>Business Model Questions</span>
                </div>
                <div className={styles.onboarding_process}>
                  {(() => {
                    switch (questionType) {
                      case "business-model":
                        return <VendorProgress vendorProgress="15" />;
                      case "panel-type":
                        return <VendorProgress vendorProgress="30" />;
                      case "recruitment-method":
                        return <VendorProgress vendorProgress="45" />;
                      case "traffic-sources":
                        return <VendorProgress vendorProgress="60" />;
                      case "communication":
                        return <VendorProgress vendorProgress="75" />;
                      case "incentive-model":
                        return <VendorProgress vendorProgress="100" />;
                      default:
                    }
                  })()}
                </div>
              </div>
              <div className={styles.questions}>
                {(() => {
                  switch (questionType) {
                    case "business-model":
                      return (
                        <VendorQuestions
                          questionData={businessModel}
                          regattributes={regattributes}
                          setRegattributes={setRegattributes}
                        />
                      );
                    case "panel-type":
                      return (
                        <VendorQuestions
                          questionData={panelType}
                          regattributes={regattributes}
                          setRegattributes={setRegattributes}
                        />
                      );
                    case "recruitment-method":
                      return (
                        <VendorQuestions
                          questionData={recruitmentMethod}
                          regattributes={regattributes}
                          setRegattributes={setRegattributes}
                        />
                      );
                    case "traffic-sources":
                      return (
                        <VendorQuestions
                          questionData={trafficSources}
                          regattributes={regattributes}
                          setRegattributes={setRegattributes}
                        />
                      );
                    case "communication":
                      return (
                        <VendorQuestions
                          questionData={communication}
                          regattributes={regattributes}
                          setRegattributes={setRegattributes}
                        />
                      );
                    case "incentive-model":
                      return (
                        <VendorQuestions
                          questionData={incentiveModel}
                          regattributes={regattributes}
                          setRegattributes={setRegattributes}
                        />
                      );
                    default:
                  }
                })()}
              </div>
              {/* buttons */}
              {/* <div className={styles.btns}>
              <div className={styles.back}>
                {businessModelQues.map((businessQ, index) => {
                  if (questionType === businessQ) {
                    return (
                      <Link
                        to={`/vendor-business-model/${
                          businessModelQues[index - 1]
                        }/${id}/${sid}`}
                      >
                        <button className={styles.btnBack}>BACK</button>
                      </Link>
                    );
                  }
                })}
              </div>
              <div className={styles.next}>
                {businessModelQues.map((businessQ, index) => {
                  if (questionType === businessQ) {
                    return (
                      <Link
                        to={`/vendor-business-model/${
                          businessModelQues[index + 1]
                        }/${id}/${sid}`}
                      >
                        <button className={styles.btnNext}>NEXT</button>
                      </Link>
                    );
                  }
                })}
              </div>
            </div> */}
            </div>
          </div>
        </div>
      ) : (
        <>
          <Error />
        </>
      )}
    </>
  );
};

export default VendorBusinessModel;

// https://stackoverflow.com/questions/47987137/props-data-map-does-not-work-in-my-component
