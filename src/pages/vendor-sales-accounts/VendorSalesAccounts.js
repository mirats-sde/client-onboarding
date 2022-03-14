import logo from "../../assets/logo.png";
import styles from "../../utils/formHelper.module.css";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import ProgressBar from "../../components/progress-bar/ProgressBar";
import compact from "../../assets/compact.png";
import data from "../../assets/data.png";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";

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

const SalesInfo = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
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
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e);
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
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

const AccountsInfo = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
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
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e);
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
          <SalesInfo />
        </div>
        <AccountsInfo />

        <div className={styles.next}>
          <Link to="/client-onboarding">
            <button className={styles.btnNext}>NEXT</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default VendorSalesAccountsInfo;
