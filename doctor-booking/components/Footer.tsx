import React from "react"
import styles from "@/styles/Footer.module.css"
import Image from "next/image"
import Link from "next/link"

const Footer = () => {
    return (
        <div className={styles.footerDiv}>
            <div className={styles.brand}>
                © Medcare 2024. All Right Reserved.
            </div>

            <div className={styles.reachOut}>
                <Link href={"/emergency"}>
                    <div className={styles.phone}>
                        <Image src={"/Phone (1).svg"} alt="phone" fill></Image>
                    </div>
                </Link>

                <Link href={"/emergency"}>
                    <div className={styles.whatsapp}>
                        <Image src={"/WhatsApp (1).svg"} alt="whatsapp" fill></Image>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default Footer