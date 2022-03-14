import logo from "../../assets/logo.png"
import styles from "../../utils/formHelper.module.css";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import ProgressBar from "../../components/progress-bar/ProgressBar";
import { Link } from "react-router-dom";
import value from "../../assets/value.png";
import PhoneInput from "react-phone-input-2";
import { useState } from "react";
import "react-phone-input-2/lib/style.css";
// import 'react-phone-input-2/lib/material.css'

const helperCardData = [
  {
    helperLogo: value,
    helperTitle: "Significance & Value",
    helperDesc:
      "Information that is routinely found on business correspondence and reports, and in contact databases.",
  },
];

const VendorBusinessInfo = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  return (
    <>
      {/* <Header/> */}
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
                      type="email"
                      placeholder="globalmedia.offices.com"
                      className={styles.input}
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
                    />
                  </div>
                </div>
              </form>
            </div>
            {/* next button */}
            <div className={styles.next}>
              <Link to="/vendor-documents-links">
                <button className={styles.btnNext}>NEXT</button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VendorBusinessInfo;
