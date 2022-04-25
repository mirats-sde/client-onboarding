import { useState } from "react";
import styles from "./VendorProgress.module.css"

const VendorProgress = ({vendorProgress}) => {
    const [style, setStyle] = useState({});
    setTimeout(() => {
        const newStyle = {
            opacity: 1,
            width: `${vendorProgress}%`
        }
        setStyle(newStyle);
    }, 200);

    return (
        <div className={styles.vendor_progress}>
            <div className={styles.vendor_progress_done} style={style}>
                {/* {vendorProgress}% */}
                {/* <span>{vendorProgress}%</span> */}
            </div>
        </div>
    )
}

export default VendorProgress