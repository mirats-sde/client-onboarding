import logo from "../../assets/logo.png";
import styles from "../../utils/formHelper.module.css";
import FileUpload from "../../components/file-upload/FileUpload";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import { FiLink2 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import helping from "../../assets/helping.png";
import ProgressBar from "../../components/progress-bar/ProgressBar";
import { useState, useRef, useEffect } from "react";
import storage, { db } from "../../firebase-config";
// import { getStorage } from "firebase/storage";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

// import styless from "./FileUpload.module.css";
import styless from "../../components/file-upload/FileUpload.module.css";

import { AiOutlineFileAdd } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
//

import { TiDelete } from "react-icons/ti";
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
import { flexbox } from "@mui/system";
import { DocumentScanner } from "@mui/icons-material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const helperCardData = [
  {
    helperLogo: helping,
    helperTitle: "Understanding & helping you",
    helperDesc:
      "Companies can be classified into various types on the basis of their mode of incorporation, number of the members and the liability of the members.",
  },
];

const VendorDocumentsLinks = () => {
  const history = useHistory();
  const [vendor_documentsInfo, setvendor_documentsInfo] = useState();
  const storage = getStorage();
  let iconStyles = { color: "#7B61FF" };
  let iconStylesDisabled = { color: "gray" };
  let [showPanelProgress, setShowPanelProgress] = useState(false);
  let [showESOMARProgress, setshowESOMARProgress] = useState(false);

  //panel upload:
  const [panelFile, setpanelFile] = useState();
  const panel_ref = useRef();

  // esomar upload:
  const [esomarFile, setesomarFile] = useState();
  const esomar_ref = useRef();

  //document
  useEffect(() => {
    console.log(vendor_documentsInfo);
  }, [vendor_documentsInfo]);

  //first id:
  const { id } = useParams();

  //second id:
  const { sid } = useParams();

  let [flag, setFlag] = useState(false);

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  console.log(id);
  console.log(sid);
  let decode_id = hashids.decode(id);
  console.log("decoded id=>", decode_id);
  let decode_sid = hashids.decode(sid);
  console.log("decoded sid=>", decode_sid);

  //panel book reference:
  const panelBookRef = ref(
    storage,
    `supply_partners/document-links/PanelBook/${decode_id[0]}`
  );

  //ESOMAR reference:
  const ESOMARRef = ref(
    storage,
    `supply_partners/document-links/ESOMAR/${decode_id[0]}`
  );

  //check whether the id exists or not:
  async function checkID(id, sid) {
    const Hashids = require("hashids/cjs");
    const hashids = new Hashids("client-vendor");
    console.log(decode_id[0]);
    console.log(decode_sid[0]);
    const q = query(
      collection(db, "supply_partners"),
      where("id", "==", decode_id[0]),
      where("sid", "==", decode_sid[0])
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length != 0) {
      setFlag(true);
      setvendor_documentsInfo(querySnapshot.docs[0].data());
    }
  }

  const DeletePanelFileFromStorage = (storageRef) => {
    console.log("Deleting file");
    listAll(storageRef).then((res) => {
      // console
      console.log(res.items);
      res.items.forEach((itemRef) => {
        setShowPanelProgress(true);
        // All the items under listRef.
        deleteObject(itemRef)
          .then(() => {
            // File deleted successfully
            console.log("file deleted successfully", itemRef);
            setShowPanelProgress(false);
            // setPanelBookFiles();
          })
          .catch((error) => {
            console.log(error);
            // Uh-oh, an error occurred!
          });
      });
    });
  };

  const DeleteESOMARFileFromStorage = (storageRef) => {
    console.log("Deleting file");
    listAll(storageRef).then((res) => {
      // console
      console.log(res.items);
      res.items.forEach((itemRef) => {
        setshowESOMARProgress(true);
        // All the items under listRef.
        deleteObject(itemRef)
          .then(() => {
            // File deleted successfully
            console.log("file deleted successfully", itemRef);
            setshowESOMARProgress(false);
            // setPanelBookFiles();
          })
          .catch((error) => {
            console.log(error);
            // Uh-oh, an error occurred!
          });
      });
    });
  };

  const UploadPanelBookFiles = (id, panelfile) => {
    if (!panelfile) {
      console.log("panel book file not found");
      return;
    }
    //Empty file
    else {
      console.log("file found");
      let panelfilename = panelfile.name;
      // If File extension is zip then only proceed
      const panelfileref = ref(
        storage,
        `supply_partners/document-links/PanelBook/${id}/${panelfilename}`
      );
      const paneluploadTask = uploadBytesResumable(panelfileref, panelfile);

      paneluploadTask.on(
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
          getDownloadURL(paneluploadTask.snapshot.ref).then((url) => {
            console.log(url);
          });
        }
      );
    }
  };

  //esomar file upload
  const UploadESOMARFiles = (id, esomarfile) => {
    if (!esomarfile) {
      console.log("esomar file not found");
      return;
    } else {
      console.log("esomar file found");
      let esomarfilename = esomarfile.name;
      const esomarfileref = ref(
        storage,
        `supply_partners/document-links/ESOMAR/${id}/${esomarfilename}`
      );
      const esomaruploadtask = uploadBytesResumable(esomarfileref, esomarfile);
      esomaruploadtask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          console.log("progress bar is: ", progress);
        },
        (er) => {
          console.log("Error while uploading file=> ", er.message);
        },
        () => {
          getDownloadURL(esomaruploadtask.snapshot.ref).then((url) => {
            console.log(url);
          });
        }
      );
    }
  };

  function ListESOMARDocument() {
    listAll(ESOMARRef).then((res) => {
      res.items.forEach((itemRef) => {
        setesomarFile((preObj) => {
          return { ...preObj, name: itemRef.name };
        });
        getDownloadURL(itemRef).then((url) => {
          setesomarFile((preobj) => {
            return { ...preobj, url: url };
          });
        });
      });
    });
  }

  console.log(panelFile);
  console.log(esomarFile);

  function ListPanelBookDocument() {
    listAll(panelBookRef).then((res) => {
      res.items.forEach((itemRef) => {
        setpanelFile((preObj) => {
          return { ...preObj, name: itemRef.name };
        });
        getDownloadURL(itemRef).then((url) => {
          setpanelFile((preobj) => {
            return { ...preobj, url: url };
          });
        });
      });
    });
  }

  useEffect(() => {
    console.log(" in use effect", id);
    checkID(id, sid);

    //For Panel book
    ListPanelBookDocument();
    ListESOMARDocument();
  }, []);

  useEffect(() => {
    if (flag) {
      console.log("id found");
    } else {
      console.log("id not found");
    }
  }, [flag]);

  //submit the form
  async function handleFormSubmit(e) {
    e.preventDefault();
    UploadPanelBookFiles(
      decode_id[0],
      panelFile || vendor_documentsInfo.documents_info.panelFile
    );
    UploadESOMARFiles(
      decode_id[0],
      esomarFile || vendor_documentsInfo.documents_info.esomarFile
    );

    //uploading all documents from here
    await setDoc(
      doc(db, "supply_partners", String(decode_id[0])),
      vendor_documentsInfo,
      {
        merge: true,
      }
    )
      .then(() => {
        console.log("data updated successfully");
        history.push(`/vendor-sales-accounts/${id}/${sid}`);
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
              <form onSubmit={handleFormSubmit}>
                <div className={styles.form_inputs}>
                  {/* panel book */}
                  <label>
                    Panel Book <small>(Please attach Or Provide Link)</small>{" "}
                    <span className={styles.required}>Required</span>
                  </label>
                  {!panelFile &&
                  !vendor_documentsInfo?.documents_info?.PanelBook_url ? (
                    <div className={styless.file_upload}>
                      <label className={styless.icon} htmlFor="fileIcon">
                        <AiOutlineFileAdd style={iconStyles} size={60} />
                      </label>

                      <input
                        type="file"
                        // id="fileIcon"
                        ref={panel_ref}
                        onChange={(e) => {
                          setvendor_documentsInfo({
                            ...vendor_documentsInfo,
                            documents_info: {
                              ...vendor_documentsInfo?.documents_info,
                              panelFile: e.target.files[0],
                            },
                          });
                          <a href="">{panelFile}</a>;
                        }}

                        // <a href="">{panelFile?.name}</a>;
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
                              <a href={panelFile?.url}>{panelFile?.name}</a>

                              {!panelFile ? (
                                <></>
                              ) : (
                                // <TiDelete size={20} hidden />
                                <TiDelete
                                  size={20}
                                  color="red"
                                  onClick={() =>
                                    DeletePanelFileFromStorage(panelBookRef)
                                  }
                                />
                              )}

                              {showPanelProgress && <CircularProgress />}
                            </li>
                          </ul>
                        </div>
                      }
                    </div>
                  )}

                  <div className={styles.mid_text}>Or</div>
                  {!panelFile ? (
                    <div className={styles.input_url}>
                      <span>
                        <FiLink2 size={30} />
                      </span>
                      <input
                        type="url"
                        placeholder="Paste The Link Here"
                        className={styles.url}
                        value={
                          vendor_documentsInfo?.documents_info?.PanelBook_url
                        }
                        onChange={(e) => {
                          setvendor_documentsInfo({
                            ...vendor_documentsInfo,
                            documents_info: {
                              ...vendor_documentsInfo?.documents_info,
                              PanelBook_url: e.target.value,
                            },
                          });
                        }}
                      ></input>
                      <div></div>
                    </div>
                  ) : (
                    <div className={styles.input_url}>
                      <span>
                        <FiLink2 size={30} />
                      </span>
                      <input
                        type="url"
                        placeholder="Paste The Link Here"
                        className={styles.url}
                        disabled
                      ></input>
                      <div></div>
                    </div>
                  )}

                  {/* esmoar */}
                  <label>
                    ESOMAR <small>(Please attach Or Provide Link)</small>{" "}
                    <span className={styles.required}>Required</span>
                  </label>
                  {/* <FileUpload /> */}
                  {!esomarFile &&
                  !vendor_documentsInfo?.documents_info?.ESOMAR_url ? (
                    <div className={styless.file_upload}>
                      <label className={styless.icon} htmlFor="fileIcon">
                        <AiOutlineFileAdd style={iconStyles} size={60} />
                      </label>
                      <input
                        type="file"
                        id="fileIcon"
                        ref={esomar_ref}
                        // ref={ESOMARRef}
                        onChange={(e) => {
                          setvendor_documentsInfo({
                            ...vendor_documentsInfo,
                            documents_info: {
                              ...vendor_documentsInfo?.documents_info,
                              esomarFile: e.target.files[0],
                            },
                          });
                          <a href="">{esomarFile}</a>;
                        }}
                        // hidden
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
                              <a href={esomarFile?.url}>{esomarFile?.name}</a>
                              {!esomarFile ? (
                                <></>
                              ) : (
                                // <TiDelete size={20} hidden />
                                <TiDelete
                                  size={20}
                                  onClick={() =>
                                    DeleteESOMARFileFromStorage(ESOMARRef)
                                  }
                                />
                              )}
                              {showESOMARProgress && <CircularProgress />}
                            </li>
                          </ul>
                        </div>
                      }
                    </div>
                  )}

                  <div className={styles.mid_text}>Or</div>
                  {!esomarFile ? (
                    <div className={styles.input_url}>
                      <span>
                        <FiLink2 size={30} />
                      </span>
                      <input
                        type="url"
                        placeholder="Paste The Link Here"
                        className={styles.url}
                        value={vendor_documentsInfo?.documents_info?.ESOMAR_url}
                        onChange={(e) => {
                          setvendor_documentsInfo({
                            ...vendor_documentsInfo,
                            documents_info: {
                              ...vendor_documentsInfo?.documents_info,
                              ESOMAR_url: e.target.value,
                            },
                          });
                        }}
                      ></input>
                    </div>
                  ) : (
                    <div className={styles.input_url}>
                      <span>
                        <FiLink2 size={30} />
                      </span>
                      <input
                        type="url"
                        placeholder="Paste The Link Here"
                        className={styles.url}
                        disabled
                      ></input>
                    </div>
                  )}
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
                        value={
                          vendor_documentsInfo?.documents_info
                            ?.ESOMAR_Profile_Link
                        }
                        onChange={(e) => {
                          setvendor_documentsInfo({
                            ...vendor_documentsInfo,
                            documents_info: {
                              ...vendor_documentsInfo?.documents_info,
                              ESOMAR_Profile_Link: e.target.value,
                            },
                          });
                        }}
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
                        value={
                          vendor_documentsInfo?.documents_info?.linkedin_profile
                        }
                        onChange={(e) => {
                          setvendor_documentsInfo({
                            ...vendor_documentsInfo,
                            documents_info: {
                              ...vendor_documentsInfo?.documents_info,
                              linkedin_profile: e.target.value,
                            },
                          });
                        }}
                      ></input>
                    </div>
                  </div>
                </div>
                <div className={styles.next}>
                  {/* <Link to="/sales-accounts"> */}
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

export default VendorDocumentsLinks;
