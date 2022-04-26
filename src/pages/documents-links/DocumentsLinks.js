import logo from "../../assets/logo.png";
import styles from "../../utils/formHelper.module.css";
import FileUpload from "../../components/file-upload/FileUpload";
import InputHelperCard from "../../components/input-helper-card/InputHelperCard";
import { FiLink2 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import helping from "../../assets/helping.png";
import ProgressBar from "../../components/progress-bar/ProgressBar";
import { useEffect, useRef, useState } from "react";
import storage, { db } from "../../firebase-config";
import CircularProgress from "@mui/material/CircularProgress";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import Error from "../../components/error/Error";

import Tooltip from "@mui/material/Tooltip";
// import styless from "./FileUpload.module.css";
import styless from "../../components/file-upload/FileUpload.module.css";

import { AiOutlineFileAdd } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";
// import { MdOutlineDeleteOutline } from "react-icons/md";
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
import Loader from "../loader/Loader";

const helperCardData = [
  {
    helperLogo: helping,
    helperTitle: "Understanding & helping you",
    helperDesc:
      "Companies can be classified into various types on the basis of their mode of incorporation, number of the members and the liability of the members.",
  },
];

const DocumentsLinks = () => {
  const history = useHistory();
  const [documentInfo, setDocumentInfo] = useState();
  const storage = getStorage();
  let iconStyles = { color: "#7B61FF" };
  let iconStylesDisabled = { color: "gray" };
  let [showPanelProgress, setShowPanelProgress] = useState(false);
  let [showESOMARProgress, setshowESOMARProgress] = useState(false);
  const [loading, setLoading] = useState(true);

  //panel upload:
  const [panelFile, setpanelFile] = useState();
  const panel_ref = useRef();

  // esomar upload:
  const [esomarFile, setesomarFile] = useState();
  const esomar_ref = useRef();

  //document
  useEffect(() => {}, [documentInfo]);

  //first id:
  const { id } = useParams();

  //second id:
  const { sid } = useParams();

  let [flag, setFlag] = useState(false);

  const Hashids = require("hashids/cjs");
  const hashids = new Hashids("client-vendor");
  let decode_id = hashids.decode(id);
  let decode_sid = hashids.decode(sid);

  //panel book reference:
  const panelBookRef = ref(
    storage,
    `Organisation/document-links/PanelBook/${decode_id[0]}`
  );

  //ESOMAR reference:
  const ESOMARRef = ref(
    storage,
    `Organisation/document-links/ESOMAR/${decode_id[0]}`
  );

  //check whether the id exists or not:
  async function checkID(id, sid) {
    const Hashids = require("hashids/cjs");
    const hashids = new Hashids("client-vendor");

    try {
      const q = query(
        collection(db, "Organisation"),
        where("id", "==", decode_id[0]),
        where("sid", "==", decode_sid[0])
      );

      const querySnapshot = await getDocs(q);
      if (querySnapshot.docs.length != 0) {
        setFlag(true);
        setDocumentInfo(querySnapshot.docs[0].data());
      } else {
        setDocumentInfo();
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }

  const DeletePanelFileFromStorage = (storageRef) => {
    listAll(storageRef).then((res) => {
      res.items.forEach((itemRef) => {
        setShowPanelProgress(true);
        // All the items under listRef.
        deleteObject(itemRef)
          .then(() => {
            setShowPanelProgress(false);
          })
          .catch((error) => {});
      });
    });
  };

  const DeleteESOMARFileFromStorage = (storageRef) => {
    listAll(storageRef).then((res) => {
      res.items.forEach((itemRef) => {
        setshowESOMARProgress(true);
        // All the items under listRef.
        deleteObject(itemRef)
          .then(() => {
            setshowESOMARProgress(false);
          })
          .catch((error) => {});
      });
    });
  };

  const UploadPanelBookFiles = (id, panelfile) => {
    if (!panelfile) {
      return;
    }
    //Empty file
    else {
      let panelfilename = panelfile.name;
      const panelfileref = ref(
        storage,
        `Organisation/document-links/PanelBook/${id}/${panelfilename}`
      );
      const paneluploadTask = uploadBytesResumable(panelfileref, panelfile);

      paneluploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (er) => {},
        () => {
          getDownloadURL(paneluploadTask.snapshot.ref).then((url) => {});
        }
      );
    }
  };

  //esomar file upload
  const UploadESOMARFiles = (id, esomarfile) => {
    if (!esomarfile) {
      return;
    } else {
      let esomarfilename = esomarfile.name;
      const esomarfileref = ref(
        storage,
        `Organisation/document-links/ESOMAR/${id}/${esomarfilename}`
      );
      const esomaruploadtask = uploadBytesResumable(esomarfileref, esomarfile);
      esomaruploadtask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        (er) => {},
        () => {
          getDownloadURL(esomaruploadtask.snapshot.ref).then((url) => {});
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
    checkID(id, sid).then(() => {
      setLoading(false);
    });

    //For Panel book
    ListPanelBookDocument();
    ListESOMARDocument();
  }, []);

  useEffect(() => {
    if (flag) {
    } else {
    }
  }, [flag]);

  //submit the form
  async function handleFormSubmit(e) {
    e.preventDefault();
    UploadPanelBookFiles(
      decode_id[0],
      panelFile || documentInfo.documents_info.panelFile
    );
    UploadESOMARFiles(
      decode_id[0],
      esomarFile || documentInfo.documents_info.esomarFile
    );

    //uploading all documents from here
    await setDoc(doc(db, "Organisation", String(decode_id[0])), documentInfo, {
      merge: true,
    })
      .then(() => {
        history.push(`/sales-accounts/${id}/${sid}`);
      })
      .catch((er) => {});
  }

  return (
    <>
      {loading ? (
        <Loader />
      ) : documentInfo ? (
        <div className={styles.onboarding}>
          <div className={styles.logo}>
            <img src={logo} alt="logo" />
          </div>
          <ProgressBar progress="75" />
          <div className={styles.onboarding_text}>
            <h1>Client Onboarding</h1>
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
                    {/* File uploader  */}
                    {!panelFile &&
                    !documentInfo?.documents_info?.PanelBook_url ? (
                      <div className={styless.file_upload}>
                        <label className={styless.icon} htmlFor="fileIcon">
                          <AiOutlineFileAdd style={iconStyles} size={60} />
                        </label>

                        <input
                          type="file"
                          ref={panel_ref}
                          onChange={(e) => {
                            setDocumentInfo({
                              ...documentInfo,
                              documents_info: {
                                ...documentInfo?.documents_info,
                                panelFile: e.target.files[0],
                              },
                            });
                            <a href="">{panelFile}</a>;
                          }}
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
                          value={documentInfo?.documents_info?.PanelBook_url}
                          onChange={(e) => {
                            setDocumentInfo({
                              ...documentInfo,
                              documents_info: {
                                ...documentInfo?.documents_info,
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
                    !documentInfo?.documents_info?.ESOMAR_url ? (
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
                            setDocumentInfo({
                              ...documentInfo,
                              documents_info: {
                                ...documentInfo?.documents_info,
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
                                <a href={esomarFile?.url}>{esomarFile?.name}</a>
                                {!esomarFile ? (
                                  <></>
                                ) : (
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
                          value={documentInfo?.documents_info?.ESOMAR_url}
                          onChange={(e) => {
                            setDocumentInfo({
                              ...documentInfo,
                              documents_info: {
                                ...documentInfo?.documents_info,
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
                            documentInfo?.documents_info?.ESOMAR_Profile_Link
                          }
                          onChange={(e) => {
                            setDocumentInfo({
                              ...documentInfo,
                              documents_info: {
                                ...documentInfo?.documents_info,
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
                          value={documentInfo?.documents_info?.linkedin_profile}
                          onChange={(e) => {
                            setDocumentInfo({
                              ...documentInfo,
                              documents_info: {
                                ...documentInfo?.documents_info,
                                linkedin_profile: e.target.value,
                              },
                            });
                          }}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className={styles.next}>
                    <button className={styles.btnNext} type="submit">
                      NEXT
                    </button>
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

export default DocumentsLinks;
