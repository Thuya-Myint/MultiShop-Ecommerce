import React, { useContext, useEffect, useState } from 'react';
import { FaShopify, FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; // Import hamburger and close icons
import Login from './login';
import { useNavigate } from 'react-router-dom';
import CartProvider, { CartContext } from './cartContext';
import { ImMenu3 } from "react-icons/im";
import { ImMenu4 } from "react-icons/im";

const NavBar = ({ scroll, actInd, prpTotal }) => {
    const navigate = useNavigate();
    const pathLists = ['/home', '/product', '/cart'];
    const navLists = ['Home', 'Products', 'Cart'];
    const [active, setActive] = useState();
    const { cartLists, setCartLists } = useContext(CartContext);
    const { totalCount, setTotalCount } = useContext(CartContext);
    const token = JSON.parse(localStorage.getItem('x-access-token'));
    const [isMenuOpen, setIsMenuOpen] = useState(false); // State for hamburger menu visibility

    const desti = (index) => {
        navigate(pathLists[index], { state: { active: index } });
    };

    useEffect(() => {
        setActive(actInd);
        if (!token) navigate('/');
    }, [cartLists, token]);

    const signOut = () => {
        localStorage.clear();
        window.location.reload();
    };

    return (
        <CartProvider>
            <div className={`text-center w-full h-full bg-obsidian `}>
                <div className='w-full h-full flex text-white items-center text-lg md:justify-between'>

                    {/* Hamburger Icon */}
                    <div className='md:hidden flex items-center ml-2'>
                        <button className='text-[1.8rem] ' onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <ImMenu4 /> : <ImMenu3 />}
                        </button>
                    </div>

                    {/* Nav Links */}
                    <div className={`flex md:w-1/3 h-full items-center justify-start ${isMenuOpen ? 'h-[180px] flex-col absolute left-0 top-full bg-obsidian w-full' : 'hidden md:flex'}`}>

                        <div className={`${isMenuOpen ? 'w-full text-start' : 'w - [100px]'} cursor-pointer mx-4 p-2 ${active === 0 ? 'border-b-2 ' : ''} border-opacity-100 border-whitev1 `}
                            onClick={() => desti(0)}
                        >{navLists[0]}</div>
                        <div className={`${isMenuOpen ? 'w-full text-start' : 'w - [100px]'}  cursor-pointer mx-4 p-2 ${active === 1 ? 'border-b-2 ' : ''} border-opacity-100 border-whitev1 `}
                            onClick={() => desti(1)}
                        >{navLists[1]}</div>
                        <div className={` cursor-pointer flex mx-4 p-2 ${active === 2 && 'border-b-2'} ${isMenuOpen ? 'text-start w-full ' : ''}`} onClick={() => desti(2)}>
                            <div className='mr-2'>{navLists[2]}</div>
                            <FaShopify className='text-2xl' />
                            <span className='ml-1'>{prpTotal ? prpTotal : totalCount}</span>
                        </div>
                        <div className={` ${isMenuOpen ? 'flex' : 'hidden'} cursor-pointer w-full items-center justify-end mr-4 mt-1`}>
                            <div className={`transition-all duration-[200ms] hover:shadow-sm active:scale-[95%] hover:shadow-white  w-[100px] text-sm py-1  bg-white bg-opacity-40  rounded-full  mr-2 bg-glass-morph btn-lg`} onClick={signOut}>Sign Out</div>
                            <div><FaUserCircle className={`text-2xl text-whitev1`} /></div>
                        </div>
                    </div>

                    {/* Search Bar */}

                    <div className=' flex w-full  h-full items-center justify-center text-sm text-black'>
                        <input type="text" placeholder='Search Product' className='w-[300px]  rounded-full px-4 py-1 outline-cherry' />
                    </div>


                    {/* User Actions */}
                    <div className='md:flex sm:hidden w-1/3 h-full cursor-pointer  items-center justify-end mr-4'>
                        <div className={`transition-all duration-[200ms] hover:shadow-sm active:scale-[95%] hover:shadow-white  w-[100px] text-sm py-1  bg-white bg-opacity-40  rounded-full  mr-2 bg-glass-morph btn-lg`} onClick={signOut}>Sign Out</div>
                        <div><FaUserCircle className={`text-2xl text-whitev1`} /></div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {
                    isMenuOpen && (
                        <div className='md:hidden flex flex-col items-start p-4 bg-obsidian w-full h-[180px]'>
                            {/* {navLists.map((item, index) => (
                                <div key={index} className={`w-full cursor-pointer p-2 ${active === index ? 'border-b-2' : ''}`} onClick={() => { desti(index); setIsMenuOpen(false); }}>
                                    {item}
                                </div>
                            ))} */}
                        </div>
                    )
                }
            </div >
        </CartProvider >
    );
};

export default NavBar;
