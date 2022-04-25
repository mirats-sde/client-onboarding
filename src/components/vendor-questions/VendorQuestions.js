import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { db } from "../../firebase-config";
import styles from "./VendorQuestion.module.css";
import { useHistory } from "react-router-dom";

const questionTypes = [
  "registration-attributes",
  "registration-identities",
  "registration-requirements",
  "registration-validation",
  "quality-checks",
  "business-model",
  "panel-type",
  "recruitment-method",
  "traffic-sources",
  "communication",
  "incentive-model",
];

const VendorQuestions = ({
  questionData,
  regattributes,
  setRegattributes,
  // deocdeID,
}) => {
  // const [x, setX] = useState(null);
  // console.log(x);
  const history = useHistory();
  const { id } = useParams();
  const { questionType } = useParams();
  const { sid } = useParams();

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  let decode_id = hashids.decode(id);
  // console.log(decode_id[0]);

  // console.log(questionData);
  // console.log(regattributes);
  // console.log(deocdeID);

  const handleFormSubmit = async (e, index) => {
    e.preventDefault();
    // console.log("handle form submit");
    await setDoc(
      doc(db, "supply_partners", String(decode_id[0])),
      regattributes,
      {
        merge: true,
      }
    )
      .then(() => {
        // console.log("data uploaded successfully");
        if (index === 10) {
          // console.log("we are at end");
        } else if (index >= 4) {
          history.push(
            `/vendor-business-model/${questionTypes[index + 1]}/${id}/${sid}`
          );
        } else {
          history.push(
            `/vendor-quality-checks/${questionTypes[index + 1]}/${id}/${sid}`
          );
        }
      })
      .catch((err) => {
        // console.log(err.message);
      });
  };

  const handleBack = async (e, index) => {
    e.preventDefault();
    if (index == 0) {
      history.push(`/vendor-sales-accounts/${id}/${sid}`);
    } else if (index <= 5) {
      history.push(
        `/vendor-quality-checks/${questionTypes[index - 1]}/${id}/${sid}`
      );
    } else {
      history.push(
        `/vendor-business-model/${questionTypes[index - 1]}/${id}/${sid}`
      );
    }
  };

  return (
    <>
      <div className={styles.question_container}>
        <div className={styles.vendor_questions_form}>
          {questionData.map((quedata, index) => (
            <div className={styles.container} key={index}>
              <form>
                <div className={styles.question}>
                  <p>
                    {quedata.questionText}
                    <span>{quedata.questionWarning}</span>
                  </p>
                  <div className={styles.question_label}>
                    <label>{quedata.questionLabel}</label>
                  </div>
                  <input
                    type="text"
                    value={quedata.questionAnswer}
                    name={quedata.questionName}
                    onChange={(e) => {
                      setRegattributes({
                        ...regattributes,
                        [quedata.questionObj]: {
                          ...regattributes?.[quedata.questionObj],
                          [e.target.name]: e.target.value,
                        },
                      });
                    }}
                  />
                </div>
              </form>
            </div>
          ))}
          <div className={styles.btns}>
            <div className={styles.back}>
              {questionTypes.map((q, index) => {
                if (questionType === q) {
                  return (
                    <button
                      className={styles.btnBack}
                      onClick={(e) => {
                        handleBack(e, index);
                      }}
                    >
                      BACK
                    </button>
                  );
                }
              })}
            </div>
            <div className={styles.next}>
              {questionTypes.map((q, index) => {
                if (questionType === q) {
                  if (index == 10) {
                    return (
                      <button
                        className={styles.btnNext}
                        type="submit"
                        onClick={(e) => {
                          handleFormSubmit(e, index);
                        }}
                      >
                        SAVE
                      </button>
                    );
                  } else {
                    return (
                      <button
                        className={styles.btnNext}
                        type="submit"
                        onClick={(e) => handleFormSubmit(e, index)}
                      >
                        NEXT
                      </button>
                    );
                  }
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorQuestions;
{
  /* <form>
  <div className={styles.question}>
    <p>
      {quedata.questionText}
      <span>{quedata.questionWarning}</span>
    </p>
    <div className={styles.question_label}>
      <label>{quedata.questionLabel}</label>
    </div>
    <input type="text" />
  </div>
</form>; */
}
