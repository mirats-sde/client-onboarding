import logo from "../../assets/logo.png";
import styles from "../../utils/formHelper.module.css";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import ProgressBar from "../../components/progress-bar/ProgressBar";
import value from "../../assets/value.png";
import PhoneInput from "react-phone-input-2";
import { Link, useParams } from "react-router-dom";
import { db } from "../../firebase-config";
import { useDebugValue, useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
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
  snapshotEqual,
} from "firebase/firestore";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Error from "../../components/error/Error";
import Loader from "../loader/Loader";

const helperCardData = [
  {
    helperLogo: value,
    helperTitle: "Significance & Value",
    helperDesc:
      "Information that is routinely found on business correspondence and reports, and in contact databases.",
  },
];

const VendorBusinessInfo = () => {
  const history = useHistory();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vendor_businessInfo, setvendor_businessInfo] = useState();
  let [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(true);

  //vendor_entityInfo:
  useEffect(() => {}, [vendor_businessInfo]);

  //first id:
  const { id } = useParams();

  //second id:
  const { sid } = useParams();

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  let decode_id = hashids.decode(id);
  let decode_sid = hashids.decode(sid);

  //check whether first id exists or not:
  async function checkID(id, sid) {
    const Hashids = require("hashids/cjs");
    const hashids = new Hashids("client-vendor");

    try {
      const q = query(
        collection(db, "supply_partners"),
        where("id", "==", decode_id[0]),
        where("sid", "==", decode_sid[0])
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length !== 0) {
        setFlag(true);
        setvendor_businessInfo(querySnapshot.docs[0].data());
      } else {
        setvendor_businessInfo();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    checkID(id, sid).then(() => {
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (flag) {
    } else {
    }
  }, [flag]);

  //saving form data into database:
  async function handleFormSubmit(e) {
    e.preventDefault();

    //uploading all info from here:
    await setDoc(
      doc(db, "supply_partners", String(decode_id[0])),
      vendor_businessInfo,
      {
        merge: true,
      }
    )
      .then(() => {
        history.push(`/vendor-documents-links/${id}/${sid}`);
      })
      .catch((er) => {});
  }

  return (
    <>
      {/* <Header/> */}
      {loading ? (
        <Loader />
      ) : vendor_businessInfo ? (
        <div className={styles.onboarding}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <ProgressBar progress="50" />
          <div className={styles.onboarding_text}>
            <h1>Vendor Onboarding</h1>
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
                          vendor_businessInfo?.business_contact_info
                            ?.contact_name
                        }
                        onChange={(e) => {
                          setvendor_businessInfo({
                            ...vendor_businessInfo,
                            business_contact_info: {
                              ...vendor_businessInfo?.business_contact_info,
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
                    <div className={styles.phoneNo}>
                      <PhoneInput
                        inputExtraProps={{
                          name: "phone",
                          required: true,
                          autoFocus: true,
                        }}
                        country={"in"}
                        value={
                          vendor_businessInfo?.business_contact_info
                            ?.contact_mobileno
                        }
                        onChange={(e) => {
                          setvendor_businessInfo({
                            ...vendor_businessInfo,
                            business_contact_info: {
                              ...vendor_businessInfo?.business_contact_info,
                              contact_mobileno: e,
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
                        placeholder="globalmedia.offices@globalmedia.com"
                        className={styles.input}
                        value={
                          vendor_businessInfo?.business_contact_info
                            ?.contact_email
                        }
                        onChange={(e) => {
                          setvendor_businessInfo({
                            ...vendor_businessInfo,
                            business_contact_info: {
                              ...vendor_businessInfo?.business_contact_info,
                              contact_email: e.target.value,
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
                        placeholder="globalmedia.offices.com"
                        className={styles.input}
                        value={
                          vendor_businessInfo?.business_contact_info
                            ?.company_websiteadd
                        }
                        onChange={(e) => {
                          setvendor_businessInfo({
                            ...vendor_businessInfo,
                            business_contact_info: {
                              ...vendor_businessInfo?.business_contact_info,
                              company_websiteadd: e.target.value,
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
                          vendor_businessInfo?.business_contact_info
                            ?.data_protection_mail
                        }
                        onChange={(e) => {
                          setvendor_businessInfo({
                            ...vendor_businessInfo,
                            business_contact_info: {
                              ...vendor_businessInfo?.business_contact_info,
                              data_protection_mail: e.target.value,
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
                        placeholder="globalmedia.offices@globalmedia.com"
                        className={styles.input}
                        value={
                          vendor_businessInfo?.business_contact_info
                            ?.infosecurity_mail
                        }
                        onChange={(e) => {
                          setvendor_businessInfo({
                            ...vendor_businessInfo,
                            business_contact_info: {
                              ...vendor_businessInfo?.business_contact_info,
                              infosecurity_mail: e.target.value,
                            },
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.next}>
                    {/* <Link to="/vendor-documents-links"> */}
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
        <Error />
      )}
    </>
  );
};

export default VendorBusinessInfo;
