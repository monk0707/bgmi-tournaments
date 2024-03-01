import { useState } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"

import { register } from "../../../services/operations/registrationAPI"

function CourseRegistrationForm() {

  const { token } = useSelector((state) => state.auth)

  const {courseId} = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    upiId: "",
  })

//   const [showPassword, setShowPassword] = useState(false)

  const { upiId } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    console.log("Upi id entered by the user is checking inside registration form ",upiId);     {/* it's correct */}
    dispatch(register(upiId,courseId,token, navigate))
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          UPI Id <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="upiId"
          value={upiId}
          onChange={handleOnChange}
          placeholder="Enter your UPI Id by which you made the payment"
          className="form-style w-full"
        />
      </label>
      {/* <label className="relative">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type={showPassword ? "text" : "password"}
          name="password"
          value={password}
          onChange={handleOnChange}
          placeholder="Enter Password"
          className="form-style w-full !pr-10"
        /> */}
        {/* <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-[38px] z-[10] cursor-pointer"
        > */}
          {/* {showPassword ? (
            <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiOutlineEye fontSize={24} fill="#AFB2BF" />
          )}
        </span>
        <Link to="/forgot-password">
          <p className="mt-1 ml-auto max-w-max text-xs text-blue-100">
            Forgot Password
          </p>
        </Link>
      </label> */}
      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-bold text-richblack-900"
      >
        Register Now
      </button>
    </form>
  )
}

export default CourseRegistrationForm