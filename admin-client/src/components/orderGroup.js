import React, { useState } from 'react'
import { IoMdMore } from "react-icons/io";


const OrderGroup = ({ role, itemsPerPage, orderLists, setTop, clickItem, setClickItem, setNo, setOrderStatus, expand, setExpand, date, status, oind, stList, allShop }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = orderLists?.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = orderLists?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const handlePageChange = (index) => {
        setCurrentPage(index);
    }
    const handleMore = (obj, ind) => {
        setExpand(!expand)
        setClickItem(obj);
        setNo(ind);
    }
    const popUp = () => {
        setTop('top-[0%]');
        setExpand(!expand)
    }
    return (
        orderLists?.length === 0 || !orderLists ?
            <div className='w-full h-full bg-obsidian text-whitev3 text-xl flex justify-center items-center'>
                <div className='pr-2'>No</div><span className='capitalize pr-1'> {oind !== 0 && status[oind]} Orders</span>  {date && 'for ' + date.toLocaleDateString('us-CA')}
            </div>
            :
            <div className='w-full h-full bg-obsidian bg-opacity-10  '>
                <div className='w-full h-[5%] flex items-center px-2 bg-obsidian bg-opacity-40'>
                    <div className='w-[10%]'>No</div>
                    <div className='w-[20%] first-letter:border-black'>Customer Name</div>
                    <div className='w-[20%] '>Address</div>
                    <div className='w-[15%] text-center '>Shop</div>
                    <div className='w-[10%] text-center'>Total Item</div>
                    <div className='w-[10%] text-end'>Total Price</div>
                    <div className='w-[8%] text-center'>Status</div>
                </div>
                <div className='w-full h-[87.8%] overflow-auto'>
                    {
                        currentItems?.map((order, index) => (
                            <div key={order._id} className={`w-full cursor-pointer h-[8%] flex items-center px-2 bg-obsidian text-white ${index !== currentItems.length - 1 ? 'border-b-2 border-whitev2' : ''}`}>
                                <div className='w-[10%]'>{index + 1}</div>
                                <div className='w-[20%] capitalize '>{order.customername}</div>
                                <div className='w-[20%] border-black'>{order.address.slice(0, 20) + '...'}</div>
                                <div className='w-[15%] flex justify-center items-center'>
                                    {
                                        (() => {
                                            const firstProduct = order.orderedproduct[0];
                                            const matchedShop = allShop.find(shop => shop.shopId === firstProduct.shopId);

                                            return matchedShop && (
                                                <img
                                                    src={matchedShop.shopLogo}
                                                    alt="Shop Logo"
                                                    className='w-[40px] bg-white bg-opacity-45 p-1 rounded-full'
                                                />
                                            );
                                        })()
                                    }
                                </div>

                                {/* <div className='w-[15%] flex justify-center items-center'>
                                    {
                                        order.orderedproduct.map((order) => (
                                            allShop.map((shop) => (
                                                shop.shopId === order.shopId &&
                                                <img key={shop.shopId} src={shop.shopLogo} alt="" className='w-[40px] bg-whitev2 bg-opacity-25 p-1 rounded-full' />
                                            ))
                                        ))
                                    }
                                </div> */}
                                <div className='w-[10%] border-black text-center'>{order.orderedproduct.reduce((acc, product) => acc + (product.quantity), 0)}</div>
                                <div className='w-[10%] border-black text-end'>{order.orderedproduct.reduce((acc, product) => acc + (product.priceEach * product.quantity), 0)} MMK</div>
                                <div className='w-[8%] flex items-center justify-center'>

                                    {
                                        stList.map((status, index) => (
                                            status.status === order.status.charAt(0).toUpperCase() + order.status.slice(1) &&
                                            <div className='w-[10px] h-[10px] rounded-full' style={{ backgroundColor: status.color }}>

                                            </div>
                                        ))
                                    }
                                </div>
                                <div className='w-[4%]  flex justify-center items-center active:bg-opacity-20 hover:bg-white hover:bg-opacity-10 py-1 relative'

                                ><IoMdMore className='text-xl w-[30px] h-full' onClick={() => handleMore(order, index)} />
                                    {
                                        (expand && clickItem._id === order._id) &&
                                        <div className='bg-whitev3 w-[180px] overflow-x-auto flex flex-col justify-center left-[-130px] rounded-sm top-[110%] z-10 absolute text-obsidian px-[1px] font-semibold text-[0.9rem] shadow-sm shadow-obsidian'>

                                            <div className=' border-obsidian hover:bg-obsidian hover:bg-opacity-20 px-2 flex items-center justify-between py-2'
                                                onClick={popUp}
                                            >
                                                Details
                                            </div>
                                            {
                                                stList.map((status, index) => (
                                                    role === 'shop admin' &&
                                                    clickItem.status.toLowerCase() !== status.status.toLowerCase() && clickItem.status.toLowerCase() !== 'cancelled' && clickItem.status.toLowerCase() !== 'decline' &&
                                                    <div key={index} className=' border-obsidian hover:bg-obsidian hover:bg-opacity-20 p-2 flex items-center justify-between'
                                                        onClick={() => setOrderStatus(true, clickItem.status, status.status)}
                                                    >

                                                        <div className='flex h-full w-full items-center justify-between'>
                                                            {
                                                                status.status
                                                            }
                                                            <div className='w-[10px] h-[10px] rounded-full' style={{ backgroundColor: status.color }}></div>
                                                        </div>


                                                    </div>
                                                ))
                                            }

                                        </div>
                                    }

                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className='h-[5%] w-full flex justify-end mt-2 px-2'>
                    <button className='cursor-pointer w-[60px] h-full bg-customBluishPurple text-white' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Prev
                    </button>
                    {
                        Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={`${index === 0 ? 'ml-1' : ''} ${index === totalPages - 1 ? 'mr-1' : ''} cursor-pointer wel-font transition-all duration-[200ms] w-[50px] ${index + 1 === currentPage ? 'bg-obsidian bg-opacity-50' : ' bg-slate-200'}  h-full rounded-sm hover:bg-obsidian hover:bg-opacity-45`}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))
                    }
                    <button className='cursor-pointer w-[60px] h-full bg-cherry text-white' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>


            </div >
    )
}

export default OrderGroup
