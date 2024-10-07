import React, { act, useContext, useEffect, useState } from 'react'
import { AiOutlineRollback } from "react-icons/ai";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShopify } from "react-icons/fa";
import { IoIosRemoveCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import CartProvider, { CartContext } from './cartContext';
import { ToastContainer, toast } from 'react-toastify'
import { RiDropdownList } from "react-icons/ri";
import AOS from "aos";
import "aos/dist/aos.css";
const ProductDetails = ({ }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { stored, sshopLists, sLists, sid } = location.state;
    const [currentItem, setCurrentItem] = useState(stored);
    const [expand, setExpand] = useState(false)
    const { cartLists, setCartLists } = useContext(CartContext);
    const { totalCount, setTotalCount } = useContext(CartContext);
    const [clickColor, setClickColor] = useState();
    const [count, setCount] = useState(1)
    const [actImg, setActImg] = useState(0);
    const [size, setSize] = useState('Select Size');
    const { shopId } = location.state;

    useEffect(() => {
        AOS.init({
            duration: 200,
            easing: "ease-in-out",
            once: true,
        });
        if (cartLists.length !== 0) setTotalCount(cartLists.reduce((acc, cartItem) => acc + cartItem.count, 0))
    }, [cartLists, totalCount]);
    const handleImgOnclick = (ind) => {
        setActImg(ind);
    }
    const setColor = (hex) => {
        if (hex === clickColor)
            setClickColor();
        else
            setClickColor(hex);
    }
    const toastMsg = (status, detail) => {
        switch (status) {
            case 'success': return toast.success(detail);
            case 'fail': return toast.error(detail);
        }
    }
    const chooseSize = (s) => {
        setSize(s);
        setExpand(!expand);
    }
    const handleCount = (status) => {
        if (status === 'add' && count < currentItem.initialstock) setCount(count + 1);
        else if (status === 'remove' && count !== 1) setCount(count - 1);
    }
    const addtocart = () => {
        if (currentItem.initialstock === 0)
            return toastMsg('fail', 'Out of Stock!');
        if (!clickColor) {
            return toastMsg('fail', 'Please select one Color!');
        }
        if (size === 'Select Size') {
            return toastMsg('fail', 'Please select one Size!');
        }
        setCartLists((prevCartItems) => {
            const exist = prevCartItems.find((item) => item._id === currentItem._id && item.color === clickColor && item.size === size && item.shopId === currentItem.shopId);
            if (exist) {
                const newCount = exist.count + count;
                if (newCount <= stored.initialstock) {
                    setCurrentItem((prevStored) => ({
                        ...prevStored,
                        initialstock: currentItem.initialstock - count,
                    }))
                    setColor();
                    setSize('Select Size');
                    setCount(1);
                    toastMsg('success', 'added');
                    return prevCartItems.map((item) =>
                        item._id === currentItem._id && item.color === clickColor && item.size === size ? { ...item, count: newCount } : item
                    )
                } else {
                    toastMsg('fail', `only ${currentItem.initialstock} in Stock!`);
                    return prevCartItems
                }

            } else {
                if (count <= stored.initialstock) {
                    setCurrentItem((prevStored) => ({
                        ...prevStored,
                        initialstock: currentItem.initialstock - count,
                    }))
                    setColor();
                    setSize('Select Size');
                    setCount(1);
                    toastMsg('success', 'added');
                    return [...prevCartItems, { ...currentItem, color: clickColor, size, count }];
                } else {
                    toastMsg('fail', `Only ${currentItem.initialstock} in stock!`);
                    return prevCartItems;
                }
            }
        })
    }
    const backToProduct = () => {
        navigate('/product', { state: { shopLists: sLists, shopId: sid } })
    }
    return (
        <CartProvider>
            <div className='w-screen h-screen'>
                <ToastContainer
                    position="top-center"
                    autoClose={1000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <div className='w-full h-[8%] flex  justify-between bg-obsidian text-whitev1 items-center px-4'>
                    <button className=' transition-all duration-[200ms] active:scale-[0.95] flex items-center p-2 rounded-sm hover:bg-whitev1 hover:bg-opacity-20'
                        onClick={backToProduct}
                    ><AiOutlineRollback className='text-xl mr-2' />Back to Product</button>
                    <div className='flex'>
                        <button className=' transition-all duration-[200ms] active:scale-[0.95] flex items-center p-2 rounded-sm hover:bg-whitev1 hover:bg-opacity-20'
                            onClick={() => navigate('/cart')}
                        >
                            Cart<FaShopify className='ml-1' />
                            <span className='ml-1 text-whitev1'>{totalCount}</span>
                        </button>


                    </div>

                </div>
                <div className='w-full h-[92%] flex justify-center items-center'>

                    {
                        stored ?
                            <div className='xl:w-2/3 xl:h-2/3 sm:w-[90%] sm:h-[90%] rounded-md flex xl:flex-row sm:flex-col items-center justify-center xl:pr-10'>
                                <div className='xl:w-1/2 sm:w-full h-full flex items-center relative' >

                                    <div className='w-1/6  h-full overflow-x-hidden overflow-y-auto'>
                                        {
                                            currentItem.imgSrcs.length > 1 ? currentItem.imgSrcs.map((image, index) => (

                                                <img key={index} src={image} alt="" className='transition-all duration-[200ms] w-full cursor-pointer border-4 border-whitev1 border-opacity-55 mb-2 hover:scale-[1.06]' onClick={() => handleImgOnclick(index)} />

                                            )) : ''
                                        }
                                    </div>
                                    <div className={`${currentItem.imgSrcs.length > 1 ? 'w-5/6' : 'w-full'}  ml-4 h-[80%]`}>
                                        <img src={currentItem.imgSrcs[actImg]} alt="" className='w-full h-full' />
                                    </div>
                                    {
                                        sshopLists?.map((shop) => (
                                            shop.shopId === currentItem.shopId &&
                                            < img key={shop.shopId} src={shop.shopLogo} alt="" className='w-[50px] h-[50px] absolute bg-obsidian p-1 bg-opacity-45 rounded-full top-0 left-[20%]' />
                                        ))
                                    }
                                </div>
                                <div className='xl:w-1/2 sm:w-full flex justify-around h-[80%] flex-col'>
                                    <div className='w-full text-obsidian xl:pl-4 text-xl flex flex-col justify-center '>
                                        <div className='w-full flex justify-between mb-2'>
                                            <div className='w-1/4 text-start'>Name</div>
                                            <div className='w-3/4 text-end'>{currentItem.productname}</div>
                                        </div>
                                        <div className='w-full flex justify-between mb-2'>
                                            <div className='w-1/4 text-start'>Description</div>
                                            <div className='w-3/4 text-end'>{currentItem.description}</div>
                                        </div>
                                        <div className='w-full flex justify-between mb-2'>
                                            <div className='w-1/4 text-start'>Price</div>
                                            <div className='w-3/4 text-end'>{currentItem.price} MMK</div>
                                        </div>
                                        <div className='w-full flex justify-between mb-2 relative'>
                                            <div className='w-1/4 text-start'>Size</div>
                                            <div className='border-2 px-1 py-[0.5] cursor-pointer border-obsidian rounded-sm flex items-center text-[0.9rem]'
                                                onClick={() => setExpand(!expand)} >{size}<RiDropdownList className='ml-4 cursor-pointer text-xl' /></div>
                                            {
                                                expand ?
                                                    <div data-aos='zoom-in' className='absolute w-1/2 right-[50%] top-[-350%] bg-obsidian h-[220px] z-30 bg-opacity-50 p-2 bg-glass-morph rounded-md overflow-auto'>
                                                        {
                                                            currentItem.size.map((siz, index) => (
                                                                <div key={index} className={`transition-all duration-[150ms] px-2 py-1 text-white text-[1rem] mb-1 rounded-md bg-opacity-30 cursor-pointer hover:bg-opacity-60 active:scale-[0.9] ${siz === size ? 'bg-black' : 'bg-whitev1 '}`} onClick={() => chooseSize(siz)}>
                                                                    {siz}
                                                                </div>
                                                            ))
                                                        }
                                                    </div> : ''
                                            }

                                        </div>
                                        <div className='w-full flex justify-between mb-2'>
                                            <div className='w-1/4 text-start'>Colors</div>
                                            <div className='w-3/4 text-end flex justify-end'>
                                                {
                                                    currentItem.color.length > 0 ?
                                                        currentItem.color.map((clr, index) => (
                                                            <div key={index} className={`w-[30px] cursor-pointer ml-2 h-[30px] rounded-full border-obsidian border-[2px] relative flex justify-center`} style={{ backgroundColor: clr }}
                                                                onClick={() => setColor(clr)}
                                                            >
                                                                <div className={`transition-all duration-[200ms] absolute rounded-full  w-[5px] h-[5px] bg-obsidian bg-opacity-75 ${clr === clickColor ? 'bottom-[-30%]' : 'bottom-[50%] -z-10'} `}></div>
                                                            </div>
                                                        )) : <div>no Color</div>
                                                }
                                            </div>
                                        </div>
                                        <div className='w-full flex justify-between'>
                                            <div className='w-1/4 text-start'>Stock</div>
                                            <div className='w-3/4 text-end'>{currentItem.initialstock}</div>
                                        </div>
                                    </div>
                                    <div className='w-full h-[15%] flex items-end  justify-between text-whitev1'>
                                        <div className='w-1/3 sm:h-full xl:h-[80%] flex bg-obsidian justify-evenly text-obsidian text-xl mr-2 rounded-sm bg-opacity-25 items-center '>
                                            <div className=' transition-all duration-[200ms] cursor-pointer hover:rotate-90 active:scale-[1.5]' onClick={() => handleCount('add')}><IoIosAddCircle /></div>
                                            <div>{count}</div>
                                            <div className='transition-all duration-[200ms] cursor-pointer hover:rotate-180 active:scale-[1.5]' onClick={() => handleCount('remove')}><IoIosRemoveCircle /></div>
                                        </div>
                                        <div className='w-2/3 flex h-full justify-end items-end'>
                                            <button className='transition-all duration-[200ms] w-[120px] mr-1 xl:h-[80%] sm:h-full bg-cherry rounded-sm flex items-center justify-center active:scale-[1.1]'
                                                onClick={addtocart}
                                            >Add to Cart</button>
                                            <button className='w-[120px] xl:h-[80%] sm:h-full bg-customBluishPurple flex items-center justify-center rounded-sm' onClick={() => navigate('/product', { state: { shopId } })}>Browse More</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : <div className='text-obsidian'> No Product Details! </div>
                    }
                    {/* <div className='w-1/3 h-full bg-obsidian bg-opacity-80'>
                    <div className='text-whitev1 text-center h-[6%] flex items-center justify-center'>Cart Details</div>
                </div> */}

                </div>

            </div >
        </CartProvider >
    )
}

export default ProductDetails
