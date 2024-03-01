import React, { useEffect, useState } from "react"
import { BiInfoCircle } from "react-icons/bi"
import { HiOutlineGlobeAlt } from "react-icons/hi"
import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ConfirmationModal from "../components/Common/ConfirmationModal"
import Footer from "../components/Common/Footer"
// import RatingStars from "../components/Common/RatingStars"
// import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { formatDate } from "../services/formatDate"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { BuyCourse } from "../services/operations/studentFeaturesAPI"
// import GetAvgRating from "../utils/avgRating"
import Error from "./Error"

// Registration Form : 

import CourseRegistrationForm from "../components/core/Course/CourseRegistrationForm"

function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Getting courseId from url parameter
  const { courseId } = useParams()
  console.log(`course id: ${courseId}`)

  // Declear a state to save the course details
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)
  useEffect(() => {
    // Calling fetchCourseDetails fucntion to fetch the details
    (async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        console.log("course details res: ", res)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    })()
  }, [courseId])

  // console.log("response: ", response)

  // Calculating Avg Review count
  // const [avgReviewCount, setAvgReviewCount] = useState(0)
  // useEffect(() => {
  //   const count = GetAvgRating(response?.data?.courseDetails.ratingAndReviews)
  //   setAvgReviewCount(count)
  // }, [response])
  // console.log("avgReviewCount: ", avgReviewCount)

  // // Collapse all
  // const [collapse, setCollapse] = useState("")
  // const [isActive, setIsActive] = useState(Array(0))
  // const handleActive = (id) => {
  //   // console.log("called", id)
  //   setIsActive(
  //     !isActive.includes(id)
  //       ? isActive.concat([id])
  //       : isActive.filter((e) => e !== id)
  //   )
  // }

  // Total number of lectures
  // const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  // useEffect(() => {
  //   let lectures = 0
  //   response?.data?.courseDetails?.courseContent?.forEach((sec) => {
  //     lectures += sec.subSection.length || 0
  //   })
  //   setTotalNoOfLectures(lectures)
  // }, [response])

  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  if (!response.success) {
    return <Error />
  }

  const {
    // _id: course_id,
    title,
    tournamentNo,
    thumbnail,
    registrationAmount,
    timeOfTournament,
    tournamentPrize,
    tournamentSeatsLeft,
    team,
    playersEnrolled,
    createdAt,
  } = response.data?.tournamentDetails[0]

  console.log('response.data.tournamentDetails are ',response.data?.tournamentDetails)

  const handleBuyCourse = () => {
    if (token) {
      BuyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    // console.log("payment loading")
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }
  // lg:hidden
  return (
    <>
      <div className={`relative w-full bg-richblack-800`}>
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            <div>
              <div className="relative block max-h-[30rem]">
                <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                <img
                  src={thumbnail}
                  alt="course thumbnail"
                  className="aspect-auto w-auto h-auto"
                />
              </div>
              <div className="mb-4">
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                {tournamentNo}{" "}{title}
                  {console.log('title is ',title)}
                </p>
              </div>
              
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  No of seats left for the tournament are - 
                  {" "}
                  {tournamentSeatsLeft}
                </p>
              
                <p className="text-richblack-5">
                  Created By {`${team?.userName} ${team?.email}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg text-richblack-5">
                <p className="flex items-center gap-2 text-richblack-5">
                  {" "}
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Registration amount is Rs.{registrationAmount} 
                <div></div>
                {"Pay the registration amount before registration on our upi Id - 9311544497@paytm"}
              </p>
              <div>
                <CourseRegistrationForm/>
              </div>
              {/* <button className="yellowButton" onClick={handleBuyCourse}>
                Register Now
              </button> */}
              {/* <button className="blackButton">Add to Cart</button> */}
            </div>
          </div>
          {/* Courses Card */}
          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
             <CourseDetailsCard
              course={response?.data?.tournamentDetails[0]}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">Prizes of the tournament are</p>
            <div className="mt-5">
              <ReactMarkdown>{tournamentPrize}</ReactMarkdown>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="max-w-[830px] ">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Time of Tournament is </p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>
                    {timeOfTournament} {`section(s)`}
                  </span>
                  {/* <span>
                    {totalNoOfLectures} {`lecture(s)`}
                  </span>
                  <span>{response.data?.totalDuration} total length</span> */}
                </div>
                <div>
                  {/* <button
                    className="text-yellow-25"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button> */}
                </div>
              </div>
            </div>

            {/* Course Details Accordion */}
            <div className="py-4">
              {/* {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))} */}
            </div>

            {/* Author Details */}
            <div className="mb-12 py-4">
              <p className="text-[28px] font-semibold">This tournament is created by </p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    team?.image
                      ? team?.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${team?.userName}`
                  }
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">{`${team?.userName}`}</p>
              </div>
              <p className="text-richblack-50">
                {team?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails
