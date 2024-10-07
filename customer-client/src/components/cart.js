import React, { useContext, useEffect, useState } from 'react'
import NavBar from './navbar'
import { useLocation } from 'react-router-dom';
import { CartContext } from './cartContext';
import { BiSolidPurchaseTagAlt } from "react-icons/bi";
import { MdWatchLater } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios';
import { TiDeleteOutline } from "react-icons/ti";
import dataGif from '../assets/gif/data-transfer-unscreen.gif'
const Cart = ({ token }) => {
    const active = 2
    const { cartLists, setCartLists, totalCount, setTotalCount } = useContext(CartContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [popping, setPopping] = useState(false);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const username = localStorage.getItem('username');
    const [clickImg, setClickImg] = useState(false);
    const [clickInd, setClickInd] = useState();
    const [phone, setPhone] = useState('');

    useEffect(() => {
        countTotalPrice();
        setTotalCount(cartLists.reduce((acc, cartItem) => acc + cartItem.count, 0))
    }, [cartLists]);

    const toastMsg = (status, detail) => {
        switch (status) {
            case 'success': return toast.success(detail);
            case 'fail': return toast.error(detail);
        }
    }
    const countTotalPrice = () => {
        let newTotal = 0
        cartLists.map((cartItems) => {
            newTotal += cartItems.count * cartItems.price;
        });
        setTotalPrice(newTotal)
    }

    const buynow = async () => {
        if (address.trim() === '') {
            return toastMsg('fail', 'Address Required!');
        }

        setLoading(true);

        // Group products by shopId
        console.log(cartLists)
        const groupedOrders = cartLists.reduce((acc, item) => {
            if (!acc[item.shopId]) acc[item.shopId] = [];
            acc[item.shopId].push({
                productId: item._id,
                name: item.productname,
                desc: item.description,
                imgSrcs: item.imgSrcs,
                quantity: item.count,
                size: item.size,
                color: item.color,
                priceEach: item.price,
                shopId: item.shopId
            });
            return acc;
        }, {});
        console.log(groupedOrders)
        // For each shopId, split into batches of 2 and send them separately
        for (const shopId in groupedOrders) {
            const products = groupedOrders[shopId];

            // Split products into chunks of 2
            for (let i = 0; i < products.length; i += 2) {
                const orderBatch = products.slice(i, i + 2); // Get a batch of up to 2 products

                // Prepare the order data
                const orderData = {
                    orderedproduct: orderBatch,
                    customername: username,
                    address: address,
                    status: 'Pending',
                    phone: phone
                };

                try {
                    // Send the order to MongoDB (or any backend service)
                    await axios.post('https://multishop-ecommerce.onrender.com/api/order/placeOrder', orderData, {
                        headers: {
                            'x-access-token': token
                        }
                    });
                } catch (error) {
                    console.error('Error placing order:', error);
                    toastMsg('fail', 'Failed to place the order!');
                }
            }
        }

        // After successful order placement
        setAddress('');
        setPhone('');
        setTimeout(() => {
            setLoading(false);
            toastMsg('success', 'Order Placed Successfully!');
            setPopping(false);
            setCartLists([]);  // Clear the cart
        }, 2000);
    };


    const setQtyCart = (id, op, siz, clr) => {
        setCartLists((prevCart) => {
            const updatedCart = prevCart.map((cartItem) => {
                if (cartItem._id === id && cartItem.size === siz && cartItem.color === clr) {
                    const newCount = op === 'add' ? cartItem.count + 1 : cartItem.count - 1;
                    if (newCount > 0 && newCount <= cartItem.initialstock)
                        return { ...cartItem, count: newCount };
                }
                return cartItem;
            });
            const newTotalCount = updatedCart.reduce((acc, cartItem) => acc + cartItem.count, 0);
            setTotalCount(newTotalCount);

            return updatedCart;
        });
    }
    const deleteItem = (id, siz, clr) => {
        setCartLists((prevCart) => {
            const updatedCart = prevCart.filter((cartItem) => !(cartItem._id === id && cartItem.size === siz && cartItem.color === clr))
            const newTotalCount = updatedCart.reduce((acc, cartItem) => acc + cartItem.count, 0);
            setTotalCount(newTotalCount);

            return updatedCart;
        });

    };
    const handleClickImg = (ind) => {
        setClickInd(ind);

        setClickImg(!clickImg);
    }
    return (
        <div className='w-screen h-screen relative'>
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
            <div className='fixed w-full h-[60px] z-50'>
                <NavBar scroll={true} actInd={active} />
            </div>
            <div className=' w-full h-[90%] bg-whitev1 flex items-end justify-center '>
                <div className='xl:w-2/3 sm:w-full h-5/6 bg-white rounded-t-lg sm:overflow-auto xl:overflow-hidden'>
                    <div className='xl:w-full sm:w-[700px] h-[6%] bg-obsidian rounded-t-lg mb-2 wel-font bg-opacity-40 flex px-2 items-center'>
                        <div className='xl:w-[5%] sm:w-[5%]'>no</div>
                        <div className='w-[25%]'>product name</div>
                        <div className='w-[15%]  sm:text-center xl:text-start'>size</div>
                        <div className='w-[10%] xl:text-center text-end'>color</div>
                        <div className='w-[15%] xl:text-center text-end'>quantity</div>
                        <div className='w-[10%] text-end'>Price</div>
                        <div className='w-[10%] text-end'>Image</div>
                    </div>
                    <div className='xl:w-full sm:w-[700px] h-[95%]  relative'>
                        {
                            cartLists.map((item, index) => (
                                <div key={item._id} className='flex justify-center  w-full px-2 wel-font font-semibold hov-del h-[8%] items-center bg-obsidian text-whitev1 bg-opacity-80 my-[0.5px] '>
                                    <div className='w-[5%] '>{index + 1}</div>

                                    <div className='w-[25%]'>{item.productname}</div>

                                    <div className='w-[15%] xl:pl-0 pl-2 xl:text-start'>{item.size}</div>

                                    <div className='w-[10%] flex justify-center'>
                                        <div className='w-[20px] h-[20px] rounded-full' style={{ backgroundColor: item.color }}></div>
                                    </div>

                                    <div className='w-[15%] flex items-center justify-center'>
                                        <div className='transition-all duration-[200ms] px-2 active:scale-[0.9] cursor-pointer hover:bg-whitev1 hover:bg-opacity-45'
                                            onClick={() => setQtyCart(item._id, 'add', item.size, item.color)}
                                        >+</div>
                                        <div>{item.count}</div>
                                        <div className='transition-all duration-[200ms] px-2 active:scale-[0.9] cursor-pointer hover:bg-whitev1 hover:bg-opacity-45'
                                            onClick={() => setQtyCart(item._id, 'remove', item.size, item.color)}
                                        >-</div>
                                    </div>

                                    <div className='xl:w-[10%]  text-end'>{(item.price) * (item.count)}$</div>

                                    <div className='w-[10%] h-full flex items-center justify-end'>
                                        <img src={item.imgSrcs[0]} alt="" className={`transition-all ease-linear duration-300 w-[40px] h-[40px] hover:bg-obsidian hover:bg-opacity-50 active:scale-[0.9] cursor-pointer ${clickImg && clickInd === item.imgSrcs[0] ? 'absolute bg-obsidian bg-opacity-75 scale-[5] xl:bottom-[20%] xl:left-[47%] sm:top-[50%] sm:left-[70%] rounded-sm' : ''}`} onClick={() => handleClickImg(item.imgSrcs[0])} />
                                    </div>
                                    <div className='w-[10%] flex justify-end'>
                                        <button className='hidden del-tar text-2xl text-red-500'
                                            onClick={() => deleteItem(item._id, item.size, item.color)}
                                        ><TiDeleteOutline /></button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='w-full h-[8%] bg-obsidian text-white flex items-center wel-font py-6 fixed bottom-0'>
                <div className='w-1/3 h-full border-r-2 flex items-center justify-end px-6 py-2'>Total </div>
                <div className='w-1/3 h-full text-end font-semibold flex items-center justify-start pl-6'>{totalPrice}$</div>
                {
                    totalCount > 0 ?
                        <div className='w-1/3 h-full flex items-center justify-end mr-10 '>
                            <button className=' transition-all duration-[200ms] active:scale-[0.95] flex items-center p-2 rounded-sm bg-whitev1 bg-opacity-20' onClick={() => setPopping(true)}>
                                Buy Now<BiSolidPurchaseTagAlt className='ml-1 text-xl' />
                            </button>
                        </div> : ""
                }
            </div>
            {
                popping ?
                    <div className='absolute w-full h-full bg-obsidian top-0 left-0 bg-opacity-55 bg-glass-morph flex items-center justify-center'>
                        <div className='xl:w-2/5 w-[90%] h-[30%] bg-whitev1 bg-opacity-70 bg-bg-glass-morph rounded-md'>
                            <div className='w-full h-[20%] flex items-center justify-center wel-font font-semibold bg-obsidian rounded-t-md bg-opacity-85 bg-bg-glass-morph text-whitev1'> Please {loading ? 'Wait, Placing Order!' : 'Enter your address!'} </div>
                            {
                                loading ?
                                    <div className='h-[80%] flex justify-center'>
                                        <img src={dataGif} alt="" className='xl:w-[40%]  h-full' />
                                    </div>
                                    :
                                    <div className='h-[80%]'>
                                        <div className='w-full p-4 h-[70%] bg-whitev1 flex items-end justify-between'>
                                            <div className='w-2/3'>
                                                <input value={address} type="text" className='xl:w-full h-[50%] p-2 rounded-sm outline-none mb-2' placeholder='Address' autoFocus onChange={(e) => setAddress(e.target.value)} />
                                                <input value={phone} type="text" className='xl:w-full  h-[50%] p-2 rounded-sm outline-none' placeholder='Phone number' autoFocus onChange={(e) => setPhone(e.target.value)} />
                                            </div>
                                            <button className=' transition-all h-[45%] xl:w-[20%] duration-[200ms] active:scale-[0.95] flex items-center justify-center p-2 rounded-sm bg-obsidian bg-opacity-90 text-white' onClick={buynow}>
                                                Buy Now<BiSolidPurchaseTagAlt className='ml-1 text-xl xl:block hidden' />
                                            </button>
                                        </div>
                                        <div className='w-full flex items-center h-[30%] justify-center p-2'>
                                            <button className=' transition-all xl:h-[100%] xl:w-[35%]  duration-[200ms] active:scale-[0.95] flex items-center justify-center p-2 rounded-sm bg-whitev1 bg-opacity-50 text-obsidian' onClick={() => setPopping(false)}>
                                                Buy Later!<MdWatchLater className='text-xl ml-2' />
                                            </button>
                                        </div>
                                    </div>
                            }

                        </div>
                    </div>
                    : ''
            }
        </div>
    )
}

export default Cart
