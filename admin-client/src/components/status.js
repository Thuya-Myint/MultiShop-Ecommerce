import React, { useEffect, useState } from 'react'
import Sidebar from './sidebar'
import axios from 'axios';
import delicon from '../assets/image/delete.svg';
import edticon from '../assets/image/edit.svg';
import { ToastContainer, toast } from 'react-toastify'
import Loading from './loading';

const Status = ({ token, id, username, role }) => {
    const active = 4;
    const [sname, setSname] = useState('');
    const [color, setColor] = useState('select color');
    const [statusList, setStatusList] = useState();
    const [updating, setUpdating] = useState(false);
    const [confirmDelete, setConfrimDelete] = useState(false);
    const defaultList = ['Pending', 'Completed', 'Decline', 'Cancelled'];
    const [ind, setInd] = useState();
    const [upId, setUpId] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchStatus(1000);
    }, [])
    const toastBack = (status, detail) => {
        switch (status) {
            case 'success':
                return toast.success(detail);
            case 'fail':
                return toast.error(detail);
        }
    }
    const fetchStatus = async (tv) => {
        setLoading(true);
        try {
            const status = await axios.get('http://localhost:8090/api/status/status/AllStatus', {
                headers: {
                    'x-access-token': token
                }
            });
            setStatusList(Object.values(status.data));
            setTimeout(() => {
                setLoading(false)
            }, tv)
        } catch (error) {
            console.log(error)
        }
    }
    const addStatus = async () => {
        if (sname.trim() === '')
            return toastBack('fail', 'Status name require!')
        if (color === 'select color')
            return toastBack('fail', 'Color require!')

        const encodeColor = encodeURIComponent(color)
        try {
            const sfound = await axios.get(`http://localhost:8090/api/status/status/findWithStatus/${sname.charAt(0).toUpperCase() + sname.slice(1)}`)
            console.log(sfound)
            if (sfound.data.found && sfound.data.message == 'Status must be unique!' && sfound.data.success == false && sfound.data.found._id !== upId) return toastBack('fail', 'Status name must be unique!');

            const cfound = await axios.get(`http://localhost:8090/api/status/status/findWithColor/${encodeColor}`)

            if (cfound.data.found && cfound.data.message == 'Color must be unique!' && cfound.data.success == false && cfound.data.found._id !== upId) return toastBack('fail', 'Color must be unique!');

            if (updating) {
                await axios.put(`http://localhost:8090/api/status/status/updateStatus/${upId}`, {
                    status: sname.charAt(0).toUpperCase() + sname.slice(1),
                    color: color
                }, {
                    headers: {
                        'x-access-token': token
                    }
                })
                toastBack('success', `${sname} successfully updated!`);
            }
            else {
                await axios.post('http://localhost:8090/api/status/status/add', {
                    status: sname.charAt(0).toUpperCase() + sname.slice(1),
                    color: color
                }, {
                    headers: {
                        'x-access-token': token
                    }
                })
                toastBack('success', `${sname} successfully added!`);
            }

            setSname('');
            setColor('select color');
            fetchStatus(500);
        } catch (error) {
            console.log(error);
        }
    }
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8090/api/status/status/deleteStatus/${id}`, {
                headers: {
                    'x-access-token': token
                }
            })
            fetchStatus(500);
            setConfrimDelete(false)
        } catch (error) {
            console.log(error);
        }
    }
    const handleUpdate = async (id, st, clr) => {
        setUpdating(true);
        setSname(st);
        setColor(clr);
        setUpId(id);
    }
    const handleDelClick = (ind) => {
        setInd(ind);
        setConfrimDelete(true);
    }
    const clearInput = () => {
        setColor();
        setSname('');
    }
    return (

        <div className='w-[100vw] h-[100vh] bg-white flex overflow-hidden'>
            < ToastContainer
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
            {
                loading ?
                    <div className='absolute top-0 left-[60px]'>
                        <Loading isLoad={loading} value={'fetching Data . . .'} />
                    </div> : ""
            }
            <Sidebar actInd={active} />

            <div className=' h-full w-full p-2 bg-slate-200'>
                <div className='h-[25%] w-full p-4 flex'>
                    <div className='w-[20%] flex flex-col'>
                        <div className='mb-6 wel-font'>Add Status</div>
                        <input value={sname} type="text" placeholder='Status' className=' outline-none border-b-2 w-[100%] p-2 mb-4' onChange={(e) => setSname(e.target.value)} />
                        <div className='flex items-center h-full bg-opacity-35 justify-between'>
                            <div className='w-1/2 h-full py-1 pr-1'>
                                <input value={color} className='w-full h-full bg-transparent ' type="color" onChange={(e) => setColor(e.target.value)} />
                            </div>
                            <div className='w-1/2 h-2/3 flex justify-center bg-obsidian bg-opacity-35 items-center'>
                                {color}
                            </div>
                        </div>

                    </div>
                    <div className='w-1/2 flex flex-col items-start justify-start mt-[80px] ml-[50px]'>
                        <button className='transition-all duration-200 w-[100px] active:scale-[0.9] h-[30px] bg-customBluishPurple text-white px-2 mb-[1%]'
                            onClick={addStatus}
                        >{updating ? 'update' : 'add'}</button>
                        <button className='transition-all duration-200 w-[100px] h-[30px] active:scale-[0.9] bg-cherry px-2' onClick={clearInput}>Cancel</button>
                    </div>
                </div>
                <div className='w-full h-[72%]'>
                    <div className=' bg-obsidian bg-opacity-70 h-[8%] rounded-t-lg px-4 flex items-center wel-font'>
                        <div className='w-[10%] text-white'>No</div>
                        <div className='w-[20%] text-white'>Status</div>
                        <div className='w-[10%] text-white text-center font-semibold '>Color</div>
                    </div>
                    <div className='bg-obsidian bg-opacity-40 h-[92%] rounded-b-md p-2 overflow-y-auto overflow-x-hidden'>
                        {
                            statusList?.map((status, index) => (
                                <div className='transition-all duration-[200ms] bg-whitev3 w-full h-[40px] mb-2 flex px-2 items-center  cursor-pointer hover:bg-whitev1 div-main'>
                                    <div className='w-[10%]'>{index + 1}</div>
                                    <div className='w-[20%] capitalize font-semibold'>{status.status}</div>
                                    <div className='w-[10%] flex justify-center items-center'>
                                        <div className='w-[15px] h-[15px] rounded-full' style={{ backgroundColor: status.color }}></div>
                                    </div>
                                    {
                                        defaultList.includes(status.status) && ind !== index ? '' :

                                            <div className='w-[60%] h-full items-center justify-end hidden div-items'>
                                                <img src={edticon} alt="" className={`transition-all duration-200 ${confirmDelete ? 'w-0' : 'w-6'} mr-2 active:scale-90`} onClick={() => handleUpdate(status._id, status.status, status.color)} />
                                                <img src={delicon} alt="" className={` active:scale-90 ${confirmDelete ? 'w-0' : 'w-7'}`} onClick={() => handleDelClick(index)} />
                                                <button className={`transition-all duration-200 bg-cherry mr-1 ${confirmDelete ? 'w-[10%] py-1' : 'w-0 opacity-0'}`} onClick={() => handleDelete(status._id)}>confirm</button>
                                                <button className={`transition-all duration-200 bg-customBluishPurple ${confirmDelete ? 'w-[10%] py-1' : 'w-0 opacity-0'}`} onClick={() => setConfrimDelete(false)}>cancel</button>
                                            </div>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Status
