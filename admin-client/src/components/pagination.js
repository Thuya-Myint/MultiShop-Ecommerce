import { React, useEffect, useState } from 'react';
import sort from '../assets/image/swap-vertical-outline.svg';
import delicon from '../assets/image/delete.svg';
import edticon from '../assets/image/edit.svg';
import axios from 'axios';

const Pagination = ({ itemsPerPage, items, toastback, fetchData }) => {
    const token = JSON.parse(localStorage.getItem('x-access-token'));
    const [currentPage, setCurrentPage] = useState(1);
    const [SExpand, setSExpand] = useState(false);
    const [selectSort, setSelectedSort] = useState("Sort By");
    const sortList = ['by Name A-Z', 'by Name Z-A'];
    const [updating, setUpdating] = useState(false);
    const [unitname, setUnitname] = useState('');
    const [shortname, setShortname] = useState('');
    const [unitlists, setUnitLists] = useState(items);
    const [uactive, setUactive] = useState();
    const [id, setId] = useState('');

    useEffect(() => {
        setUnitLists(items)
    }, [items])
    const totalItems = items.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const currentItems = unitlists.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSelectSort = (item) => {
        setSelectedSort(item);
        setSExpand(false);
        sortUnit(item)
    }
    const handlePageChange = (page) => {
        setCurrentPage(page);
    }
    const openPopUp = (v1, v2, v3) => {
        setUpdating(!updating);
        setId(v1);
        setUnitname(v2);
        setShortname(v3);
        setUactive(v1);
    }
    const closePopUp = () => {
        setUpdating(!updating);
        setId('');
        setUnitname('');
        setShortname('');
        setUactive(null)
    }

    const sortUnit = (status) => {
        let sortedData;
        switch (status) {
            case 'by Name A-Z': {
                sortedData = [...unitlists].sort((a, b) => a.unitname.localeCompare(b.unitname));
                setUnitLists(sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                break;
            };
            case 'by Name Z-A': {
                sortedData = [...unitlists].sort((a, b) => b.unitname.localeCompare(a.unitname));
                setUnitLists(sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                break;
            };
            default: sortedData = unitlists;
        }
        setUnitLists(sortedData);
        setCurrentPage(1);
    }
    const deleteUnit = async (id) => {
        try {
            await axios.delete(`http://localhost:8090/api/unit/unit/${id}`, {
                headers: {
                    'x-access-token': token
                }
            })
            toastback('success', 'Successfully Deleted!')
            fetchData(500);
        } catch (error) {
            console.error(error);
            toastback('fail', error.response.data.message)
        }
    }
    const updateUnit = async () => {
        if (unitname === '' || unitname === '')
            return toastback('fail', 'Input InValid!');
        try {
            await axios.put(`http://localhost:8090/api/unit/unit/${id}`, {
                unitname: unitname,
                short: shortname
            }, {
                headers: {
                    'x-access-token': token
                }
            })
            toastback('success', 'successfully updated!');
            closePopUp();
            fetchData(500);
        } catch (error) {
            console.log(error)
            toastback('fail', error.response.data.message)
        }
    }
    return (
        <div className='h-full w-full '>
            <div className='h-[7%] w-full flex items-start justify-between mb-4'>
                <div className='xl:w-[20%] w-1/2 relative h-full'>
                    <div className='cursor-pointer w-full bg-white h-full custom-shadow  px-2  rounded-sm flex justify-between items-center' onClick={() => setSExpand(!SExpand)}>
                        <div>{selectSort}</div>
                        <img src={sort} alt="sort" className='w-9 border-l-2 border-black bg-white bg-opacity-50 p-1 px-2' />
                    </div>
                    {
                        SExpand ?
                            <div className='absolute bg-slate-100 w-2/3 p-2 rounded-b-md bg-opacity-100 shadow-md custom-shadow'>
                                {
                                    sortList.map((item, index) => (
                                        <div key={index} className={`transition-all duration-[200ms] hover:bg-obsidian hover:bg-opacity-40 hover:px-4 cursor-pointer p-2 ${index !== sortList.length - 1 ? "border-b-[1px] mb-1" : ""}`} onClick={() => handleSelectSort(item)}>{item}</div>
                                    ))
                                }
                            </div> : ""
                    }
                </div>
                <div className=' h-full'>
                    <button className='cursor-pointer w-[60px] h-full bg-customBluishPurple text-white' onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        Prev
                    </button>
                    {
                        Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index + 1)}
                                className={`${index === 0 ? 'ml-1' : ''} ${index === totalPages - 1 ? 'mr-1' : ''} cursor-pointer wel-font transition-all duration-[200ms] w-[50px] ${index + 1 === currentPage ? 'bg-obsidian bg-opacity-50' : ' bg-slate-200'}  h-full rounded-sm hover:bg-obsidian hover:bg-opacity-45`}
                            >
                                {index + 1}
                            </button>
                        ))
                    }
                    <button className='cursor-pointer w-[60px] h-full bg-cherry text-white' onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>
            <div className='w-full h-[85%] '>
                <div className=' bg-obsidian bg-opacity-70 h-[8%] rounded-t-lg px-4 flex items-center wel-font'>
                    <div className='w-[10%] text-white'>No</div>
                    <div className='w-[20%] text-white'>Units</div>
                    <div className='w-[20%] text-white font-semibold'>Short</div>
                </div>
                <div className='bg-obsidian bg-opacity-40 h-[92%] rounded-b-md p-2'>
                    {
                        currentItems.map((unit, index) => (
                            <div key={unit._id} className={` transition-all itemMainDiv duration-[200ms] flex rounded-sm items-center w-full px-4 h-[9%] bg-white  hover:bg-opacity-100 hover:pl-6 ${!index + 1 !== itemsPerPage ? ' mb-2' : ''}
                            ${unit._id === uactive ? 'bg-opacity-100' : 'bg-opacity-40'}
                            `}
                            >
                                <div className='w-[10%] sig-font'>{index + 1}</div>
                                <div className='w-[20%] wel-font'>{unit.unitname}</div>
                                <div className='w-[20%] font-semibold italic wel-font'>{unit.short}</div>
                                <div className=' w-[50%] flex justify-end items-center'>
                                    <img src={edticon} alt="" className='hidden transition-all duration-[200ms] w-6 cursor-pointer hover:scale-125 mr-2' onClick={() => openPopUp(unit._id, unit.unitname, unit.short)}

                                    />
                                    <img src={delicon} alt="" className='hidden transition-all duration-[200ms] w-6 cursor-pointer hover:scale-125' onClick={() => deleteUnit(unit._id)} />
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {
                updating ?
                    <div className='absolute bg-obsidian w-[100vw] h-[100vh] top-0 left-0 bg-opacity-50 bg-loading flex items-center justify-center'>
                        <div className='w-1/3 h-1/3 bg-white rounded-md flex flex-col items-center '>
                            <div className='w-full h-[20%]'>
                                <div className='text-center  mb-10 bg-customBluishPurple w-full text-white rounded-t-sm p-2'>update unit</div>
                            </div>
                            <div className='flex flex-col w-1/2 h-[50%] justify-center'>
                                <input value={unitname} type="text" className='outline-none border-b-2 mb-4 px-2 py-1' placeholder='unitname' onChange={(e) => setUnitname(e.target.value)} />
                                <input value={shortname} type="text" className='outline-none border-b-2 mb-4 px-2 py-1' placeholder='shortname' onChange={(e) => setShortname(e.target.value)} />
                            </div>
                            <div className='w-full flex h-[30%] justify-center items-end'>
                                <button className='bg-customBluishPurple w-1/2 h-[35px] rounded-bl-sm text-white' onClick={updateUnit}>Update</button>
                                <button className='bg-cherry w-1/2 h-[35px] rounded-br-sm' onClick={() => closePopUp()}>Cancel</button>
                            </div>
                        </div>
                    </div> : ""
            }
        </div>
    )
}

export default Pagination
