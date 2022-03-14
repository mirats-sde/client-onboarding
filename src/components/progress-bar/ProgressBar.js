import { useState } from "react"
import styles from "./ProgressBar.module.css"
const ProgressBar = ({progress}) => {
        const [style, setStyle] = useState({});
        setTimeout(() => {
            const newStyle = {
                opacity: 1,
                width: `${progress}%`
            }
            
            setStyle(newStyle);
        }, 200);

        return (
            <div className={styles.progress}>
                <div className={styles.progress_done} style={style}>
                </div>
            </div>
        )
}

export default ProgressBar