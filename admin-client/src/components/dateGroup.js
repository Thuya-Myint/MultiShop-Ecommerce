import { React, useState, useEffect } from 'react'
import { FaSortAmountDown } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DayPicker } from "react-day-picker";
import 'react-day-picker/dist/style.css';
import AOS from "aos";
import "aos/dist/aos.css";
import axios from 'axios';


const GroupDate = ({ token, status, setStatus, setDate, odate, total, wait, confirm, decline, cancelled, stList }) => {
    const [expand, setExpand] = useState(false);
    const [sortIndex, setSortIndex] = useState(0);
    const [sortDes, setSortDes] = useState('Group By Order Date');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const waitingColor = stList?.find(item => item.status === 'Pending');
    const compleColor = stList?.find(item => item.status === 'Completed');
    const declineColor = stList?.find(item => item.status === 'Decline');
    const cancelColor = stList?.find(item => item.status === 'Cancelled');

    useEffect(() => {
        AOS.init({
            duration: 600,
            easing: "ease-out-back",
            once: true,
        });
    }, []);
    useEffect(() => {
        console.log("rendering with selected Date's orders count as a progress orders!")
    }, [setDate])
    const selectSort = (index, option) => {
        setSortIndex(index);
        setSortDes(option)
        setExpand(!expand);
    }
    const handleSelect = (date) => {
        setDate(date);
    };
    const selectOrderStatus = (ind) => {
        setStatus(ind)
    }
    return (
        <div className='w-full h-full bg-obsidian bg-opacity-30 overflow-hidden'>
            <div className={`transition-all bg-obsidian bg-opacity-100 text-white cursor-pointer relative duration-[200ms] ${expand ? 'h-[165px]' : 'h-[5%] '}  flex flex-col p-2`}>
                <div className={`flex w-full z-30 h-[35px] items-center  text-[1rem] justify-between`} onClick={() => setExpand(!expand)}>
                    <div className='flex  items-center px-4 '>{sortDes}</div>
                    <FaSortAmountDown className='text-[1.1rem] cursor-pointer' />
                </div>
                <div className={`transition-all duration-[600ms] rod h-[2px] bg-white absolute top-[48.5px]  left-0 ${expand ? 'w-[99%]' : 'w-0'}`}></div>
                {
                    expand ?
                        <div data-aos='fade-up' className='bg-obsidian absolute w-[97%] top-[60px] bg-opacity-70 text-white p-1 mt-1 font-semibold rounded-md  text-[0.9rem]'>
                            <div className={`bg-white p-2 cursor-pointer ${sortIndex === 1 ? 'bg-opacity-20' : 'bg-opacity-45 '} hover:bg-opacity-5`}
                                onClick={() => selectSort(1, 'Older First')}
                            >Oldest First</div>
                            <div className={`mt-1 bg-white  p-2 cursor-pointer ${sortIndex === 2 ? 'bg-opacity-10' : 'bg-opacity-45 '} hover:bg-opacity-5`}
                                onClick={() => selectSort(2, 'Newer First')}
                            >Newest First</div>
                        </div> : ''
                }
            </div>
            <div className='w-full h-[80%]'>
                <div className='w-full flex flex-col items-center text-[0.8rem]'>
                    <DayPicker
                        mode="single"
                        selected={odate}
                        onSelect={handleSelect}
                        className=' text-lavender  bg-obsidian bg-opacity-60  w-full flex justify-center wel-font'
                        styles={{
                            day: {
                                transition: "all 0.3s ease"
                            },

                        }}
                    />
                    {selectedDate && (
                        <div className='w-full h-[10%] flex items-center justify-between px-4 text-[0.9rem] text-white bg-obsidian py-2'>
                            <div>Orders From </div>
                            {odate?.toLocaleDateString()}
                        </div>
                    )}
                </div>
                <div className='w-full  text-obsidian '>
                    <div className='transition-all duration-[200ms] h-fit w-full bg-opacity-20 p-2 grid grid-cols-2 gap-2'>
                        <div className={`bg-white h-full bg-opacity-75 px-4 py-2 cursor-pointer border-opacity-0 hover:border-opacity-55 ${status === 0 ? 'border-opacity-75 rounded-xl' : 'rounded-sm '} border-[3px] border-obsidian flex items-center justify-between`}
                            onClick={() => selectOrderStatus(0)}
                        >
                            <div className=''>
                                <div>Total</div>
                                <div className=''>
                                    {total}
                                </div>
                            </div>
                            <div className='h-full w-[4px] bg-obsidian bg-opacity-25 relative'>
                                <div className='transition-all duration-[400ms] w-full bg-obsidian absolute bottom-0' style={{ height: total > 0 ? `${(total / total) * 100}%` : '0%' }}></div>
                            </div>

                        </div>
                        <div className={`transition-all duration-[200ms] bg-whitev1 h-full bg-opacity-45 px-4 py-2 cursor-pointer border-opacity-0 hover:border-opacity-55 ${status === 1 ? 'rounded-xl border-opacity-75' : 'rounded-sm'}  border-[3px] border-obsidian flex items-center justify-between`}
                            onClick={() => selectOrderStatus(1)}
                        >
                            <div className=''>
                                <div className='flex items-center'>
                                    {

                                    }
                                    <div className='w-[10px] h-[10px] rounded-full mr-2' style={{ backgroundColor: waitingColor?.color }}></div>
                                    Waiting</div>
                                <div className=''>
                                    {wait}
                                </div>
                            </div>
                            <div className='h-full w-[4px] bg-obsidian bg-opacity-25 relative'>
                                <div className='transition-all duration-[400ms] w-full bg-obsidian absolute bottom-0' style={{ height: total > 0 ? `${(wait / total) * 100}%` : '0%' }}></div>
                            </div>
                        </div>
                        <div className={`transition-all duration-[200ms] bg-whitev2 h-full bg-opacity-35 px-4 py-2 cursor-pointer border-opacity-0 hover:border-opacity-55  ${status === 2 ? 'rounded-xl border-opacity-75' : 'rounded-sm'}  border-[3px] border-obsidian flex items-center justify-between`}
                            onClick={() => selectOrderStatus(2)}
                        >
                            <div className=''>
                                <div className='flex items-center'>
                                    <div className='w-[10px] h-[10px] rounded-full mr-2' style={{ backgroundColor: compleColor?.color }}></div>
                                    Completed</div>
                                <div className=''>
                                    {confirm}
                                </div>
                            </div>
                            <div className='h-full w-[4px] bg-obsidian bg-opacity-25 relative'>
                                <div className='transition-all duration-[400ms] w-full bg-obsidian absolute bottom-0' style={{ height: total > 0 ? `${(confirm / total) * 100}%` : '0%' }}></div>
                            </div>
                        </div>
                        <div className={`transition-all duration-[200ms] bg-obsidian h-full bg-opacity-15 text-white px-4 py-2 cursor-pointer border-opacity-0 hover:border-opacity-55  ${status === 3 ? 'border-opacity-75 rounded-xl' : 'rounded-sm'}  border-[3px] border-obsidian flex items-center justify-between`}
                            onClick={() => selectOrderStatus(3)}
                        >
                            <div className=''>
                                <div className='flex items-center'>
                                    <div className='w-[10px] h-[10px] rounded-full mr-2' style={{ backgroundColor: declineColor?.color }}></div>
                                    Decline
                                </div>
                                <div className=''>
                                    {decline}
                                </div>
                            </div>
                            <div className='h-full w-[4px] bg-obsidian bg-opacity-25 relative'>
                                <div className='transition-all duration-[400ms] w-full bg-obsidian absolute bottom-0' style={{ height: total > 0 ? `${(decline / total) * 100}%` : '0%' }}></div>
                            </div>
                        </div>
                        <div className={`transition-all duration-[200ms] bg-obsidian h-full bg-opacity-25 text-white px-4 py-2 cursor-pointer border-opacity-0 hover:border-opacity-55  ${status === 4 ? 'border-opacity-75 rounded-xl' : 'rounded-sm'}  border-[3px] border-obsidian flex items-center justify-between`}
                            onClick={() => selectOrderStatus(4)}
                        >
                            <div className=''>
                                <div className='flex items-center'>
                                    <div className='w-[10px] h-[10px] rounded-full mr-2' style={{ backgroundColor: cancelColor?.color }}></div>
                                    Cancelled
                                </div>
                                <div className=''>
                                    {cancelled}
                                </div>
                            </div>
                            <div className='h-full w-[4px] bg-obsidian bg-opacity-25 relative'>
                                <div className='transition-all duration-[400ms] w-full bg-obsidian absolute bottom-0' style={{ height: total > 0 ? `${(cancelled / total) * 100}%` : '0%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default GroupDate
