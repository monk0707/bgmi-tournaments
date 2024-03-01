import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addCourseDetails,
  editCourseDetails,
  // fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
// import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../Common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementsField"

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)
  // const [courseCategories, setCourseCategories] = useState([])

  useEffect(() => {
    // const getCategories = async () => {
    //   setLoading(true)
    //   const categories = await fetchCourseCategories()
    //   if (categories.length > 0) {
    //     // console.log("categories", categories)
    //     setCourseCategories(categories)
    //   }
    //   setLoading(false)
    // }
    // if form is in edit mode
    if (editCourse) {
      // console.log("data populated", editCourse)
      // setValue("courseTitle", course.courseName)
      // setValue("courseShortDesc", course.courseDescription)
      // setValue("coursePrice", course.price)
      // setValue("courseTags", course.tag)
      // setValue("courseBenefits", course.whatYouWillLearn)
      // // setValue("courseCategory", course.category)
      // setValue("courseRequirements", course.instructions)
      // setValue("courseImage", course.thumbnail)

      setValue("courseTitle", course.title)
      setValue("courseShortDesc", course.timeOfTournament)
      setValue("coursePrice", course.registrationAmount)
      setValue("courseTags", course.tournamentNo)
      setValue("courseBenefits", course.tournamentPrize)
      // setValue("courseCategory", course.category)
      setValue("courseRequirements", course.tournamentSeatsLeft)
      setValue("courseImage", course.thumbnail)
    }
    // getCategories()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isFormUpdated = () => {
    const currentValues = getValues()
    // console.log("changes after editing form values:", currentValues)
    if (
      // currentValues.courseTitle !== course.courseName ||
      // currentValues.courseShortDesc !== course.courseDescription ||
      // currentValues.coursePrice !== course.price ||
      // currentValues.courseTags.toString() !== course.tag.toString() ||
      // currentValues.courseBenefits !== course.whatYouWillLearn ||
      // // currentValues.courseCategory._id !== course.category._id ||
      // currentValues.courseRequirements.toString() !==
      //   course.instructions.toString() ||
      // currentValues.courseImage !== course.thumbnail

      currentValues.courseTitle !== course.title ||
      currentValues.courseShortDesc !== course.timeOfTournament||
      currentValues.coursePrice !== course.registrationAmount ||
      currentValues.courseTags !== course.tournamentNo||
      currentValues.courseBenefits !== course.tournamentPrize ||
      // currentValues.courseCategory._id !== course.category._id ||
      currentValues.courseRequirements !==
        course.tournamentSeatsLeft ||
      currentValues.courseImage !== course.thumbnail
    ) {
      return true
    }
    return false
  }

  //   handle next button click
  const onSubmit = async (data) => {
    // console.log(data)

    if (editCourse) {
      // const currentValues = getValues()
      // console.log("changes after editing form values:", currentValues)
      // console.log("now course:", course)
      // console.log("Has Form Changed:", isFormUpdated())
      if (isFormUpdated()) {
        const currentValues = getValues()
        const formData = new FormData()
        // console.log(data)
        formData.append("courseId", course._id)
        if (currentValues.courseTitle !== course.title) {
          formData.append("title", data.courseTitle)
        }
        if (currentValues.courseShortDesc !== course.timeOfTournament) {
          formData.append("timeOfTournament", data.courseShortDesc)
        }
        if (currentValues.coursePrice !== course.registrationAmount) {
          formData.append("registrationAmount", data.coursePrice)
        }
        if (currentValues.courseTags !== course.tournamentNo) {
          formData.append("tournamentNo", JSON.stringify(data.courseTags))
        }
        if (currentValues.courseBenefits !== course.tournamentPrize) {
          formData.append("tournamentPrize", data.courseBenefits)
        }
        // if (currentValues.courseCategory._id !== course.category._id) {
        //   formData.append("category", data.courseCategory)
        // }
        if (
          currentValues.courseRequirements !==
          course.tournamentSeatsLeft
        ) {
          formData.append(
            "tournamentSeatsLeft",
            JSON.stringify(data.courseRequirements)
          )
        }
        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnail", data.courseImage)
        }
        // console.log("Edit Form data: ", formData)
        setLoading(true)
        const result = await editCourseDetails(formData, token)
        setLoading(false)
        if (result) {
          dispatch(setStep(2))
          dispatch(setCourse(result))
        }
      } else {
        toast.error("No changes made to the form")
      }
      return
    }

    

    const formData = new FormData()
    formData.append("title", data.courseTitle)
    formData.append("timeOfTournament", data.courseShortDesc)
    formData.append("registrationAmount", data.coursePrice)
    formData.append("tournamentNo", JSON.stringify(data.courseTags))
    formData.append("tournamentPrize", data.courseBenefits)
    // formData.append("category", data.courseCategory)
    // formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("tournamentSeatsLeft", JSON.stringify(data.courseRequirements))
    formData.append("thumbnail", data.courseImage)
    setLoading(true)
    const result = await addCourseDetails(formData, token)
    if (result) {
      dispatch(setStep(2))
      dispatch(setCourse(result))
    }
    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Tournament Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter tournament Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Tournament title is required
          </span>
        )}
      </div>
      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Tournament will start at this time <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Tournament Time"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Tournament Time is required
          </span>
        )}
      </div>
      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Tournament Registration Amount <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter tournament registration price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Tournament registration price is required
          </span>
        )}
      </div>
      {/* Course Category */}
      {/* <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div> */}
      {/* Course Tags */}
      <ChipInput
        label="Tournament No"
        name="courseTags"
        placeholder="Enter Tournament No and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
        getValues={getValues}
      />
      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Tournament Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />
      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Prizes of the tournament <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter prizes of the tournament"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Prizes of the tournament is required
          </span>
        )}
      </div>
      {/* Requirements/Instructions */}
      <RequirementsField
        name="courseRequirements"
        label="No of seats left"
        register={register}
        setValue={setValue}
        errors={errors}
        getValues={getValues}
      />
      {/* Next Button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Wihout Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}
