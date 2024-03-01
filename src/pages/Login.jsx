import loginImg from "../assets/Images/login.jpeg"
import Template from "../components/core/Auth/Template"

function Login() {
  return (
    <Template
      title="Welcome Back"
      description1="Log In for Prizes: Your Gateway to Gaming Rewards!"
      description2="Game for Glory, Play for Prizes: Join the Challenge!"
      image={loginImg}
      formType="login"
    />
  )
}

export default Login
