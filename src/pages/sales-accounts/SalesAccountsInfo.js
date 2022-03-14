import logo from "../../assets/logo.png";
import styles from "../../utils/formHelper.module.css";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import compact from "../../assets/compact.png";
import data from "../../assets/data.png";
import { Link, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useDebugValue, useEffect, useState } from "react";
import ProgressBar from "../../components/progress-bar/ProgressBar";
import { db } from "../../firebase-config";
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
import { decode } from "@firebase/util";
import { connectStorageEmulator } from "firebase/storage";

const helperCardData = [
  {
    helperLogo: compact,
    helperTitle: "Compact and comprehensive",
    helperDesc:
      "This information on different summarization levels enables the recognition of changes in the market processes.",
  },
];

const helperCardDataAccounts = [
  {
    helperLogo: data,
    helperTitle: "Data & Business Entity",
    helperDesc:
      "Identifying and recording this data and using it to generate useful reports for a variety of users.",
  },
];

const SalesInfo = ({ SalesAccountsInfo, setSalesAccountsInfo }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  //salesInfo:
  useEffect(() => {
    console.log("in useEffect for sales info");
    console.log(SalesAccountsInfo);
    // console.log(phoneNumber);
  }, [SalesAccountsInfo]);

  //first id
  const { id } = useParams();
  // const { id, sid } = useParams(id, sid);

  //second id
  const { sid } = useParams();

  let [flag, setFlag] = useState(false);

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");

  let decode_sid = hashids.decode(sid);
  console.log("decoded sid=> ", decode_sid);

  // let decod = hashids.encode(id);
  // console.log(decod);

  // let decodeid = hashids.encode(sid);
  // console.log(decodeid);

  //check whether first id exists or not
  async function checkID(id, sid) {
    const Hashids = require("hashids/cjs");
    const hashids = new Hashids("client-vendor");

    let d_fid = hashids.decode(id);
    let d_sid = hashids.decode(sid);

    const q = query(
      collection(db, "Organisation"),
      where("id", "==", d_fid[0]),
      where("sid", "==", d_sid[0])
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length !== 0) {
      // console.log("Entered this condition")
      setFlag(true);
      setSalesAccountsInfo(querySnapshot.docs[0].data());
    }
  }

  useEffect(() => {
    console.log("in useEffect", id);
    checkID(id, sid);
  }, [id]);

  useEffect(() => {
    if (flag) {
      console.log("id found");
    } else {
      console.log("id not found");
    }
  }, [flag]);

  return (
    <section className={styles.text_form}>
      <div className={styles.left_text}>
        <h1>Sales Contact Information</h1>
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
          <form>
            {/* sales contact */}
            <div className={styles.input_group}>
              <div className={styles.label}>
                <label>
                  Sales Contact Name
                  <span className={styles.required}>Required</span>
                </label>
              </div>
              <div className={styles.inputs}>
                <input
                  type="text"
                  placeholder="Global Media.Sales"
                  className={styles.input}
                  value={
                    SalesAccountsInfo?.SalesAccounts_Info?.sales_contactName
                  }
                  onChange={(e) => {
                    setSalesAccountsInfo({
                      ...SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...SalesAccountsInfo?.SalesAccounts_Info,
                        sales_contactName: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
            {/* sales contact no */}
            <div className={styles.input_group}>
              <div className={styles.label}>
                <label>
                  Sales Contact Mobile No.
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
                  value={phoneNumber}
                  value={SalesAccountsInfo?.SalesAccounts_Info?.sales_mobileno}
                  onChange={(e) => {
                    setSalesAccountsInfo({
                      ...SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...SalesAccountsInfo?.SalesAccounts_Info,
                        sales_mobileno: e,
                      },
                    });
                  }}
                  // onChange={(e) => {
                  //   setsalesInfo({
                  //     ...salesInfo,
                  //     sales_contact_info: {
                  //       ...salesInfo?.sales_contact_info,
                  //       mobile_no: e.target.value,
                  //     },
                  //   });
                  // }}
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
            {/* sales contact email */}
            <div className={styles.input_group}>
              <div className={styles.label}>
                <label>
                  Sales Contact Email
                  <span className={styles.required}>Required</span>
                </label>
              </div>
              <div className={styles.inputs}>
                <input
                  type="email"
                  placeholder="globalmedia.sales@globalmedia.com"
                  className={styles.input}
                  value={
                    SalesAccountsInfo?.SalesAccounts_Info?.sales_contactEmail
                  }
                  onChange={(e) => {
                    setSalesAccountsInfo({
                      ...SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...SalesAccountsInfo?.SalesAccounts_Info,
                        sales_contactEmail: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const AccountsInfo = ({ SalesAccountsInfo, setSalesAccountsInfo }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [salesInfo, setsalesInfo] = useState();

  //accounts Info:
  useEffect(() => {
    console.log("in useEffect for accounts info");
    console.log(SalesAccountsInfo);
  }, [SalesAccountsInfo]);

  //first id
  const { id } = useParams();

  //second id
  const { sid } = useParams();

  let [flag, setFlag] = useState(false);

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  let decode_sid = hashids.decode(sid);
  console.log("decoded sid=> ", decode_sid);

  // let decod = hashids.encode(id);
  // console.log(decod);

  // let decodeid = hashids.encode(sid);
  // console.log(decodeid);

  //check whether first id exists or not
  async function checkID(id, sid) {
    const Hashids = require("hashids/cjs");
    const hashids = new Hashids("client-vendor");

    let d_fid = hashids.decode(id);
    let d_sid = hashids.decode(sid);

    const q = query(
      collection(db, "Organisation"),
      where("id", "==", d_fid[0]),
      where("sid", "==", d_sid[0])
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length !== 0) {
      // console.log("Entered this condition")
      setFlag(true);
      setSalesAccountsInfo(querySnapshot.docs[0].data());
    }
  }

  useEffect(() => {
    console.log("in useEffect", id);
    checkID(id, sid);
  }, [id]);

  useEffect(() => {
    if (flag) {
      console.log("id found");
    } else {
      console.log("id not found");
    }
  }, [flag]);

  return (
    <section className={styles.text_form}>
      <div className={styles.left_text}>
        <h1>Accounts Contact Information</h1>
        <p>This information will be visible all across our console</p>
        <div className={styles.inputHelperCard}>
          {helperCardDataAccounts.map((data, i) => (
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
          <form>
            {/* accounts contact */}
            <div className={styles.input_group}>
              <div className={styles.label}>
                <label>
                  Accounts Contact Name
                  <span className={styles.required}>Required</span>
                </label>
              </div>
              <div className={styles.inputs}>
                <input
                  type="text"
                  placeholder="Global Media.Sales"
                  className={styles.input}
                  value={
                    SalesAccountsInfo?.SalesAccounts_Info?.Accounts_contactName
                  }
                  onChange={(e) => {
                    setSalesAccountsInfo({
                      ...SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...SalesAccountsInfo?.SalesAccounts_Info,
                        Accounts_contactName: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
            {/* accounts contact no */}
            <div className={styles.input_group}>
              <div className={styles.label}>
                <label>
                  Accounts Contact Mobile No.
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
                    SalesAccountsInfo?.SalesAccounts_Info?.Accounts_mobileno
                  }
                  onChange={(e) => {
                    // setPhoneNumber(e);
                    setSalesAccountsInfo({
                      ...SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...SalesAccountsInfo?.SalesAccounts_Info,
                        Accounts_mobileno: e,
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
            {/* accounts contact email */}
            <div className={styles.input_group}>
              <div className={styles.label}>
                <label>
                  Accounts Contact Email
                  <span className={styles.required}>Required</span>
                </label>
              </div>
              <div className={styles.inputs}>
                <input
                  type="email"
                  placeholder="globalmedia.sales@globalmedia.com"
                  className={styles.input}
                  value={
                    SalesAccountsInfo?.SalesAccounts_Info?.Accounts_contactEmail
                  }
                  onChange={(e) => {
                    setSalesAccountsInfo({
                      ...SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...SalesAccountsInfo?.SalesAccounts_Info,
                        Accounts_contactEmail: e.target.value,
                      },
                    });
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const SalesAccountsInfo = () => {
  // const [salesInfo, setsalesInfo] = useState();
  const [SalesAccountsInfo, setSalesAccountsInfo] = useState();
  const [decode_id, setdecode_id] = useState();
  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");

  const { id, sid } = useParams();
  // console.log(d_fid[0]);

  async function handleFormSubmit(e) {
    e.preventDefault();
    // console.lo;
    //uploading information to the database:
    let d_fid = hashids.decode(id);
    let d_sid = hashids.decode(sid);
    // console.log(salesInfo, d_fid[0]);
    // console.log(accountsInfo, d_fid[0]);

    //sales info
    setDoc(doc(db, "Organisation", String(d_fid[0])), SalesAccountsInfo, {
      merge: true,
    })
      .then(() => {
        console.log("data updated successfully");
      })
      .catch((er) => {
        console.log("error", er);
      });
  }
  return (
    <>
      {/* <Header/> */}
      <div className={styles.onboarding}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>
        <ProgressBar progress="100" />
        <div className={styles.onboarding_text}>
          <h1>Client Onboarding</h1>
          <p>Key step to understand your expectations</p>
        </div>
        {/* components */}
        <div className={styles.sales}>
          <SalesInfo
            SalesAccountsInfo={SalesAccountsInfo}
            setSalesAccountsInfo={setSalesAccountsInfo}
          />
        </div>
        <AccountsInfo
          SalesAccountsInfo={SalesAccountsInfo}
          setSalesAccountsInfo={setSalesAccountsInfo}
        />

        <div className={styles.next}>
          <Link to="/vendor-onboarding">
            <button className={styles.btnNext} onClick={handleFormSubmit}>
              NEXT
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default SalesAccountsInfo;
