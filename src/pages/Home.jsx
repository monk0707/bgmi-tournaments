// Icons Import
import { FaArrowRight } from "react-icons/fa"
import { Link } from "react-router-dom"

// Component Imports
import Footer from "../components/Common/Footer"
// import ReviewSlider from "../components/Common/ReviewSlider"
import CTAButton from "../components/core/HomePage/Button"
import CodeBlocks from "../components/core/HomePage/CodeBlocks"
import ExploreMore from "../components/core/HomePage/ExploreMore"
import HighlightText from "../components/core/HomePage/HighlightText"
import InstructorSection from "../components/core/HomePage/InstructorSection"
import LearningLanguageSection from "../components/core/HomePage/LearningLanguageSection"
import TimelineSection from "../components/core/HomePage/Timeline"

// background random images
import backgroundImg1 from '../assets/Images/random bg img/coding bg1.jpeg'
import backgroundImg2 from '../assets/Images/random bg img/coding bg2.jpeg'
import backgroundImg3 from '../assets/Images/random bg img/coding bg3.jpeg'
import backgroundImg4 from '../assets/Images/random bg img/coding bg4.jpeg'
import backgroundImg5 from '../assets/Images/random bg img/coding bg5.jpeg'
import backgroundImg6 from '../assets/Images/random bg img/coding bg6.jpeg'
import backgroundImg7 from '../assets/Images/random bg img/coding bg7.jpeg'
import backgroundImg8 from '../assets/Images/random bg img/coding bg8.jpeg'
import backgroundImg9 from '../assets/Images/random bg img/coding bg9.jpeg'
import backgroundImg10 from '../assets/Images/random bg img/coding bg10.jpeg'
import backgroundImg111 from '../assets/Images/random bg img/coding bg11.jpeg'
import { useEffect, useState } from "react"


const randomImges = [
    backgroundImg1,
    backgroundImg2,
    backgroundImg3,
    backgroundImg4,
    backgroundImg5,
    backgroundImg6,
    backgroundImg7,
    backgroundImg8,
    backgroundImg9,
    backgroundImg10,
    backgroundImg111,
];

function Home() {

  const [backgroundImg, setBackgroundImg] = useState(null);

    useEffect(() => {
        const bg = randomImges[Math.floor(Math.random() * randomImges.length)]
        setBackgroundImg(bg);
    }, [])


  return (
    
<div>
      {/* background random image */}
      <div className="mb-20">
                <div className="w-full h-[450px] md:h-[650px] absolute top-0 left-0 opacity-[0.3] overflow-hidden object-cover mt-14">
                    <img src={backgroundImg} alt="Background"
                        className="w-full h-full object-cover"
                    />

                    <div className="absolute left-0 bottom-0 w-full h-[250px] opacity_layer_bg "></div>
                </div>
      </div>

    

      
      {/* Section 1 */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        {/* Become a Instructor Button */}
        <Link to={"/signup"}>
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Register for Tournament</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Heading */}
        <div className="text-center text-4xl font-semibold">
            BGmi Clash: The Ultimate
          <HighlightText text={"Tournament Platform"} />
        </div>

        {/* Sub Heading */}
        <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
        BGmi Clash: Elevate your gaming experience with the ultimate tournament platform. Dive into thrilling BGmi battles, where players can seamlessly register, compete, and strive for victory. Immerse yourself in a vibrant gaming community, showcasing your skills and chasing glory. Join us at BGmi Clash — not just a platform, but the epicenter where champions rise, and gaming dreams come to life.
        </div>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-row gap-7">
          <CTAButton active={true} linkto={"/signup"}>
            Play tournaments
          </CTAButton>
          <CTAButton active={false} linkto={"/login"}>
            Contact Us
          </CTAButton>
        </div>

        {/* Video */}
        <div className="mx-3 my-7 shadow-[10px_-5px_50px_-5px] shadow-blue-200">
          {/* <video
            className="shadow-[20px_20px_rgba(255,255,255)]"
            muted
            loop
            autoPlay
          >
            <source src={Banner} type="video/mp4" />
          </video> */}
        </div>

        

      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Home
