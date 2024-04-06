import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

import { fetchInstructorCourses } from "../../../services/operations/courseDetailsAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"
import SendMailForm from "./InstructorDashboard/SendMailForm"

import UpdateTournamentPlayersWallet from "./InstructorDashboard/UpdateTournamentPlayersWallet"

export default function Instructor() {

  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])
  // const [players, setPlayers] = useState([])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token)
      console.log("instructor api data is ",instructorApiData)
      if (instructorApiData.length) setInstructorData(instructorApiData)
      if (result) {
        setCourses(result)
        // setPlayers(result.playersEnrolled)
        console.log("players inside dashboard are ",result)
      }
      setLoading(false)
    })()
  }, [])

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  )

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalTeamsEnrolled,
    0
  )

  return (
    <div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.userName} 👋
        </h1>
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>
      {loading ? (
        <div className="spinner"></div>
      ) : courses.length > 0 ? (
        <div>
          <div className="my-4 flex h-[450px] space-x-4">
            {/* Render chart / graph */}
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}
            {/* Total Statistics */}
            <div className="flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6">
              <p className="text-lg font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Tournaments</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {courses.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Players</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Income</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    Rs. {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-md bg-richblack-800 p-6">
            {/* Render all courses */}  {/* Render all tournaments and with a tournament render all players details :  */}
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Tournaments</p>
              <Link to="/dashboard/my-courses">
                <p className="text-xs font-semibold text-yellow-50">View All</p>
              </Link>
            </div>
            <div className="my-4 flex flex-col items-start space-x-6">
              {courses.map((course) => (
                <div className="flex flex-col gap-10">
                <div>
                  {/* {setPlayers(course.playersEnrolled)} */}
                <div key={course._id} className="">
                  {/* <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="h-[201px] w-full rounded-md object-cover"
                  /> */}
                  <div className="mt-3 w-full">
                    <p className="text-sm font-medium text-richblack-50">
                      {course.tournamentNo}{" "}
                      {course.title}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-xs font-medium text-richblack-300">
                        {course.playersEnrolled.length} teams
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-xs font-medium text-richblack-300">
                        Rs. {course.registrationAmount}
                      </p>
                    </div>
                  </div>
                </div>
                
                  <div className="flex flex-col">
                    <div className="text-xl text-white my-3">
                      All Teams are 
                    </div>
                      {
                        course.playersEnrolled.map((player,it)=>(
                          
                          <div className="w-[900px] flex flex-row justify-between my-2">
                            <div className="text-yellow-50 text-sm">
                              {/* {console.log("teamno is :/ ",it)} */}
                              {it+1}
                            </div>
                            <div className="text-yellow-50 text-sm">
                              {/* {console.log("username is :/ ",player.userName)} */}
                              {player.userName}
                            </div>
                            <div className="text-yellow-50 text-sm">
                              {player.email}
                            </div>
                            <div className="text-yellow-50 text-sm">
                              {player.bgmi_id}
                            </div>
                            <div className="text-yellow-50 text-sm">
                              {player.paymentId}
                            </div>
                          </div>
                        ))
                      }
                  </div>
                    <div>
                      <SendMailForm/>
                    </div>

                    <div className="mt-10">
                      {/* what to do here. We will create a form which will ask for 25 values in which we have to fill the no of kills of 25 teams and then update the wallet of all 25 teams using a loop. */}

                      <UpdateTournamentPlayersWallet/>

                      </div>
                  </div>
                  <hr
                    style={{
                      background: "white",
                      height: "2px",
                      border: "none",
                    }}
                  />
                </div>
              ))}

                

            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any tournaments yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a tournament
            </p>
          </Link>
        </div>
      )}
    </div>
  )
}
