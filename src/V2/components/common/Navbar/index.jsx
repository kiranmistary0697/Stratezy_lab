import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../../contexts/AuthContext';
import Logo from '../../../assets/Logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import { IoMdMenu, IoMdClose } from "react-icons/io";
import Button from '../Button';
import routes from '../../../constants/Routes';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                sidebarRef.current &&
                !sidebarRef.current.contains(event.target)
            ) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleClickAndClose = (location = '') => {
        if (location) navigate(location);
        setIsSidebarOpen(false);
    };

    return (
        <header className='sticky top-0'>
            <nav className='h-navHeightMobile lg:h-navHeight bg-primary-white lg:shadow-[2px_1px_4px_0px_rgba(1,_1,_1,_0.09)] sticky top-0 z-50'>
                <div className='flex items-center justify-between w-full h-full max-w-maxContent mx-auto px-5 lg:px-[8.4375rem]'>
                    <div className='flex items-center gap-x-10'>
                        <Link to={routes.homepage}>
                            <img src={Logo} alt='logo' className='w-20 lg:w-[5.75rem] h-auto' />
                        </Link>
                        <Link to={routes.products} className='hidden lg:block hover:text-primary-blue-hover transition-all duration-200'>
                            Products
                        </Link>
                    </div>

                    <div className='hidden lg:flex items-center gap-x-5'>
                        {
                            !isAuthenticated ?
                                <>
                                    <Button onClick={() => navigate(routes.signin)}>
                                        Sign in
                                    </Button>
                                    <Button variant='filled' onClick={() => navigate(routes.signup)}>
                                        Request Access
                                    </Button>
                                </> :
                                <>
                                    <Button className='w-full' variant='filled' onClick={() => handleClickAndClose(routes.strategiesRoute)}>
                                        Dashboard
                                    </Button>
                                    <Button
                                        onClick={logout}
                                        className="text-white bg-red-500 hover:bg-red-600 border-none"
                                    >
                                        Logout
                                    </Button>
                                </>
                        }
                    </div>

                    {
                        isSidebarOpen ?
                            <button
                                className='block lg:hidden w-[34px] h-[34px]'
                                onClick={toggleSidebar}
                            >
                                <IoMdClose className='w-full h-full' />
                            </button> :
                            <button
                                className='block lg:hidden w-[34px] h-[34px]'
                                onClick={toggleSidebar}
                            >
                                <IoMdMenu className='w-full h-full' />
                            </button>
                    }
                </div>
            </nav>
            {
                isSidebarOpen &&
                <div ref={sidebarRef} className={`absolute top-0 h-[100dvh] z-40 w-full bg-primary-white pt-[66px] ${isSidebarOpen ? 'right-0' : 'right-[100%]'}`}>
                    <div className='flex flex-col h-full px-5 py-[1.875rem]'>
                        <div className='flex-grow flex flex-col w-full'>
                            <Link onClick={() => setIsSidebarOpen(false)} to={routes.products} className='active:text-primary-blue-hover transition-all duration-200rounded font-medium leading-[19.2px] text-[16px]'>
                                Products
                            </Link>
                        </div>
                        <div className='flex items-center flex-col justify-center gap-y-5'>
                            {
                                !isAuthenticated ?
                                    <>
                                        <Button className='w-full' onClick={() => handleClickAndClose(routes.signin)}>
                                            Sign in
                                        </Button>
                                        <Button className='w-full' variant='filled' onClick={() => handleClickAndClose(routes.signup)}>
                                            Request Access
                                        </Button>
                                    </> :
                                    <>
                                        <Button className='w-full' variant='filled' onClick={() => handleClickAndClose(routes.app)}>
                                            Dashboard
                                        </Button>
                                        <Button
                                            onClick={logout}
                                            className="w-full text-white bg-red-500 hover:bg-red-600 border-none"
                                        >
                                            Logout
                                        </Button>
                                    </>
                            }
                        </div>
                    </div>
                </div>
            }
        </header>
    )
}

export default Navbar
