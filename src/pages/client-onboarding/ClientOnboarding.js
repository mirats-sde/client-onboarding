import FileUpload from "../../components/file-upload/FileUpload";
import logo from "../../assets/logo.png";
import styles from "../../utils/formHelper.module.css";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import { Link } from "react-router-dom";
import bindingTrust from "../../assets/bindingTrust.png";
import ProgressBar from "../../components/progress-bar/ProgressBar";
import { useParams } from "react-router-dom";
import { db } from "../../firebase-config";
import storage from "../../firebase-config";

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
} from "firebase/firestore";
import { useState, useEffect, useRef } from "react";

const helperCardData = [
  {
    helperLogo: bindingTrust,
    helperTitle: "Binding Trust & Corporations",
    helperDesc:
      "A partnership or any societal form allowed by the authorized legal framework.",
  },
];

const ClientOnboarding = () => {
  const storage = getStorage();
  // console.log(storage);
  const [entityInfo, setEntityInfo] = useState();
  const [taxCerti, setTaxCerti] = useState({ name: "", url: "" });
  const [startdate, setstartdate] = useState();
  const tax_id_certi_Ref = useRef();

  useEffect(() => {
    console.log(entityInfo);
  }, [entityInfo]);

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

  let decod = hashids.encode(id);
  console.log(decod);

  let decodeid = hashids.encode(sid);
  console.log(decodeid);

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

  useEffect(() => {
    console.log("in useeffect", id);
    checkID(id, sid);
    const storageRef = ref(storage, `/legal_entity/${decode_id[0]}`);
    // console.log(storageRef);
    listAll(storageRef).then((res) => {
      console.log(res);
      res.items.forEach((itemRef) => {
        // console.log(res.name);
        console.log(itemRef.name);
        setTaxCerti((prevArr) => {
          return { ...prevArr, name: itemRef.name };
        });
        getDownloadURL(itemRef).then((url) => {
          setTaxCerti((prevArr) => {
            return { ...prevArr, url: url };
          });
        });
      });
    });
  }, []);
  console.log(taxCerti);

  useEffect(() => {
    if (flag) {
      console.log("id found");
    } else {
      console.log("id not found");
    }
  }, [flag]);

  async function handleFormSubmit(e) {
    e.preventDefault();
    //  uploading files in storage
    console.log(entityInfo.legal_entity.tax_id_certi);
    UploadFiles(decode_id[0], entityInfo.legal_entity.tax_id_certi);

    // uploading all other information into database
    await setDoc(doc(db, "Organisation", String(decode_id[0])), entityInfo, {
      merge: true,
    })
      .then(() => {
        console.log("data uploaded successfully");
      })
      .catch((er) => {
        console.log("Error", er);
      });
  }

  // const timest = entityInfo?.legal_entity?.start_date;
  // console.log(timest);

  // console.log(entityInfo?.legal_entity?.start_date);

  //file upload
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
                    <input
                      type="file"
                      className={styles.input}
                      ref={tax_id_certi_Ref}
                      onChange={(e) => {
                        setEntityInfo({
                          ...entityInfo,
                          legal_entity: {
                            ...entityInfo?.legal_entity,
                            tax_id_certi: e.target.files[0],
                          },
                        });
                      }}
                    />{" "}
                    <a href={taxCerti.url}>{taxCerti.name}</a>
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
                      value={startdate}
                      onChange={(e) => {
                        setEntityInfo({
                          ...entityInfo,
                          legal_entity: {
                            ...entityInfo?.legal_entity,
                            start_date: new Date(e.target.value),
                          },
                        });
                      }}
                      // onChange={(e) => {
                      //   setEntityInfo({
                      //     ...entityInfo,
                      //     legal_entity: {
                      //       ...entityInfo?.legal_entity,
                      //       start_date: new Date(e.target.value),
                      //     },
                      //   });
                      // }}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className={styles.next}>
              <Link to="/business-info/id/sid">
                <button
                  // Link
                  // to="/business-info/id/sid"
                  className={styles.btnNext}
                  onClick={handleFormSubmit}
                >
                  NEXT
                </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ClientOnboarding;

const DeletePreviousResume = (id) => {
  const folderRef = ref(storage, `/legal_entity/${id}`);
  listAll(folderRef).then((res) => {
    console.log(res.items);
    res.items.forEach((itemRef) => {
      // All the items under listRef.
      deleteObject(itemRef)
        .then(() => {
          // File deleted successfully
          console.log("file deleted successfully", itemRef);
        })
        .catch((error) => {
          console.log(error);
          // Uh-oh, an error occurred!
        });
    });
  });
};

const UploadFiles = (id, file) => {
  if (!file) return;
  //Empty file
  else {
    let filename = file.name;
    // If File extension is zip then only proceed
    DeletePreviousResume(id);
    const storageref = ref(storage, `/legal_entity/${id}/${filename}`);
    const uploadTask = uploadBytesResumable(storageref, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("PRogress bar is ", progress);
      },
      (er) => {
        console.log("Error while uploading file ", er.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
        });
      }
    );
  }
};
