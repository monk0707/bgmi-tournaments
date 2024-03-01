import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { BiDotsVerticalRounded } from "react-icons/bi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getUserEnrolledCourses(token) // Getting all the published and the drafted courses

        // Filtering the published course out
        // const filterPublishCourse = res.filter((ele) => ele.status !== "Draft")
        // console.log(
        //   "Viewing all the couse that is Published",
        //   filterPublishCourse
        // )

        setEnrolledCourses(res)
      } catch (error) {
        console.log("Could not fetch enrolled courses.")
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Tournaments</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not registered in any tournament yet.
          {/* TODO: Modify this Empty State */}
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 text-sm lg:text-lg">
            <p className="w-[45%] px-5 py-3">Tournament Name</p>
            <p className="w-1/4 px-2 py-3">Tournament Timing</p>
            <p className="flex-1 px-2 py-3">Registration Amount</p>
          </div>
          {/* Course Names */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              className={`flex items-center border border-richblack-700 ${
                i === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={i}
            >
              <div
                className="flex w-[55%] lg:w-[45%] cursor-pointer items-center gap-4 px-5 py-3"
                // onClick={() => {
                //   navigate(
                //     `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                //   )
                // }}
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-14 w-14 rounded-lg object-cover hidden lg:block"
                />
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.title}</p>
                  
                  <p className="text-xs text-richblack-300">
                    {course.tournamentPrize}
                  </p>
                  <p className="text-xs text-richblack-300">
                    Seats left - {course.tournamentSeatsLeft}
                  </p>
                </div>
              </div>
              <div className="w-1/4 px-2 py-3">{course.timeOfTournament}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                {course.registrationAmount}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
