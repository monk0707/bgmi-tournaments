import { toast } from "react-hot-toast"

import { setLoading} from "../../slices/authSlice"
import { resetCart } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiConnector"
import { registrationEndpoints } from "../apis"

const {
  REGISTER_API,
} = registrationEndpoints

export function register(upiId, courseId, token, navigate) {
  console.log(`upiId inside register function is ${upiId} and courseId is ${courseId} and navigate is ${navigate}`);
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", REGISTER_API, 
      {
        upiId,
        courseId
      },
      {
        Authorization: `Bearer ${token}`,
      }
      )

      console.log("REGISTER API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Registered for the tournament Successfully")
      // dispatch(setToken(response.data.token))
      // const userImage = response.data?.user?.image
      //   ? response.data.user.image
      //   : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`
      // dispatch(setUser({ ...response.data.user, image: userImage }))
      // localStorage.setItem("token", JSON.stringify(response.data.token))
      navigate("/dashboard/my-profile")
    } catch (error) {
      console.log("REGISTER API ERROR............", error)
      toast.error("Registration Failed")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

