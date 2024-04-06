
import {useState} from "react"
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"

import {sendMail} from "../../../../services/operations/registrationAPI"

export default function SendMailForm() {

  const { token } = useSelector((state) => state.auth)

  // const {courseId} = useParams();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    roomId: "",
    roomPassword: "",
    courseId: "",
  })

  const { roomId,roomPassword,courseId } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    console.log("room id entered by the user is checking inside registration form ",roomId);     
    console.log("room password entered by the user is checking inside registration form ",roomPassword); 
    console.log("courseId is checking inside registration form ",courseId); 

    dispatch(sendMail(roomId,roomPassword,courseId,token, navigate))
  }

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mt-6 flex w-full flex-col gap-y-4"
    >
      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Room Id <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="roomId"
          value={roomId}
          onChange={handleOnChange}
          placeholder="Room Id"
          className="form-style w-full"
        />
      </label>

      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Room Password <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="roomPassword"
          value={roomPassword}
          onChange={handleOnChange}
          placeholder="Room Password"
          className="form-style w-full"
        />
      </label>

      <label className="w-full">
        <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
          Tournament Id <sup className="text-pink-200">*</sup>
        </p>
        <input
          required
          type="text"
          name="courseId"
          value={courseId}
          onChange={handleOnChange}
          placeholder="Tournament Id"
          className="form-style w-full"
        />
      </label>

      <button
        type="submit"
        className="mt-6 rounded-[8px] bg-yellow-50 py-[8px] px-[12px] font-bold text-richblack-900"
      >
        Send Mail
      </button>
    </form>
  )
}

// export default SendMailForm