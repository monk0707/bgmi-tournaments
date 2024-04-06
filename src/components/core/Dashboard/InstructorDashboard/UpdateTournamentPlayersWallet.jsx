import React, { useState } from "react"

import { updateTournamentPlayersWallet } from "../../../../services/operations/studentFeaturesAPI"
import { useDispatch, useSelector } from "react-redux"


const UpdateTournamentPlayersWallet = () => {

  const [loading, setLoading] = useState(false)
  const { token } = useSelector((state) => state.auth)

  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    data: "",
    tournamentId: "",
    killAmount: "",
  })

  const { data,tournamentId,killAmount } = formData

  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    console.log("room id entered by the user is checking inside registration form ",data);     
    console.log("room password entered by the user is checking inside registration form ",tournamentId); 
    console.log("killAmount is checking inside registration form ",killAmount); 

    dispatch(updateTournamentPlayersWallet(data,tournamentId,killAmount,token))
  }

  return (
    <form
      className="flex flex-col gap-7"
      onSubmit={handleOnSubmit}
    >
      <div className="flex flex-col gap-5 lg:flex-col">
        <div className="flex flex-col gap-2">
          <label htmlFor="data" className="lable-style">
            All teams kills
          </label>
          <input
            required
            type="text"
            name="data"
            value={data}
            onChange={handleOnChange}
            placeholder="Enter all teams kills "
            className="form-style w-full"
          />
          
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="tournamentId" className="lable-style">
            Tournament Id
          </label>
          <input
            required
            type="text"
            name="tournamentId"
            value={tournamentId}
            onChange={handleOnChange}
            placeholder="Enter tournamentId "
            className="form-style w-full"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="killAmount" className="lable-style">
            Amount per kill 
          </label>
          <input
            required
            type="text"
            name="killAmount"
            value={killAmount}
            onChange={handleOnChange}
            placeholder="Enter amount per kill "
            className="form-style w-full"
          />
        </div>

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
        Update Wallet
      </button>
    </form>
  )
}

export default UpdateTournamentPlayersWallet