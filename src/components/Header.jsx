import React from "react";
import Login from "../pages/Login";
import {useNavigate} from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();

    const handleLogin = () => navigate("/login");

    const handRegister = () => navigate("/register");

    return (
        <header className='fixed top-0 w-full bg-[#d3c1ab] flex justify-between items-center px-4 py-2'>
            <img src="logo.png" alt="Logo" className='w-[200px]' />
            <div className='flex space-x-4'>
                <button onClick={handleLogin} className='bg-white text-[#333] px-4 py-2 rounded-md shadow-sm 
                hover:bg-[#f0e6db] transition-colors duration-200'>
                    Login
                </button>
                <button onClick={handRegister} className='bg-[#5a4637] text-white px-4 py-2 rounded-md shadow-sm 
                hover:bg-[#6e5641] transition-colors duration-200'>
                    Register
                </button> 
            </div>
        </header>
    )
}




{/* Notes:
      flex justify-between: pushes the logo to the left and the <div> to the right.
      items-center: vertically aligns them in the header.
      space-x-4: adds spacing between the links.
      px-4 py-2: adds horizontal/vertical padding to the header for better spacing.
      ----------------------------------------------------------------------------
      bg-*: sets background colors (white for login, brown for register).
      text-*: controls font color for contrast.
      px-4 py-2: adds padding.
      rounded-md: adds slight corner rounding.
      shadow-sm: subtle shadow for elevation.
      hover:bg-*: adds a hover effect.
      transition-colors duration-200: smooth transition on hover. 
    */}