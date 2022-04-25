import logo from "../../assets/logo.png";
import styles from "../../utils/formHelper.module.css";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import { Link } from "react-router-dom";
import value from "../../assets/value.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import ProgressBar from "../../components/progress-bar/ProgressBar";
import { db } from "../../firebase-config";
import storage from "../../firebase-config";
import { useParams } from "react-router-dom";
import Hashids from "hashids";
import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import Error from "../../components/error/Error";

import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";
import { decode } from "punycode";
import encUtf16 from "crypto-js/enc-utf16";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const helperCardData = [
  {
    helperLogo: value,
    helperTitle: "Significance & Value",
    helperDesc:
      "Information that is routinely found on business correspondence and reports, and in contact databases.",
  },
];

const BusinessInfo = () => {
  const history = useHistory();
  const [businessInfo, setbusinessInfo] = useState();
  const [phoneNumber, setPhoneNumber] = useState("");

  //business info:
  useEffect(() => {
    // console.log(businessInfo);
  }, [businessInfo]);

  //first id:
  const { id } = useParams();

  //second id:
  const { sid } = useParams();

  let [flag, setFlag] = useState(false);

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  // console.log(id);
  // console.log(sid);
  let decode_id = hashids.decode(id);
  // console.log("decoded id=>", decode_id);
  let decode_sid = hashids.decode(sid);
  // console.log("decoded sid=>", decode_sid);

  let decod = hashids.encode(id);
  // console.log(decod);

  let decodeid = hashids.encode(sid);
  // console.log(decodeid);

  //check whether the id exists or not:
  async function checkID(id, sid) {
    const Hashids = require("hashids/cjs");
    const hashids = new Hashids("client-vendor");

    // console.log(decode_id[0]);
    // console.log(decode_sid[0]);
    const q = query(
      collection(db, "Organisation"),
      where("id", "==", decode_id[0]),
      where("sid", "==", decode_sid[0])
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length != 0) {
      setFlag(true);
      setbusinessInfo(querySnapshot.docs[0].data());
    } else {
      setbusinessInfo();
    }
  }

  // console.log(businessInfo);

  useEffect(() => {
    // console.log("in use effect", id);
    checkID(id, sid);
  }, []);

  useEffect(() => {
    if (flag) {
      // console.log("id found");
    } else {
      // console.log("id not found");
    }
  }, [flag]);

  //submit the form:
  async function handleFormSubmit(e) {
    e.preventDefault();

    // uploading all documents from here
    await setDoc(doc(db, "Organisation", String(decode_id[0])), businessInfo, {
      merge: true,
    })
      .then(() => {
        // console.log("data updated successfully");
        history.push(`/documents-links/${id}/${sid}`);
      })
      .catch((er) => {
        // console.log("error", er);
      });
  }

  return (
    <>
      {/* <Header/> */}
      {businessInfo != undefined ? (
        <div className={styles.onboarding}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <ProgressBar progress="50" />
          <div className={styles.onboarding_text}>
            <h1>Client Onboarding</h1>
            <p>Key step to understand your expectations</p>
          </div>
          <section className={styles.text_form}>
            <div className={styles.left_text}>
              <h1>Business Contact Information</h1>
              <p>This information will be visible all across our console</p>
              <div className={styles.inputHelperCard}>
                {helperCardData.map((data, i) => (
                  <div key={i}>
                    <InputHelperCard
                      helperTitle={data.helperTitle}
                      helperDesc={data.helperDesc}
                      helperLogo={data.helperLogo}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.right_form}>
              <div className={styles.client_form}>
                <form onSubmit={handleFormSubmit}>
                  {/* contact name */}
                  <div className={styles.input_group}>
                    <div className={styles.label}>
                      <label>
                        Business Contact Name
                        <span className={styles.required}>Required</span>
                      </label>
                    </div>
                    <div className={styles.inputs}>
                      <input
                        type="text"
                        placeholder="Global Media"
                        className={styles.input}
                        value={
                          businessInfo?.business_contact_info?.contact_name
                        }
                        onChange={(e) => {
                          setbusinessInfo({
                            ...businessInfo,
                            business_contact_info: {
                              ...businessInfo?.business_contact_info,
                              contact_name: e.target.value,
                            },
                          });
                        }}
                        required
                      />
                    </div>
                  </div>
                  {/* contact mobile no */}
                  <div className={styles.input_group}>
                    <div className={styles.label}>
                      <label>
                        Business Contact Mobile No.
                        <span className={styles.required}>Required</span>
                      </label>
                    </div>
                    {/* <div className={styles.inputs}> */}
                    <div className={styles.phoneNo}>
                      <PhoneInput
                        inputExtraProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                        }}
                        country={"in"}
                        value={businessInfo?.business_contact_info?.mobileno}
                        onChange={(e) => {
                          setbusinessInfo({
                            ...businessInfo,
                            business_contact_info: {
                              ...businessInfo?.business_contact_info,
                              mobileno: e,
                            },
                          });
                        }}
                        containerStyle={{
                          width: "100%",
                          border: "1px solid #959393",
                          borderRadius: "6px",
                        }}
                        inputStyle={{
                          width: "100%",
                          height: "45px",
                        }}
                      />
                    </div>
                    {/* </div> */}
                  </div>
                  {/* contact email */}
                  <div className={styles.input_group}>
                    <div className={styles.label}>
                      <label>
                        Business Contact Email
                        <span className={styles.required}>Required</span>
                      </label>
                    </div>
                    <div className={styles.inputs}>
                      <input
                        type="email"
                        // placeholder="Global Media"
                        placeholder="globalmedia.offices@globalmedia.com"
                        className={styles.input}
                        value={businessInfo?.business_contact_info?.email}
                        onChange={(e) => {
                          setbusinessInfo({
                            ...businessInfo,
                            business_contact_info: {
                              ...businessInfo?.business_contact_info,
                              email: e.target.value,
                            },
                          });
                        }}
                        required
                      />
                    </div>
                  </div>
                  {/* comp website */}
                  <div className={styles.input_group}>
                    <div className={styles.label}>
                      <label>
                        Company Website Address
                        <span className={styles.required}>Required</span>
                      </label>
                    </div>
                    <div className={styles.inputs}>
                      <input
                        type="url"
                        // placeholder="globalmedia.offices@globalmedia.com"
                        placeholder="globalmedia.offices.com"
                        className={styles.input}
                        value={businessInfo?.business_contact_info?.website_add}
                        onChange={(e) => {
                          setbusinessInfo({
                            ...businessInfo,
                            business_contact_info: {
                              ...businessInfo?.business_contact_info,
                              website_add: e.target.value,
                            },
                          });
                        }}
                        required
                      />
                    </div>
                  </div>
                  {/* data protection */}
                  <div className={styles.input_group}>
                    <div className={styles.label}>
                      <label>
                        Company Data Protection Officer (email)
                        <span className={styles.optional}>optional</span>
                      </label>
                    </div>
                    <div className={styles.inputs}>
                      <input
                        type="email"
                        placeholder="globalmedia.offices@globalmedia.com"
                        className={styles.input}
                        value={
                          businessInfo?.business_contact_info
                            ?.data_protection_email
                        }
                        onChange={(e) => {
                          setbusinessInfo({
                            ...businessInfo,
                            business_contact_info: {
                              ...businessInfo?.business_contact_info,
                              data_protection_email: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  {/* comp info security */}
                  <div className={styles.input_group}>
                    <div className={styles.label}>
                      <label>
                        Company Information Security (email)
                        <span className={styles.optional}>optional</span>
                      </label>
                    </div>
                    <div className={styles.inputs}>
                      <input
                        type="email"
                        // placeholder="globalmedia.offices.com"
                        placeholder="globalmedia.offices@globalmedia.com"
                        className={styles.input}
                        value={
                          businessInfo?.business_contact_info
                            ?.information_security_email
                        }
                        onChange={(e) => {
                          setbusinessInfo({
                            ...businessInfo,
                            business_contact_info: {
                              ...businessInfo?.business_contact_info,
                              information_security_email: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.next}>
                    {/* <Link to="/documents-links"> */}
                    <button className={styles.btnNext} type="submit">
                      NEXT
                    </button>
                    {/* </Link> */}
                  </div>
                </form>
              </div>
              {/* next button */}
            </div>
          </section>
        </div>
      ) : (
        <>
          <Error />
        </>
      )}
    </>
  );
};

export default BusinessInfo;
