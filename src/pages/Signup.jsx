import signupImg from "../assets/Images/signup.jpeg"
import Template from "../components/core/Auth/Template"

function Signup() {
  return (
    <Template
      title="Join the Battle: Unlock Your Gaming Journey!"
      description1="Sign Up for Prizes: Your Gateway to Gaming Rewards!"
      description2="Game for Glory, Play for Prizes: Join the Challenge!"
      image={signupImg}
      formType="signup"
    />
  )
}

export default Signup
