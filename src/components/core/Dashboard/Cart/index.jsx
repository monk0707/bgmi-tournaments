import { useSelector } from "react-redux"

import RenderCartCourses from "./RenderCartCourses"
import RenderTotalAmount from "./RenderTotalAmount"
import { useState } from "react"

import PaybackForm from "./paybackForm"

export default function Cart() {
  const { total, totalItems } = useSelector((state) => state.cart)
  const { paymentLoading } = useSelector((state) => state.course)

  const{user} = useSelector((state) => state.profile)

  // what to do next : just call the api to get the data of wallet : that is we have to call the api to get the user data : 

  

  if (paymentLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="spinner"></div>
      </div>
    )

  return (
    <>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">Your Wallet has - {user?.wallet}</h1>
      {/* <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
        {totalItems} Courses in Cart
      </p> */}

      {/* let's put a form here in which user will enter 1.the amount he want in the account. 2. His UPI Id.*/}
      
      <PaybackForm />
    </>
  )
}
