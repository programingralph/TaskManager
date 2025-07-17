import {useNavigate} from "react-router-dom";

export default function Logout() {
    const navigate = useNavigate();

    const handLogout = () => navigate("/");

    return (
        <header className='fixed top-0 w-full bg-[#d3c1ab] flex justify-between items-center px-4 py-2'>
            <img src="../logo.png" alt="Logo" className='w-[200px]' />
            <div className='flex space-x-4'>
                <button onClick={handLogout} className='bg-[#5a4637] text-white px-4 py-2 rounded-md shadow-sm 
                hover:bg-[#6e5641] transition-colors duration-200'>
                    Logout
                </button> 
            </div>
        </header>
    )
}
