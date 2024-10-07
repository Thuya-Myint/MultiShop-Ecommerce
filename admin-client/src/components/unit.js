import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './sidebar'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import Pagination from './pagination'
import Loading from './loading'
const Unit = ({ token, id, username, role }) => {
    const active = 1
    const [loading, setLoading] = useState(false);
    const [unitlist, setUnits] = useState([]);
    const [uname, setUname] = useState('');
    const [ushort, setUshort] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // if (role !== 'super admin')
        //     navigate('/')
        // else
        fetchUnits(1000);
    }, [])
    const toastBack = (status, detail) => {
        switch (status) {
            case 'success':
                return toast.success(detail);
            case 'fail':
                return toast.error(detail);
        }
    }
    const fetchUnits = async (tv) => {
        setLoading(true);
        try {
            const units = await axios.get('http://localhost:8090/api/unit/all', {
                headers: {
                    'x-access-token': token
                }
            });
            setUnits(Object.values(units.data));
        } catch (error) {
            console.log(error)
        }
        setTimeout(() => {
            setLoading(false);
        }, tv)
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter')
            console.log('add new unit');
    }
    const clearInput = async () => {
        setUname('');
        setUshort('');
    }
    const addUnit = async () => {
        if (uname === '' || ushort === '') return toastBack('fail', 'input InValid!');
        setLoading(true);
        try {
            await axios.post('http://localhost:8090/api/unit/addUnit', {
                unitname: uname,
                short: ushort
            }, {
                headers: {
                    'x-access-token': token
                }
            });
            toastBack('success', `${uname} added Successfully!`)
            fetchUnits(700);
            clearInput();
        } catch (error) {
            console.error(error);
            toastBack('fail', error.response.data.message);
        }
        setLoading(false);
    }

    return (
        <div className='w-[100vw] h-[100vh] bg-white flex'>
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
            <Sidebar actInd={active} />
            {
                loading ?
                    <div className='absolute top-0 left-[0px]'>
                        <Loading isLoad={loading} value={'fetching Data . . .'} />
                    </div> : ""
            }
            <div className=' h-full w-full p-2 bg-slate-200'>

                <div className='xl:h-[25%] w-full p-4 flex xl:flex-row flex-col'>
                    <div className='xl:w-[20%] flex flex-col'>
                        <div className='mb-6 wel-font'>Add Unit</div>
                        <input value={uname} type="text" placeholder='Unit' className=' outline-none border-b-2 w-[100%] p-2 mb-4 ' onKeyDown={handleKeyPress} onChange={(e) => setUname(e.target.value)} />
                        <input value={ushort} type="text" placeholder='short' className=' outline-none border-b-2 w-[100%] p-2 mb-4' onKeyDown={handleKeyPress} onChange={(e) => setUshort(e.target.value)} />
                    </div>
                    <div className='xl:w-1/2  flex xl:flex-col items-start justify-end xl:ml-2'>
                        <button className='w-[100px] transition-all duration-200 active:scale-[0.9] h-[30px] bg-customBluishPurple text-white px-2 xl:mb-1 mr-1' onClick={() => addUnit()}>Add</button>
                        <button className='w-[100px] h-[30px] bg-cherry px-2 transition-all duration-200 active:scale-[0.9]' onClick={clearInput}>Cancel</button>
                    </div>
                </div>
                <div className='w-full h-[72%]'>
                    <Pagination itemsPerPage={9} items={unitlist}
                        toastback={toastBack}
                        fetchData={fetchUnits}
                    />
                </div>
            </div>
        </div >
    )
}

export default Unit
