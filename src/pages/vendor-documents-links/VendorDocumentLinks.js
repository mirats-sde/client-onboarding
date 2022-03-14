import logo from "../../assets/logo.png"
import styles from "../../utils/formHelper.module.css";
import FileUpload from "../../components/file-upload/FileUpload";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import { FiLink2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import helping from "../../assets/helping.png";
import ProgressBar from "../../components/progress-bar/ProgressBar";

const helperCardData = [
  {
    helperLogo: helping,
    helperTitle: "Understanding & helping you",
    helperDesc:
      "Companies can be classified into various types on the basis of their mode of incorporation, number of the members and the liability of the members.",
  },
];

const VendorDocumentsLinks = () => {
  return (
    <>
      {/* <Header/> */}
      <div className={styles.onboarding}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>
        <ProgressBar progress="75" />
        <div className={styles.onboarding_text}>
          <h1>Vendor Onboarding</h1>
          <p>Key step to understand your expectations</p>
        </div>
        <section className={styles.text_form}>
          <div className={styles.left_text}>
            <h1>Document & Company's Link</h1>
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
            <div className={styles.document_link}>
              <form>
                <div className={styles.form_inputs}>
                  {/* panel book */}
                  <label>
                    Panel Book <small>(Please attach Or Provide Link)</small>{" "}
                    <span className={styles.required}>Required</span>
                  </label>
                  <FileUpload />
                  <div className={styles.mid_text}>Or</div>
                  <div className={styles.input_url}>
                    <span>
                      <FiLink2 size={30} />
                    </span>
                    <input
                      type="url"
                      placeholder="Paste The Link Here"
                      className={styles.url}
                    ></input>
                  </div>
                  {/* esmoar */}
                  <label>
                    ESOMAR <small>(Please attach Or Provide Link)</small>{" "}
                    <span className={styles.required}>Required</span>
                  </label>
                  <FileUpload />
                  <div className={styles.mid_text}>Or</div>
                  <div className={styles.input_url}>
                    <span>
                      <FiLink2 size={30} />
                    </span>
                    <input
                      type="url"
                      placeholder="Paste The Link Here"
                      className={styles.url}
                    ></input>
                  </div>
                  {/* esomar profile link */}
                  <div className={styles.profile_link}>
                    <label>
                      ESOMAR Profile Link/URL
                      <span className={styles.optional}>optional</span>
                    </label>
                    <div className={styles.input_url}>
                      <span>
                        <FiLink2 size={30} />
                      </span>
                      <input
                        type="url"
                        placeholder="Paste The Link Here"
                        className={styles.url}
                      ></input>
                    </div>
                  </div>
                  {/* esomar profile url */}
                  <div className={styles.profile_url}>
                    <label>
                      Linkedin Profile URL{" "}
                      <span className={styles.optional}>optional</span>
                    </label>
                    <div className={styles.input_url}>
                      <span>
                        <FiLink2 size={30} />
                      </span>
                      <input
                        type="url"
                        placeholder="Paste The Link Here"
                        className={styles.url}
                      ></input>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className={styles.next}>
              <Link to="/sales-accounts">
                <button className={styles.btnNext}>NEXT</button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default VendorDocumentsLinks;
