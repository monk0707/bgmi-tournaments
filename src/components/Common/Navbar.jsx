import { useEffect, useState } from "react"
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai"
import { BsChevronDown } from "react-icons/bs"
import { useSelector } from "react-redux"
import { Link, matchPath, useLocation } from "react-router-dom"

import logo from "../../assets/Logo/Logo-Full-Light.png"
import { NavbarLinks } from "../../data/navbar-links"
import { apiConnector } from "../../services/apiConnector"
// import { categories } from "../../services/apis"
import { ACCOUNT_TYPE } from "../../utils/constants"
import ProfileDropdown from "../core/Auth/ProfileDropdown"

// const subLinks = [
//   {
//     title: "Python",
//     link: "/catalog/python",
//   },
//   {
//     title: "javascript",
//     link: "/catalog/javascript",
//   },
//   {
//     title: "web-development",
//     link: "/catalog/web-development",
//   },
//   {
//     title: "Android Development",
//     link: "/catalog/Android Development",
//   },
// ];

function Navbar() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { totalItems } = useSelector((state) => state.cart)
  const location = useLocation()

  const[flag,setFlag] = useState(false)

  // const [subLinks, setSubLinks] = useState([])
  const [loading, setLoading] = useState(false)

  function trippleDotClick(){
    if(flag){
      setFlag(false);
    }
    else{
      setFlag(true);
    }
  }

  // useEffect(() => {
  //   ;(async () => {
  //     setLoading(true)
  //     try {
  //       const res = await apiConnector("GET", categories.CATEGORIES_API)
  //       setSubLinks(res.data.data)
  //     } catch (error) {
  //       console.log("Could not fetch Categories.", error)
  //     }
  //     setLoading(false)
  //   })()
  // }, [])

  // console.log("sub links", subLinks)

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  return (

    <div>

    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 ${
        location.pathname !== "/" ? "bg-richblack-800" : ""
      } transition-all duration-200`}
    >
      {/* <div className="">     dono divs ka combined  flex flex-col lg:flex lg:flex-row */}
      <div className="flex w-11/12 lg:w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}
      {/*    logo+links except login and signup     */}
      {/* <div className=""> */}
        <Link to="/" className="hidden lg:block">
          <img src={logo} alt="Logo" width={160} height={32} loading="lazy" />  {/*  */}
        </Link>
        {/* Navigation links */}
        <nav className="mr-4">    {/* hidden md:block */}
          <ul className="flex lg:gap-x-6 gap-x-2 text-sm lg:text-lg text-richblack-25">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {/* {link.title === "Catalog" ? (
                  <>
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      <p>{link.title}</p>
                      <BsChevronDown />
                      <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                        <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                        {loading ? (
                          <p className="text-center">Loading...</p>
                        ) : !Array.isArray(subLinks) || subLinks.length ? (
                          <>
                            {subLinks
                              ?.filter(
                                (subLink) => subLink?.courses?.length > 0
                              )
                              ?.map((subLink, i) => (
                                <Link
                                  to={`/catalog/${subLink.name
                                    .split(" ")
                                    .join("-")
                                    .toLowerCase()}`}
                                  className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                  key={i}
                                >
                                  <p>{subLink.name}</p>
                                </Link>
                              ))} */}
                          {/* </> */}
                        {/* ) : ( */}
                        {/* {(
                          <p className="text-center">No Courses Found</p>
                        )}
                      </div>
                    </div>
                  </>
                ) : ( */}
                {(
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* </div> */}
        {/* Login / Signup / Dashboard */}
        {/* <div className="flex flex-row">    login signup */}
        <div className=" items-center lg:gap-x-4 gap-x-2 lg:flex"> {/* hidden md:flex*/}
          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart className="text-2xl text-richblack-100 hidden lg:block" />
              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {token === null && (
            <Link to="/login" className="px-[4px] py-[4px]">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 p-[2px] lg:px-[12px] lg:py-[8px] text-richblack-100 text-sm lg:text-lg">
                Login
              </button>
            </Link>
          )}
          {token === null && (
            <Link to="/signup" className="px-[4px] py-[4px]">
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 p-[2px] lg:px-[12px] lg:py-[8px] text-richblack-100 text-sm lg:text-lg">
                Signup
              </button>
            </Link>
          )}
          {token !== null && <ProfileDropdown />}
        </div>

        {/* tripple dot :  */}
        {/* <button className="mr-4 md:hidden" onClick={trippleDotClick}>  
          <AiOutlineMenu fontSize={24} fill="#AFB2BF"/>
        </button> */}
      </div>
      </div>
    </div>
    // </div>
  )
          
}

export default Navbar
