import { React, useState, useEffect } from 'react'
import Sidebar from '../components/sidebar'
import GroupDate from './dateGroup'
import OrderGroup from './orderGroup'
import axios from 'axios'
import OrderDetails from './orderDetails'

const Order = ({ token, id, username, role, setOrderListDB }) => {
    const active = 3;
    const [expand, setExpand] = useState(false);
    const [orderLists, setOrderLists] = useState([]);
    const [oInd, setOInd] = useState(0);
    const status = ['total', 'Pending', 'confirm', 'decline'];
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [waitingList, setWaitingList] = useState();
    const [declineList, setDeclineList] = useState();
    const [confirmList, setConfirmList] = useState();
    const [cancelledList, setCancelledList] = useState();
    const [total, setTotal] = useState(0);
    const [wait, setWait] = useState(0);
    const [decline, setDecline] = useState(0);
    const [confirm, setConfirm] = useState(0);
    const [cancelled, setCancelled] = useState(0);
    const [top, setTop] = useState('top-[100%]');
    const [clickItem, setClickItem] = useState();
    const [no, setNo] = useState(0);
    const [allList, setAllList] = useState();
    const allLists = [allList, waitingList, confirmList, declineList, cancelledList];
    const [statusList, setStatusList] = useState();
    const [orderShopList, setOrderShopList] = useState([]);
    const [shopList, setShopList] = useState();
    useEffect(() => {
        fetchStatus();
        fetchAllShop();
    }, [id])
    useEffect(() => {
        fetchOrderLists();
    }, [selectedDate, clickItem, id])
    useEffect(() => {
        if (orderLists?.length > 0) {
            calculateTotalStatus();
        }
    }, [orderLists, selectedDate, id]);
    const fetchStatus = async (tv) => {
        try {
            const status = await axios.get('https://multishop-ecommerce.onrender.com/api/status/status/AllStatus', {
                headers: {
                    'x-access-token': token
                }
            });
            setStatusList(Object.values(status.data));

        } catch (error) {
            console.log(error)
        }
    }
    const calculateTotalStatus = async () => {
        let totalOrders = 0;
        let pendingOrders = 0;
        let declinedOrders = 0;
        let confirmedOrders = 0;
        let cancelledOrders = 0;
        let tempWaitingList = [];
        let tempDeclineList = [];
        let tempConfirmList = [];
        let tempCancelledList = [];
        let tempAllList = [];
        await orderLists?.forEach((order) => {
            const orderDate = new Date(order.createdAt).toLocaleDateString('en-CA');
            if (orderDate === selectedDate?.toLocaleDateString('en-CA')) {
                tempAllList.push(order)
                totalOrders += 1;
                let stat = order.status.charAt(0).toUpperCase() + order.status.slice(1);

                if (stat === 'Pending') {
                    tempWaitingList.push(order);
                    pendingOrders += 1;
                } else if (stat === 'Decline') {
                    tempDeclineList.push(order);
                    declinedOrders += 1;
                } else if (stat === 'Completed') {
                    tempConfirmList.push(order);
                    confirmedOrders += 1;
                } else if (stat === 'Cancelled') {
                    tempCancelledList.push(order);
                    cancelledOrders += 1;
                }
            }
        });
        setTotal(totalOrders);
        setWait(pendingOrders);
        setDecline(declinedOrders);
        setConfirm(confirmedOrders);
        setCancelled(cancelledOrders)
        setWaitingList(tempWaitingList);
        setConfirmList(tempConfirmList);
        setDeclineList(tempDeclineList);
        setCancelledList(tempCancelledList);
        setAllList(tempAllList);
    };
    const fetchOrderLists = async () => {
        try {
            const response = await axios.get("https://multishop-ecommerce.onrender.com/api/order/allOrder", {
                headers: {
                    'x-access-token': token
                }
            });
            let allOrders = [];
            allOrders = Object.values(response.data);
            console.log(allOrders)
            if (role === 'super admin') {
                setOrderLists(allOrders);
                setOrderListDB(allOrders);

            } else {
                const filteredOrders = allOrders?.map(order => ({
                    ...order,
                    orderedproduct: order.orderedproduct.filter(product => product.shopId === id)
                })).filter(order => order?.orderedproduct.length > 0);
                setOrderLists(filteredOrders);
                setOrderListDB(filteredOrders);
            }

        } catch (error) {
            console.log('Error fetching orders:', error);
        }
    }

    const stateOrder = async (orderConfirm, pstatus, status) => {
        if (orderConfirm) {
            try {
                await axios.put(`https://multishop-ecommerce.onrender.com/api/order/order/${clickItem._id}`, {
                    ...clickItem,
                    status: status
                }, {
                    headers: {
                        'x-access-token': token
                    }
                })
                updateStockToProduct(pstatus, status);
                setExpand(false)
                fetchOrderLists();
                setTop('top-[100%]');
            } catch (error) {
                console.log(error)
            }
        }
    }
    const updateStockToProduct = async (pstatus, status) => {
        let caseSts = status.charAt(0).toUpperCase() + status.slice(1);
        let caseSts1 = pstatus.charAt(0).toUpperCase() + pstatus.slice(1);

        for (const order of clickItem?.orderedproduct || []) {
            try {
                const { data: product } = await axios.get(`https://multishop-ecommerce.onrender.com/api/product/findProduct/${order.productId}`);
                let newQty = product.initialstock;

                if (caseSts1 === 'Completed' && caseSts === 'Pending') {
                    console.log('c-2');
                    newQty = product.initialstock + order.quantity;
                }
                else if (caseSts1 === 'Pending' && caseSts === 'Completed') {
                    console.log('c-3');
                    newQty = product.initialstock - order.quantity;
                }
                else if ((caseSts1 === 'Completed' && caseSts === 'Decline') || caseSts1 === 'Completed' && caseSts === 'Cancelled') {
                    console.log('c-4');
                    newQty = product.initialstock + order.quantity;
                }

                await axios.put(`https://multishop-ecommerce.onrender.com/api/product/${order.productId}`, {
                    initialstock: newQty
                }, {
                    headers: {
                        'x-access-token': token
                    }
                });

            } catch (error) {
                console.log(error);
            }
        }
    }
    const fetchAllShop = async () => {
        try {
            const allShop = await axios.get('https://multishop-ecommerce.onrender.com/api/user/all', {
                headers: {
                    'x-access-token': token
                }
            })
            const shopData = allShop?.data?.map((item) => ({
                shopId: item.id,
                shopName: item.shopName,
                shopLogo: item.shopLogo,
            }))
            setShopList(shopData)

        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='w-[100%] h-[100vh] bg-white flex overflow-y-hidden'>

            <Sidebar actInd={active} />

            <div className='w-[30%] h-full bg-whitev2 overflow-hidden border-obsidian border-r-[2px] border-opacity-50'>
                <GroupDate token={token} status={oInd} setStatus={setOInd} setDate={setSelectedDate} odate={selectedDate} total={total} wait={wait} confirm={confirm} decline={decline} cancelled={cancelled} stList={statusList} />
            </div>
            <div className='w-[70%] h-full relative'>
                <OrderGroup role={role} token={token} allShop={shopList} orderLists={allLists[oInd]} oind={oInd} itemsPerPage={8} top={top} setTop={setTop} clickItem={clickItem} setClickItem={setClickItem} no={no} setNo={setNo} setOrderStatus={stateOrder} expand={expand} setExpand={setExpand} date={selectedDate} status={status} stList={statusList} />

                <OrderDetails role={role} token={token} top={top} setTop={setTop} clickItem={clickItem} no={no} setOrderStatus={stateOrder} setClickItem={setClickItem} updateOnDelete={updateStockToProduct} stList={statusList} allShop={shopList} />
            </div>
        </div >
    )
}
export default Order;
