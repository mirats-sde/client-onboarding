import FileUpload from "../../components/file-upload/FileUpload";
import logo from "../../assets/logo.png";
import styles from "../../utils/formHelper.module.css";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import { Link } from "react-router-dom";
import moment from "moment";
import bindingTrust from "../../assets/bindingTrust.png";
import ProgressBar from "../../components/progress-bar/ProgressBar";
import { useParams } from "react-router-dom";
import { db } from "../../firebase-config";
import storage from "../../firebase-config";
import styless from "../../components/file-upload/FileUpload.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import { AiOutlineFileAdd } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
import { format } from "date-fns";
import { Timestamp } from "firebase/firestore";
// import { MdOutlineDeleteOutline } from "react-icons/md";
import { TiDelete } from "react-icons/ti";

import Hashids from "hashids";
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
import { useState, useEffect, useRef } from "react";
import { DataObjectSharp, UploadFile } from "@mui/icons-material";
import { decode } from "@firebase/util";
import { useHistory } from "react-router-dom";

const helperCardData = [
  {
    helperLogo: bindingTrust,
    helperTitle: "Binding Trust & Corporations",
    helperDesc:
      "A partnership or any societal form allowed by the authorized legal framework.",
  },
];

// function asUtcIsoString(date) {
//   const y = date.getUTCFullYear();
//   const m = `${date.getUTCMonth() + 1}`.padStart(2, "0");
//   const d = `${date.getUTCDate()}`.padStart(2, "0");
//   return `${y}-${m}-${d}`;
// }

const ClientOnboarding = () => {
  const history = useHistory();
  const storage = getStorage();
  let iconStyles = { color: "#7B61FF" };
  let iconStylesDisabled = { color: "gray" };
  let [showProgress, setShowProgress] = useState(false);

  const [entityInfo, setEntityInfo] = useState();

  const [startdate, setstartdate] = useState();
  const tax_id_certi_Ref = useRef();

  useEffect(() => {
    console.log(entityInfo);
  }, [entityInfo]);

  //tax certificate file upload:
  const [taxcert, settaxcert] = useState();
  const tax_cert_ref = useRef();

  //first id
  const { id } = useParams();

  //second id
  const { sid } = useParams();

  let [flag, setFlag] = useState(false);

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  let decode_id = hashids.decode(id);
  console.log("decoded id=> ", decode_id);
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

    console.log(decode_id[0]);
    console.log(decode_sid[0]);
    const q = query(
      collection(db, "Organisation"),
      where("id", "==", decode_id[0]),
      where("sid", "==", decode_sid[0])
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length !== 0) {
      // console.log("Entered this condition")
      setFlag(true);
      setEntityInfo(querySnapshot.docs[0].data());
    }
  }

  //tax certificate reference:
  const taxcertref = ref(storage, `Organisation/legal-entity/${decode_id[0]}`);

  //deleting file from storage:
  const deleteFileFromStorage = (storageRef) => {
    console.log("deleting file");
    listAll(storageRef).then((res) => {
      console.log(res.items);
      res.items.forEach((itemRef) => {
        setShowProgress(true);
        deleteObject(itemRef)
          .then(() => {
            //file deleted successfullly
            console.log("file deleted successfully", itemRef);
            setShowProgress(false);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    });
  };

  //uploading tax certificate file
  const UploadFiles = (id, file) => {
    if (!file) {
      console.log("tax certificate file not found!");
      return;
    } else {
      console.log("file found");
      let filename = file.name;
      const fileref = ref(
        storage,
        `Organisation/legal-entity/${id}/${filename}`
      );
      const uploadtask = uploadBytesResumable(fileref, file);
      uploadtask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log("progress bar is: ", progress);
        },
        (er) => {
          console.log("error while uploading file", er.message);
        },
        () => {
          getDownloadURL(uploadtask.snapshot.ref).then((url) => {
            console.log(url);
          });
        }
      );
    }
  };

  //displaying tax certificate files
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

  useEffect(() => {
    console.log("in useeffect", id);
    checkID(id, sid);
    // const storageRef = ref(storage, `/legal_entity/${decode_id[0]}`);
    ListTaxFiles();
  }, []);

  useEffect(() => {
    if (flag) {
      console.log("id found");
    } else {
      console.log("id not found");
    }
  }, [flag]);

  //saving form data into database.
  async function handleFormSubmit(e) {
    e.preventDefault();

    UploadFiles(decode_id[0], taxcert || entityInfo?.legal_entity?.taxFile);

    // uploading all other information into database
    await setDoc(doc(db, "Organisation", String(decode_id[0])), entityInfo, {
      merge: true,
    })
      .then(() => {
        console.log("data uploaded successfully");
        history.push(`/business-info/${id}/${sid}`);
      })
      .catch((er) => {
        console.log("Error", er);
      });
  }

  useEffect(() => {
    console.log(entityInfo?.legal_entity?.start_date);
  }, [entityInfo?.legal_entity?.start_date]);

  return (
    <>
      <div className={styles.onboarding}>
        <div className={styles.logo}>
          <img src={logo} alt="logo" />
        </div>
        <ProgressBar progress="25" />
        <div className={styles.onboarding_text}>
          <h1>Client Onboarding</h1>
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
                      value={entityInfo?.legal_entity?.company_name}
                      onChange={(e) => {
                        setEntityInfo({
                          ...entityInfo,
                          legal_entity: {
                            ...entityInfo?.legal_entity,
                            company_name: e.target.value,
                          },
                        });
                        tax_id_certi_Ref.current.value = e.target.files;
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
                      value={entityInfo?.legal_entity?.address1}
                      onChange={(e) => {
                        setEntityInfo({
                          ...entityInfo,
                          legal_entity: {
                            ...entityInfo?.legal_entity,
                            address1: e.target.value,
                          },
                        });
                      }}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Street Address 2 (If Necessary)"
                      className={styles.input}
                      value={entityInfo?.legal_entity?.address2}
                      onChange={(e) => {
                        setEntityInfo({
                          ...entityInfo,
                          legal_entity: {
                            ...entityInfo?.legal_entity,
                            address2: e.target.value,
                          },
                        });
                      }}
                    />
                    <label>City</label>
                    <select
                      placeholder="Your City"
                      value={entityInfo?.legal_entity?.city}
                      onChange={(e) => {
                        setEntityInfo({
                          ...entityInfo,
                          legal_entity: {
                            ...entityInfo?.legal_entity,
                            city: e.target.value,
                          },
                        });
                      }}
                    >
                      {/* <option>Select city</option> */}
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
                          value={entityInfo?.legal_entity?.zip_code}
                          onChange={(e) => {
                            setEntityInfo({
                              ...entityInfo,
                              legal_entity: {
                                ...entityInfo?.legal_entity,
                                zip_code: e.target.value,
                              },
                            });
                          }}
                        />
                      </div>
                      <div className={styles.country}>
                        <label>Country</label>
                        <select
                          value={entityInfo?.legal_entity?.country}
                          onChange={(e) => {
                            setEntityInfo({
                              ...entityInfo,
                              legal_entity: {
                                ...entityInfo?.legal_entity,
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
                    checked={entityInfo?.legal_entity?.billing_address}
                    onChange={(e) => {
                      setEntityInfo({
                        ...entityInfo,
                        legal_entity: {
                          ...entityInfo?.legal_entity,
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
                      Company Registration No.
                      <span className={styles.required}>Required</span>
                    </label>
                  </div>
                  <div className={styles.inputs}>
                    <input
                      type="text"
                      placeholder="Ontario"
                      className={styles.input}
                      value={entityInfo?.legal_entity?.regno}
                      onChange={(e) => {
                        setEntityInfo({
                          ...entityInfo,
                          legal_entity: {
                            ...entityInfo?.legal_entity,
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
                          setEntityInfo({
                            ...entityInfo,
                            legal_entity: {
                              ...entityInfo?.legal_entity,
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

                      <input type="file" id="fileIcon" disabled hidden></input>

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
                      value={entityInfo?.legal_entity?.employees}
                      onChange={(e) => {
                        setEntityInfo({
                          ...entityInfo,
                          legal_entity: {
                            ...entityInfo?.legal_entity,
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
                      value={entityInfo?.legal_entity?.start_date
                        ?.toDate()
                        .toLocaleDateString("en-CA")}
                      onChange={(e) => {
                        setEntityInfo({
                          ...entityInfo,
                          legal_entity: {
                            ...entityInfo?.legal_entity,
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
                  {/* <Link to={`business-info/${id}/${sid}`}> */}
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
    </>
  );
};

export default ClientOnboarding;
