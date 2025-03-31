"use client"
import styles from "@/styles/Navbar.module.css"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/context/AppContext"

const NavBar = () => {
    const router = useRouter()
    
    const {logout , username} = useAuthContext()

    const logoutHandler = () => {
        logout()
        router.push("/login")
    }

    return (
        <div className={styles.navDiv}>
            <div className={styles.imgWrapper} onClick={() => { router.push("/") }}>
                <Image src={"/mecareLogo.svg"} alt="logo" fill objectFit="contain" ></Image>
            </div>

            {username && <div className={styles.navbtnlogout}>
                <button className={styles.signupbtn} onClick={logoutHandler}>Logout</button>
            </div>}

        </div>
    )
}

export default NavBar