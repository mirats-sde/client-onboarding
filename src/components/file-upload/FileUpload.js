import styles from "./FileUpload.module.css";
import { AiOutlineFileAdd } from "react-icons/ai";
import { BsCircleFill } from "react-icons/bs";

const FileUpload = ({ type, id }) => {
  let iconStyles = { color: "#7B61FF" };
  return (
    <div className={styles.file_upload}>
      <label className={styles.icon} htmlFor="fileIcon">
        <AiOutlineFileAdd style={iconStyles} size={60} />
      </label>
      <input type="file" id="fileIcon" hidden></input>
      <div className={styles.warning}>
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
            File should be uploaded in pdf, jpg, png format only
          </li>
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
