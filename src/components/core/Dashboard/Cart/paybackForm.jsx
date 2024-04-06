import React from "react"
import { useState } from "react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { apiConnector } from "../../../../services/apiConnector"
import { studentEndpoints } from "../../../../services/apis"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"

import { paybackRequestMailSend } from "../../../../services/operations/studentFeaturesAPI"

const PaybackForm = () => {

  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = useForm()

  const submitPaybackForm = async (data) => {
    console.log("Form Data - ", data)
    dispatch(paybackRequestMailSend(data.email,data.upiId,data.amount,token))
  }

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset({
        email: "",
        upiId: "",
        amount: "",
      })
    }
  }, [reset, isSubmitSuccessful])

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleSubmit(submitPaybackForm)}
    >

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="lable-style">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email address"
          className="form-style"
          {...register("email", { required: true })}
        />
      </div>

      <div className="flex flex-col gap-2 lg:w-[48%]">
          <label htmlFor="upiId" className="lable-style">
            upiId
          </label>
          <input
            type="text"
            name="upiId"
            id="upiId"
            placeholder="Enter upi id"
            className="form-style"
            {...register("upiId")}
          />
        </div>
        

      <div className="flex flex-col gap-2">
        <label htmlFor="amount" className="lable-style">
          amount
        </label>
        <input
            type="Number"
            name="amount"
            id="amount"
            placeholder="Enter amount "
            className="form-style"
            {...register("amount")}
          />
      </div>

      <button
        disabled={loading}
        type="submit"
        className={`rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] 
         ${
           !loading &&
           "transition-all duration-200 hover:scale-95 hover:shadow-none"
         }  disabled:bg-richblack-500 sm:text-[16px] `}
      >
        Send Message
      </button>
    </form>
  )
}

export default PaybackForm