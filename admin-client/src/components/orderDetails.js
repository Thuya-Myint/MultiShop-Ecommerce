import React, { act, useState } from 'react'
import { FaAnglesDown } from "react-icons/fa6";
import Loading from './loading'
import axios from 'axios';
import { FaSortUp } from "react-icons/fa6";
import { FaSortDown } from "react-icons/fa6";

const OrderDetails = ({ role, token, top, setTop, clickItem, setClickItem, no, loading, setOrderStatus, updateOnDelete, stList, allShop }) => {
    const [deleting, setDeleting] = useState(false);

    const deleteEach = async (id, clr, size) => {
        let tempRemainingList = [];
        clickItem?.orderedproduct.map((item) => {
            if (item.productId !== id || item.color !== clr || item.size !== size) {
                tempRemainingList.push(item);
            }
        })
        console.log(tempRemainingList.length)
        setClickItem((prevItem) => ({
            ...prevItem,
            orderedproduct: tempRemainingList,
            totalQty: tempRemainingList.length
        }));
        if (tempRemainingList.length === 0) {
            setOrderStatus('true', 'Cancelled');
        }
        else {

            try {
                await axios.put(`http://localhost:8090/api/order/order/${clickItem._id}`, {
                    ...clickItem,
                    orderedproduct: tempRemainingList,
                    totalQty: tempRemainingList.length
                }, {
                    headers: {
                        'x-access-token': token
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }
        updateOnDelete('delete')

    }
    const modifyItemCount = async (action, id, color, size) => {
        const { data: product } = await axios.get(`http://localhost:8090/api/product/findProduct/${id}`);
        try {
            setClickItem((prevClickItem) => {
                return {
                    ...prevClickItem,
                    orderedproduct: prevClickItem?.orderedproduct?.map((order) => {
                        if (order.productId === id && order.color === color && order.size === size) {
                            if (action === '+' && order.quantity < product.initialstock) {
                                return { ...order, quantity: order.quantity + 1 };
                            } else if (action === '-' && order.quantity > 1) {
                                return { ...order, quantity: order.quantity - 1 };
                            }
                        } return order;
                    })
                }
            })

        } catch (error) {
            console.log(error);
        }
        console.log(clickItem)
    }
    return (

        loading ?
            <div className='absolute w-full h-full bg-obsidian flex flex-col justify-center items-center bg-opacity-35 bg-loading top-0 left-0'>
                <div className='fetch-text'>Fetching Data . . . </div>
                <div className='flex text-2xl w-[200px] h-[4px] bg-white mt-4 rounded-full'>
                    <div className='load-stick bg-customBluishPurple'></div>
                </div>
            </div>
            :
            < div className='h-full w-full overflow-y-hidden' >
                {
                    top !== 'top-[100%]' &&
                    <div className={`transition-all duration-500 absolute top-0 left-0 w-full h-full bg-obsidian bg-opacity-60`}>
                    </div>
                }
                <div className={` transition-all duration-[600ms] w-full h-full  bg-whitev2 bg-opacity-100  text-whitev2 absolute ${top}`}>

                    <div className='w-full h-[6%] bg-obsidian border-b-2 border-whitev2 border-opacity-10 flex items-center justify-between px-2'>
                        <div className='w-[70%] flex items-center'>
                            <div className='border-r-[1px] px-2 mr-2'>Order Details - {clickItem && no + 1}</div>
                            <div className='flex items-center h-full'>
                                {
                                    stList?.map((status, index) => (
                                        status.status === clickItem?.status &&
                                        < div key={index} className='w-[10px] h-[10px] rounded-full' style={{ backgroundColor: status.color }}></div>
                                    ))
                                }
                                <div className='flex items-center ml-1'>
                                    {clickItem && clickItem?.status}
                                </div>

                            </div>
                            <div className='ml-4 bg-whitev2 bg-opacity-20 flex items-center justify-center p-1'>
                                Address
                                <div className='bg-obsidian bg-opacity-45 h-full p-1 ml-1'>{clickItem?.address}</div>
                            </div>
                            <div className='ml-4 bg-whitev2 bg-opacity-20 flex items-center justify-center p-1'>
                                Phone
                                <div className='bg-obsidian bg-opacity-45 h-full p-1 ml-1'>{clickItem?.phone}</div>
                            </div>
                        </div>

                        <div className='flex justify-end bg-whitev2 p-1 bg-opacity-10 active:bg-opacity-35 items-center rounded-md'>
                            <FaAnglesDown className={`cursor-pointer  text-[1rem] z-50 text-xl`} onClick={() => setTop('top-[100%]')} />
                        </div>
                    </div>

                    {
                        clickItem &&
                        <div className='w-full h-[87%] bg-white p-1 gap-1 overflow-y-auto'>
                            {
                                clickItem?.orderedproduct?.map((product, index) =>
                                    <div className='w-full h-[50%] bg-obsidian p-1 rounded-sm bg-opacity-85 flex mb-1'>
                                        <div className='w-1/3 h-full flex items-center justify-center relative'>
                                            <img key={index} src={product.imgSrcs} alt="" className='w-[250px] h-[200px]' />
                                            {
                                                deleting ?
                                                    <button className='absolute top-[2%] left-[1%] bg-red-500 px-2 flex items-center py-1'
                                                        onClick={() => deleteEach(product.productId, product.color, product.size)}
                                                    >
                                                        Delete
                                                    </button> : ''
                                            }
                                            {
                                                allShop.map((shop) => (
                                                    shop.shopId === product.shopId &&
                                                    <img src={shop.shopLogo} alt="" className='w-[50px] p-1 bg-whitev2 bg-opacity-25 absolute top-1 right-2 rounded-full' />
                                                ))
                                            }
                                        </div>
                                        <div className='w-2/3 h-full bg-whitev2 bg-opacity-25 p-2'>
                                            <div className='h-[85%] border-b-[1px]'>
                                                <div className='w-full h-[15%] flex items-center'>
                                                    <div className='w-[30%] text-start'>Product</div>
                                                    <div className='w-[70%] text-end'>{product.name}</div>
                                                </div>
                                                <div className='w-full h-[15%] flex items-center'>
                                                    <div className='w-[30%] text-start'>Description</div>
                                                    <div className='w-[70%] text-end'>{product.desc}</div>
                                                </div>
                                                <div className='w-full h-[15%] flex items-center'>
                                                    <div className='w-[30%] text-start'>Size</div>
                                                    <div className='w-[70%] text-end'>{product.size}</div>
                                                </div>
                                                <div className='w-full h-[15%] flex items-center'>
                                                    <div className='w-[30%] text-start'>Color</div>
                                                    <div className='w-[70%] flex justify-end'>
                                                        <div className='w-[20px] h-[20px] rounded-full' style={{ backgroundColor: product.color }}></div>
                                                    </div>
                                                </div>
                                                <div className='w-full h-[15%] flex items-center'>
                                                    <div className='w-[30%] text-start'>Quantity</div>
                                                    <div className='w-[70%] text-end text-xl'>
                                                        {product.quantity}
                                                    </div>

                                                    {
                                                        clickItem.status.toLowerCase() === 'pending' &&
                                                        <div className='ml-2 h-full flex flex-col justify-center items-center'>
                                                            <FaSortUp className='text-2xl  bg-obsidian bg-opacity-40 pt-1 rounded-sm mb-1 cursor-pointer active:bg-opacity-75' onClick={() => modifyItemCount('+', product.productId, product.color, product.size)} />
                                                            <FaSortDown className='text-2xl bg-obsidian bg-opacity-40 pb-1 rounded-sm cursor-pointer active:bg-opacity-75'
                                                                onClick={() => modifyItemCount('-', product.productId, product.color, product.size)}
                                                            />
                                                        </div>

                                                    }

                                                </div>
                                                <div className='w-full h-[15%] flex items-center'>
                                                    <div className='w-[30%] text-start'>Price</div>
                                                    <div className='w-[70%] text-end'>{product.priceEach * product.quantity}MMK</div>
                                                </div>
                                            </div>
                                            <div className='w-full h-[15%] flex items-center mt-1'>
                                                <div className='w-[30%] text-start'>Total</div>
                                                <div className='w-[70%] text-end'>{product.priceEach * product.quantity}MMK</div>
                                            </div>
                                        </div>

                                    </div>
                                )
                            }
                        </div>
                    }

                    {
                        (clickItem?.status.toLowerCase() === 'pending' && role === 'shop admin') &&
                        <div className='w-full h-[7%] flex items-center px-2 justify-between bg-obsidian absolute bottom-0'>
                            <div className='w-[50%] h-full flex items-center justify-start'>
                                <button className='bg-whitev2 h-[70%] px-2 text-obsidian rounded-sm mr-2'
                                    onClick={() => setDeleting(!deleting)}
                                >Delete Each Product</button>
                            </div>
                            <div className='w-[50%] h-full flex items-center justify-end'>
                                <button className='bg-lagoon h-[70%] px-2 text-obsidian rounded-sm mr-2 flex items-center justify-center'
                                    onClick={() => setOrderStatus(true, 'pending', 'completed')}
                                >Confirm</button>
                                <button className='bg-cherry h-[70%] px-2 rounded-sm text-whitev2 flex items-center justify-center'
                                    onClick={() => setOrderStatus(true, 'pending', 'decline')}
                                >Decline</button>
                            </div>
                        </div>
                    }


                </div >
            </div >

    )
}

export default OrderDetails
