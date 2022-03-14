import FileUpload from "../../components/file-upload/FileUpload";
// import Header from "../../components/header/Header"
import ProgressBar from "../../components/progress-bar/ProgressBar";
import styles from "../../utils/formHelper.module.css";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import { Link } from "react-router-dom";
import bindingTrust from "../../assets/bindingTrust.png";
import logo from "../../assets/logo.png";

const helperCardData = [
  {
    helperLogo: bindingTrust,
    helperTitle: "Binding Trust & Corporations",
    helperDesc:
      "A partnership or any societal form allowed by the authorized legal framework.",
  },
];

const VendorOnboarding = () => {
  return (
    <>
      {/* <Header/> */}
      <div className={styles.onboarding}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>
        <ProgressBar progress="25" />
        <div className={styles.onboarding_text}>
          <h1>Vendor Onboarding</h1>
          <p>Key step to understand your expectations</p>
        </div>
        <section className={styles.text_form}>
          <div className={styles.left_text}>
            <h1>Legal Entity Information</h1>
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
                {/* comp name */}
                <div className={styles.input_group}>
                  <div className={styles.label}>
                    <label>
                      Company Name
                      <span className={styles.required}>Required</span>
                    </label>
                  </div>
                  <div className={styles.inputs}>
                    <input
                      type="text"
                      placeholder="Barol White"
                      className={styles.input}
                    />
                  </div>
                </div>
                {/* comp address */}
                <div className={styles.input_group}>
                  <div className={styles.label}>
                    <label>
                      Company Registered Address
                      <span className={styles.required}>Required</span>
                    </label>
                  </div>
                  <div className={styles.inputs}>
                    <input
                      type="text"
                      placeholder="Street Address"
                      className={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Street Address 2 (If Necessary)"
                      className={styles.input}
                    />
                    <label>City</label>
                    <select placeholder="Your City">
                      <option>Mumbai</option>
                      <option>Delhi</option>
                      <option>Bangalore</option>
                    </select>
                    <div className={styles.code_country}>
                      <div className={styles.zip_code}>
                        <label>Zip Code</label>
                        <input type="number" className={styles.code_input} />
                      </div>
                      <div className={styles.country}>
                        <label>Country</label>
                        <select>
                          <option>India</option>
                          <option>USA</option>
                          <option>Japan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <input type="checkbox" className={styles.check_input} />
                  <span className={styles.check}>
                    <i>Billing address is same as shipping</i>
                  </span>
                </div>
                {/* comp reg no */}
                <div className={styles.input_group}>
                  <div className={styles.label}>
                    <label>
                      Company Registeration No.
                      <span className={styles.required}>Required</span>
                    </label>
                  </div>
                  <div className={styles.inputs}>
                    <input
                      type="text"
                      placeholder="Ontario"
                      className={styles.input}
                    />
                  </div>
                </div>
                {/* tax id */}
                <div className={styles.input_group}>
                  <div className={styles.label}>
                    <label>
                      Tax ID Certificate
                      <span className={styles.required}>Required</span>
                    </label>
                  </div>
                  <div className={styles.inputs}>
                    <input type="file" className={styles.input} />
                  </div>
                  <FileUpload />
                </div>
                {/* employees */}
                <div className={styles.input_group}>
                  <div className={styles.label}>
                    <label>
                      How many employees do you have?
                      <span className={styles.required}>Required</span>
                    </label>
                  </div>
                  <div className={styles.inputs}>
                    <select>
                      <option>1-15 Employees</option>
                      <option>15-60 Employees</option>
                      <option>60-100 Employees</option>
                      <option>100-1000 Employees</option>
                      <option>1000-10,000 Employees</option>
                    </select>
                  </div>
                </div>
                {/* comp start date */}
                <div className={styles.input_group}>
                  <div className={styles.label}>
                    <label>
                      Company Start Date
                      <span className={styles.required}>Required</span>
                    </label>
                  </div>
                  <div className={styles.inputs}>
                    <input type="date" className={styles.input} />
                  </div>
                </div>
              </form>
            </div>
            <div className={styles.next}>
              <Link to="/vendor-business-info">
                <button className={styles.btnNext}>NEXT</button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VendorOnboarding;
