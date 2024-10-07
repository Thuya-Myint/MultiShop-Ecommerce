import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { MdSpaceDashboard } from "react-icons/md";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import order from '../assets/image/deliver-svgrepo-com.svg'
import { useNavigate } from 'react-router-dom'

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ token, id, username, role }) => {
    const active = 0;
    const [orderCount, setOrderCount] = useState([]);
    const [orderList, setOrderLists] = useState([]);
    const [total, setTotal] = useState(0);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });
    const [statusList, setStatusList] = useState([]);
    const navigate = useNavigate();

    // Fetch status once when the component mounts
    useEffect(() => {
        fetchStatus();
    }, []);

    // Fetch order lists whenever token or id changes
    useEffect(() => {
        if (token && id) {
            fetchOrderLists();
        }
    }, [token, id]);

    // Update order count and chart data whenever orderList changes
    useEffect(() => {
        if (orderList.length) {
            setAllCount();
        }
    }, [orderList]);

    // Update chart data when both orderCount and statusList are available
    useEffect(() => {
        if (orderCount.length && statusList.length) {
            updateChartData(orderCount);
        }
    }, [orderCount, statusList]);

    const setAllCount = () => {
        const counts = {};
        let total = 0;

        orderList.forEach(order => {
            const status = order.status;
            if (!counts[status]) {
                counts[status] = 0;
            }
            counts[status] += 1;
            total += 1;
        });

        setTotal(total);
        const countArray = [
            { status: 'Total', count: total },
            ...Object.keys(counts).map(status => ({ status, count: counts[status] }))
        ];
        setOrderCount(countArray);
    };

    const fetchStatus = async () => {
        try {
            const status = await axios.get('https://multishop-ecommerce.onrender.com/api/status/status/AllStatus', {
                headers: {
                    'x-access-token': token
                }
            });
            console.log(status)
            setStatusList(Object.values(status.data));
        } catch (error) {
            console.log(error);
        }
    };

    const updateChartData = (countArray) => {
        const labels = countArray.map(item => item.status);
        const data = countArray.map(item => item.count);
        const colors = {};

        // Ensure statusList is ready
        statusList.forEach(({ status, color }) => {
            colors[status] = `${color}99`; // Use hex color with 60% opacity
        });

        const backgroundColors = countArray.map(item => colors[item.status] || '#CCCCCC99'); // Default color

        setChartData({
            labels: labels,
            datasets: [
                {
                    label: 'Orders Count',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace(/99$/, 'FF')), // Fully opaque border
                    borderWidth: 1,
                },
            ],
        });
    };

    const fetchOrderLists = async () => {
        try {
            const response = await axios.get("https://multishop-ecommerce.onrender.com/api/order/allOrder", {
                headers: {
                    'x-access-token': token
                }
            });

            const allOrders = Object.values(response.data);
            console.log(allOrders);
            if (role === 'super admin') {
                setOrderLists(allOrders);
            } else {
                const filteredOrders = allOrders.map(order => ({
                    ...order,
                    orderedproduct: order.orderedproduct.filter(product => product.shopId === id)
                })).filter(order => order?.orderedproduct.length > 0);
                setOrderLists(filteredOrders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    return (
        <div className='w-[100vw] h-[100vh] bg-white flex overflow-hidden'>
            <Sidebar actInd={active} />
            <div className='h-full w-full flex flex-col items-center p-2'>
                <div className='w-full h-[30%] flex flex-col items-center'>
                    <div className='text-3xl font-thin italic p-2 flex items-center mt-2 mb-4'>
                        Dashboard
                        <MdSpaceDashboard className='ml-2 text-obsidian opacity-70' />
                    </div>
                    <div className='max-w-[1000px] flex items-center justify-start gap-2 overflow-x-auto p-2 bg-obsidian bg-opacity-30 rounded-md'>
                        {
                            orderCount.map((order, index) => (
                                <div key={index} className='w-[200px] bg-obsidian p-4 rounded-sm bg-opacity-30 flex-shrink-0 cursor-pointer'>
                                    <div className='flex justify-between'>
                                        <div>{order.status}</div>
                                        <div>{order.count}</div>
                                    </div>
                                    <div className='w-full bg-obsidian bg-opacity-25 rounded-full mt-2'>
                                        <div className='h-[4px] bg-whitev2 rounded-full' style={{ width: `${(order.count / total) * 100}%` }}></div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className='transition-all duration-300 w-[80%] rounded-md h-[60%] flex items-center justify-center bg-whitev3 bg-opacity-35 hover:bg-opacity-75 cursor-pointer p-2'>
                    <Bar data={chartData} options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Orders Count by Status',
                            },
                        },
                    }} />
                </div>
                <div className='flex justify-end w-[80%] p-4'>
                    <button className='font-light italic flex items-center' onClick={() => navigate('/order')}>
                        <div className='transition-all duration-500 opacity-50 hover:opacity-100'>Click To See Order Details</div>
                        <img src={order} alt="" className='w-6 ml-2 opacity-100' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
