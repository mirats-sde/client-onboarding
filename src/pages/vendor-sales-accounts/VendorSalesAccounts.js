import logo from "../../assets/logo.png";
import styles from "../../utils/formHelper.module.css";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import ProgressBar from "../../components/progress-bar/ProgressBar";
import compact from "../../assets/compact.png";
import data from "../../assets/data.png";
import { Link, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState, useEffect, useRef } from "react";
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
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

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

const SalesInfo = ({
  vendor_SalesAccountsInfo,
  setvendor_SalesAccountsInfo,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  //salesInfo:
  useEffect(() => {
    // console.log("in useEffect for sales info");
    // console.log(vendor_SalesAccountsInfo);
    // console.log(phoneNumber);
  }, [vendor_SalesAccountsInfo]);

  //first id
  const { id } = useParams();
  // const { id, sid } = useParams(id, sid);

  //second id
  const { sid } = useParams();

  let [flag, setFlag] = useState(false);

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");

  let decode_sid = hashids.decode(sid);
  // console.log("decoded sid=> ", decode_sid);

  //check whether first id exists or not
  async function checkID(id, sid) {
    const Hashids = require("hashids/cjs");
    const hashids = new Hashids("client-vendor");

    let d_fid = hashids.decode(id);
    let d_sid = hashids.decode(sid);

    const q = query(
      collection(db, "supply_partners"),
      where("id", "==", d_fid[0]),
      where("sid", "==", d_sid[0])
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length !== 0) {
      // console.log("Entered this condition")
      setFlag(true);
      setvendor_SalesAccountsInfo(querySnapshot.docs[0].data());
    }
  }

  useEffect(() => {
    // console.log("in useEffect", id);
    checkID(id, sid);
  }, [id]);

  useEffect(() => {
    if (flag) {
      // console.log("id found");
    } else {
      // console.log("id not found");
    }
  }, [flag]);

  return (
    <section className={styles.text_form}>
      <div className={styles.left_text}>
        <h1>Sales Contact Information</h1>
        <p>This information will be visible all across our console</p>
        <div className={styles.inputHelperCard}>
          {helperCardData.map((data) => (
            <InputHelperCard
              helperTitle={data.helperTitle}
              helperDesc={data.helperDesc}
              helperLogo={data.helperLogo}
            />
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
                    vendor_SalesAccountsInfo?.SalesAccounts_Info
                      ?.sales_contactName
                  }
                  onChange={(e) => {
                    setvendor_SalesAccountsInfo({
                      ...vendor_SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...vendor_SalesAccountsInfo?.SalesAccounts_Info,
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
                  Sales Contact Mobile Number
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
                    vendor_SalesAccountsInfo?.SalesAccounts_Info?.sales_mobileno
                  }
                  onChange={(e) => {
                    setvendor_SalesAccountsInfo({
                      ...vendor_SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...vendor_SalesAccountsInfo?.SalesAccounts_Info,
                        sales_mobileno: e,
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
                    vendor_SalesAccountsInfo?.SalesAccounts_Info
                      ?.sales_contactEmail
                  }
                  onChange={(e) => {
                    setvendor_SalesAccountsInfo({
                      ...vendor_SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...vendor_SalesAccountsInfo?.SalesAccounts_Info,
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

const AccountsInfo = ({
  vendor_SalesAccountsInfo,
  setvendor_SalesAccountsInfo,
}) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  //accounts Info:
  useEffect(() => {
    // console.log("in useEffect for accounts info");
    // console.log(vendor_SalesAccountsInfo);
  }, [vendor_SalesAccountsInfo]);

  //first id
  const { id } = useParams();

  //second id
  const { sid } = useParams();

  let [flag, setFlag] = useState(false);

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  let decode_sid = hashids.decode(sid);
  // console.log("decoded sid=> ", decode_sid);

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
      collection(db, "supply_partners"),
      where("id", "==", d_fid[0]),
      where("sid", "==", d_sid[0])
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length !== 0) {
      // console.log("Entered this condition")
      setFlag(true);
      setvendor_SalesAccountsInfo(querySnapshot.docs[0].data());
    }
  }

  useEffect(() => {
    // console.log("in useEffect", id);
    checkID(id, sid);
  }, [id]);

  useEffect(() => {
    if (flag) {
      // console.log("id found");
    } else {
      // console.log("id not found");
    }
  }, [flag]);

  return (
    <section className={styles.text_form}>
      <div className={styles.left_text}>
        <h1>Accounts Contact Information</h1>
        <p>This information will be visible all across our console</p>
        <div className={styles.inputHelperCard}>
          {helperCardDataAccounts.map((data) => (
            <InputHelperCard
              helperTitle={data.helperTitle}
              helperDesc={data.helperDesc}
              helperLogo={data.helperLogo}
            />
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
                    vendor_SalesAccountsInfo?.SalesAccounts_Info
                      ?.Accounts_contactName
                  }
                  onChange={(e) => {
                    setvendor_SalesAccountsInfo({
                      ...vendor_SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...vendor_SalesAccountsInfo?.SalesAccounts_Info,
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
                    vendor_SalesAccountsInfo?.SalesAccounts_Info
                      ?.Accounts_mobileno
                  }
                  onChange={(e) => {
                    // setPhoneNumber(e);
                    setvendor_SalesAccountsInfo({
                      ...vendor_SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...vendor_SalesAccountsInfo?.SalesAccounts_Info,
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
                    vendor_SalesAccountsInfo?.SalesAccounts_Info
                      ?.Accounts_contactEmail
                  }
                  onChange={(e) => {
                    setvendor_SalesAccountsInfo({
                      ...vendor_SalesAccountsInfo,
                      SalesAccounts_Info: {
                        ...vendor_SalesAccountsInfo?.SalesAccounts_Info,
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

const VendorSalesAccountsInfo = () => {
  const history = useHistory();
  const [vendor_SalesAccountsInfo, setvendor_SalesAccountsInfo] = useState();

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
    setDoc(
      doc(db, "supply_partners", String(d_fid[0])),
      vendor_SalesAccountsInfo,
      {
        merge: true,
      }
    )
      .then(() => {
        // console.log("data updated successfully");
        history.push(
          `/vendor-quality-checks/registration-attributes/${id}/${sid}`
        );
      })
      .catch((er) => {
        // console.log("error", er);
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
          <h1>Vendor Onboarding</h1>
          <p>Key step to understand your expectations</p>
        </div>
        {/* components */}
        <div className={styles.sales}>
          <SalesInfo
            vendor_SalesAccountsInfo={vendor_SalesAccountsInfo}
            setvendor_SalesAccountsInfo={setvendor_SalesAccountsInfo}
          />
        </div>
        <AccountsInfo
          vendor_SalesAccountsInfo={vendor_SalesAccountsInfo}
          setvendor_SalesAccountsInfo={setvendor_SalesAccountsInfo}
        />

        <div className={styles.next}>
          <button className={styles.btnNext} onClick={handleFormSubmit}>
            NEXT
          </button>
        </div>
      </div>
    </>
  );
};

export default VendorSalesAccountsInfo;
