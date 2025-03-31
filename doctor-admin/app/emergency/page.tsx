import React from "react";
import styles from "@/styles/Emergency.module.css"

const Emergency = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Emergency Numbers</h1>

            <div className={styles.card}>
                <div className={styles.numberItem}>
                    <h2>Emergency Services</h2>
                    <a href="tel:911" className={styles.phoneNumber}>911</a>
                    <p>Police, Fire, Medical</p>
                </div>

                <div className={styles.numberItem}>
                    <h2>Poison Control</h2>
                    <a href="tel:18002221222" className={styles.phoneNumber}>1-800-222-1222</a>
                    <p>For poisoning emergencies</p>
                </div>
            </div>
        </div>
    )
}

export default Emergency