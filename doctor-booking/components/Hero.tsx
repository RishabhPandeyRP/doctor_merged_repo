import React from "react";
import "./Hero.css"
// import Image from "next/image";
import Link from "next/link";

const Hero = () => {
    return (
        <div className="hero-div">
            <div className="left-hero">

                <div className="left-hero-content">
                    <div className="left-hero-heading">
                        Health in Your Hands.
                    </div>

                    <div className="left-hero-desc">
                        Take control of your healthcare with CareMate. Book appointments with ease, explore health blogs, and stay on top of your well-being, all in one place.
                    </div>
                </div>

                <div>
                    <Link href={"/doctors2"}>
                        <button className="left-hero-btn">
                            Get Started
                        </button>
                    </Link>

                </div>

            </div>

            <div className="right-hero">
                {/* <div className="right-img-container">
                    <Image src="/heroImg.svg" alt="" fill objectFit="cover" />

                </div> */}
            </div>
        </div>
    )
}

export default Hero;