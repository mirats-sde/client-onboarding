import FileUpload from "../../components/file-upload/FileUpload";
// import Header from "../../components/header/Header"
import ProgressBar from "../../components/progress-bar/ProgressBar";
import styles from "../../utils/formHelper.module.css";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import { Link, useParams } from "react-router-dom";
import bindingTrust from "../../assets/bindingTrust.png";
import logo from "../../assets/logo.png";
import { db } from "../../firebase-config";
import styless from "../../components/file-upload/FileUpload.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { AiOutlineFileAdd } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
import { useDebugValue, useEffect, useState, useRef } from "react";
import { TiDelete } from "react-icons/ti";
import { Timestamp } from "firebase/firestore";
import Error from "../../components/error/Error";

import {
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
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
import { UploadFile } from "@mui/icons-material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Loader from "../loader/Loader";

const helperCardData = [
  {
    helperLogo: bindingTrust,
    helperTitle: "Binding Trust & Corporations",
    helperDesc:
      "A partnership or any societal form allowed by the authorized legal framework.",
  },
];

const VendorOnboarding = () => {
  const history = useHistory();
  let iconStyles = { color: "#7B61FF" };
  let iconStylesDisabled = { color: "gray" };
  const storage = getStorage();
  const [vendor_entityInfo, setvendor_entityInfo] = useState();
  let [flag, setFlag] = useState(false);
  let [showProgress, setShowProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  //tax certificate file upload:
  const [taxcert, settaxcert] = useState();
  const tax_id_certi_Ref = useRef();
  const tax_cert_ref = useRef();

  //vendor_entityInfo:
  useEffect(() => {
    // console.log(vendor_entityInfo);
  }, [vendor_entityInfo]);

  //first id:
  const { id } = useParams();

  //second id:
  const { sid } = useParams();

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  let decode_id = hashids.decode(id);
  // console.log("decoded id=>", decode_id);
  let decode_sid = hashids.decode(sid);

  //deleting file from storage:
  const deleteFileFromStorage = (storageRef) => {
    // console.log("deleting file");
    listAll(storageRef).then((res) => {
      // console.log(res.items);
      res.items.forEach((itemRef) => {
        setShowProgress(true);
        deleteObject(itemRef)
          .then(() => {
            setShowProgress(false);
          })
          .catch((error) => {});
      });
    });
  };

  //uploading tax certificate file:
  const UploadFiles = (id, file) => {
    if (!file) {
      return;
    } else {
      let filename = file.name;
      const fileref = ref(
        storage,
        `supply_partners/legal-entity/${id}/${filename}`
      );
      const uploadtask = uploadBytesResumable(fileref, file);
      uploadtask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (er) => {},
        () => {
          getDownloadURL(uploadtask.snapshot.ref).then((url) => {});
        }
      );
    }
  };

  //displaying tax certificate files:
  function ListTaxFiles() {
    listAll(taxcertref).then((res) => {
      res.items.forEach((itemRef) => {
        settaxcert((preobj) => {
          return { ...preobj, name: itemRef.name };
        });
        getDownloadURL(itemRef).then((url) => {
          settaxcert((preobj) => {
            return { ...preobj, url: url };
          });
        });
      });
    });
  }

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
        setvendor_entityInfo(querySnapshot.docs[0].data());
      } else {
        setvendor_entityInfo();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  //tax certificate reference:
  const taxcertref = ref(
    storage,
    `supply_partners/legal-entity/${decode_id[0]}`
  );

  useEffect(() => {
    checkID(id, sid);
    ListTaxFiles();
  }, []);

  useEffect(() => {
    if (flag) {
    } else {
    }
  }, [flag]);

  //saving form data into database:
  async function handleFormSubmit(e) {
    e.preventDefault();

    UploadFiles(
      decode_id[0],
      taxcert || vendor_entityInfo?.legal_entity?.taxFile
    );

    //uploading all info from here:
    await setDoc(
      doc(db, "supply_partners", String(decode_id[0])),
      vendor_entityInfo,
      {
        merge: true,
      }
    )
      .then(() => {
        history.push(`/vendor-business-info/${id}/${sid}`);
      })
      .catch((er) => {});
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : vendor_entityInfo ? (
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
                        value={vendor_entityInfo?.legal_entity?.company_name}
                        onChange={(e) => {
                          setvendor_entityInfo({
                            ...vendor_entityInfo,
                            legal_entity: {
                              ...vendor_entityInfo?.legal_entity,
                              company_name: e.target.value,
                            },
                          });
                        }}
                        required
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
                        value={
                          vendor_entityInfo?.legal_entity?.company_address1
                        }
                        onChange={(e) => {
                          setvendor_entityInfo({
                            ...vendor_entityInfo,
                            legal_entity: {
                              ...vendor_entityInfo?.legal_entity,
                              company_address1: e.target.value,
                            },
                          });
                        }}
                        required
                      />
                      <input
                        type="text"
                        placeholder="Street Address 2 (If Necessary)"
                        className={styles.input}
                        value={
                          vendor_entityInfo?.legal_entity?.company_address2
                        }
                        onChange={(e) => {
                          setvendor_entityInfo({
                            ...vendor_entityInfo,
                            legal_entity: {
                              ...vendor_entityInfo?.legal_entity,
                              company_address2: e.target.value,
                            },
                          });
                        }}
                      />
                      <label>City</label>
                      <select
                        placeholder="Your City"
                        value={vendor_entityInfo?.legal_entity?.city}
                        onChange={(e) => {
                          setvendor_entityInfo({
                            ...vendor_entityInfo,
                            legal_entity: {
                              ...vendor_entityInfo?.legal_entity,
                              city: e.target.value,
                            },
                          });
                        }}
                      >
                        <option>Mumbai</option>
                        <option>Delhi</option>
                        <option>Bangalore</option>
                      </select>
                      <div className={styles.code_country}>
                        <div className={styles.zip_code}>
                          <label>Zip Code</label>
                          <input
                            type="number"
                            className={styles.code_input}
                            value={vendor_entityInfo?.legal_entity?.zip_code}
                            onChange={(e) => {
                              setvendor_entityInfo({
                                ...vendor_entityInfo,
                                legal_entity: {
                                  ...vendor_entityInfo?.legal_entity,
                                  zip_code: e.target.value,
                                },
                              });
                            }}
                          />
                        </div>
                        <div className={styles.country}>
                          <label>Country</label>
                          <select
                            value={vendor_entityInfo?.legal_entity?.country}
                            onChange={(e) => {
                              setvendor_entityInfo({
                                ...vendor_entityInfo,
                                legal_entity: {
                                  ...vendor_entityInfo?.legal_entity,
                                  country: e.target.value,
                                },
                              });
                            }}
                          >
                            <option>India</option>
                            <option>USA</option>
                            <option>Japan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className={styles.check_input}
                      checked={vendor_entityInfo?.legal_entity?.billing_address}
                      onChange={(e) => {
                        setvendor_entityInfo({
                          ...vendor_entityInfo,
                          legal_entity: {
                            ...vendor_entityInfo?.legal_entity,
                            billing_address: e.target.checked,
                          },
                        });
                      }}
                    />
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
                        value={vendor_entityInfo?.legal_entity?.regno}
                        onChange={(e) => {
                          setvendor_entityInfo({
                            ...vendor_entityInfo,
                            legal_entity: {
                              ...vendor_entityInfo?.legal_entity,
                              regno: e.target.value,
                            },
                          });
                        }}
                        required
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
                    {!taxcert ? (
                      <div className={styless.file_upload}>
                        <label className={styless.icon} htmlFor="fileIcon">
                          <AiOutlineFileAdd style={iconStyles} size={60} />
                        </label>

                        <input
                          type="file"
                          id="fileIcon"
                          ref={tax_id_certi_Ref}
                          onChange={(e) => {
                            setvendor_entityInfo({
                              ...vendor_entityInfo,
                              legal_entity: {
                                ...vendor_entityInfo?.legal_entity,
                                taxFile: e.target.files[0],
                              },
                            });
                            <a href="">{taxcert}</a>;
                          }}
                          required
                        ></input>
                        {
                          <div className={styless.warning}>
                            <ul>
                              <li>
                                <span>
                                  <BsCircleFill size={5} />
                                </span>
                                File should be of maximum 2 MB
                              </li>
                              <li>
                                <span>
                                  <BsCircleFill size={5} />
                                </span>
                                File should be uploaded in pdf, jpg, png format
                                only
                              </li>
                            </ul>
                          </div>
                        }
                      </div>
                    ) : (
                      <div className={styless.file_upload}>
                        <Tooltip
                          title="You have already uploaded file, Please Remove and upload"
                          followCursor
                        >
                          <label className={styless.icon} htmlFor="fileIcon">
                            <AiOutlineFileAdd
                              style={iconStylesDisabled}
                              size={60}
                            />
                          </label>
                        </Tooltip>

                        <input
                          type="file"
                          id="fileIcon"
                          disabled
                          hidden
                        ></input>

                        {
                          <div className={styless.warning}>
                            <ul>
                              <li
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  flexDirection: "row",
                                }}
                              >
                                <a href={taxcert?.url}>{taxcert?.name}</a>

                                {!taxcert ? (
                                  <></>
                                ) : (
                                  <TiDelete
                                    size={20}
                                    color="red"
                                    onClick={() =>
                                      deleteFileFromStorage(taxcertref)
                                    }
                                  />
                                )}

                                {showProgress && <CircularProgress />}
                              </li>
                            </ul>
                          </div>
                        }
                      </div>
                    )}
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
                      <select
                        value={vendor_entityInfo?.legal_entity?.employees}
                        onChange={(e) => {
                          setvendor_entityInfo({
                            ...vendor_entityInfo,
                            legal_entity: {
                              ...vendor_entityInfo?.legal_entity,
                              employees: e.target.value,
                            },
                          });
                        }}
                        required
                      >
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
                      <input
                        type="date"
                        className={styles.input}
                        value={vendor_entityInfo?.legal_entity?.start_date
                          ?.toDate()
                          .toLocaleDateString("en-CA")}
                        onChange={(e) => {
                          setvendor_entityInfo({
                            ...vendor_entityInfo,
                            legal_entity: {
                              ...vendor_entityInfo?.legal_entity,
                              start_date: Timestamp.fromDate(
                                new Date(e.target.value)
                              ),
                            },
                          });
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.next}>
                    {/* <Link to="/vendor-business-info"> */}
                    <button className={styles.btnNext} type="submit">
                      NEXT
                    </button>
                    {/* </Link> */}
                  </div>
                </form>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <Error />
      )}
    </>
  );
};

export default VendorOnboarding;
