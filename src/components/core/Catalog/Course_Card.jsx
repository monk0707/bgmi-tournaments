import React, { useEffect, useState } from "react"
// Icons
import { FaRegStar, FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
import { Link } from "react-router-dom"
import HighlightText from "../HomePage/HighlightText"


// import GetAvgRating from "../../../utils/avgRating"
// import RatingStars from "../../Common/RatingStars"

function Course_Card({ course, Height }) {
  // const avgReviewCount = GetAvgRating(course.ratingAndReviews)
  // console.log(course.ratingAndReviews)
  // const [avgReviewCount, setAvgReviewCount] = useState(0)
  // useEffect(() => {
  //   const count = GetAvgRating(course.ratingAndReviews)
  //   setAvgReviewCount(count)
  // }, [course])
  // console.log("count............", avgReviewCount)

  return (
    <>
    {console.log(course?.thumbnail)}
      <Link to={`/courses/${course._id}`}>
        <div className="flex flex-col lg:flex-row">

          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={` h-60 lg:h-96 w-full lg:w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-2xl bg-gradient-to-b from-[#FF512F] to-[#F09819] text-transparent bg-clip-text font-bold">{course?.title}</p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.userName}
            </p>
            <div className="flex items-center gap-2">
              {/* <span className="text-yellow-5">{avgReviewCount || 0}</span>
               <ReactStars
                count={5}
                value={avgReviewCount || 0}
                size={20}
                edit={false}
                activeColor="#ffd700"
                emptyIcon={<FaRegStar />}
                fullIcon={<FaStar />}
              /> 
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span> */}
            </div>
            <p className="text-xl text-richblack-5">
              Registration amount: </p>
              <p>
                <HighlightText text={`Rs.${course?.registrationAmount}`} />
              </p>
            <div>
            <p className="text-xl text-richblack-5">Tournament will start at: </p>
              <p>
                  <HighlightText text={`${course?.timeOfTournament}`} />
              </p>
            </div>
            <div>
            <p className="text-xl text-richblack-5">No of seats left for the tournament are: </p>
              <p>
                  <HighlightText text={`${course?.tournamentSeatsLeft}`} />
              </p>
            </div>
            <div>
            <p className="text-xl text-richblack-5">Prizes for the tournament are:</p>
              <p>
                  <HighlightText text={`${course?.tournamentPrize}`} />
              </p>
            </div>

            <div>
              <button className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
              ${
                "transition-all duration-200 hover:scale-95 hover:shadow-none"
              }  disabled:bg-richblack-500 sm:text-[16px] `}>
                Register Now
              </button>
            </div>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Course_Card
