import React, { useState, useEffect, useRef } from 'react'
import app from '../config/firebase';
import { ref, getStorage, uploadBytes, getDownloadURL, deleteObject, listAll, list } from 'firebase/storage'
import Sidebar from './sidebar'
import { ToastContainer, toast } from 'react-toastify'
import addCircle from '../assets/image/add-circle-sharp.svg'
import upDown from '../assets/image/swap-vertical-outline.svg'
import axios from 'axios'
import Loading from './loading';
import PaginationProduct from './paginationProduct';
import analyst from '../assets/image/undraw_analysis_dq08.svg';
import { MdRemoveCircle } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { MdOutlineBookmarkRemove } from "react-icons/md";
const Product = ({ token, id, username, role }) => {
    console.log(id);//id exists here
    const storage = getStorage(app);
    const active = 2
    const [adding, setAdding] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [unitlists, setUnitLists] = useState([]);
    const [productLists, setProductLists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expand, setExpand] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState('Product Units');
    const [files, setFile] = useState([]);
    const [pname, setPname] = useState('');
    const [pdesc, setPdesc] = useState('');
    const [pstock, setPstock] = useState(null);
    const [imagePreview, setImagePreview] = useState([]);
    const [pprice, setPprice] = useState(null);
    const [dragEnter, setDragEnter] = useState(false);
    const [psize, setSize] = useState('');
    const [dragItem, setDragItems] = useState(null);
    const [imgS, setImgS] = useState(null);
    const urlsRef = useRef();
    const dragOverRef = useRef();
    const imgRef = useRef();
    const [confirm, setConfirm] = useState(false);
    const [sizeLists, setSizelists] = useState([]);
    const [siexpand, setSiexpand] = useState(false);
    const [color, setColor] = useState('');
    const [clexp, setClexp] = useState(false);
    const [colorLists, setColorlists] = useState([]);
    const [actZ, setactZ] = useState(0);

    useEffect(() => {
        if (id) fetchProducts();
        fetchUnits(500);

    }, [id])
    const handleAdding = () => {
        setAdding(true);
    }
    const toastMsg = (status, detail) => {
        switch (status) {
            case 'success': return toast.success(detail);
            case 'fail': return toast.error(detail);
        }
    }
    const fetchProducts = async () => {
        const products = await axios.get('https://multishop-ecommerce.onrender.com/api/product/all', {
            headers: {
                'x-access-token': token
            }
        })
        const allProduct = Object.values(products.data)
        console.log(id)//id doesn't exists here
        setProductLists(allProduct.filter(product => product.shopId === id));
    }
    const fetchUnits = async (tv) => {
        setLoading(true);
        try {
            const units = await axios.get('https://multishop-ecommerce.onrender.com/api/unit/all', {
                headers: {
                    'x-access-token': token
                }
            });
            setUnitLists(Object.values(units.data));
        } catch (error) {
            console.log(error)
        }
        setTimeout(() => {
            setLoading(false);
        }, tv)
    }
    const handleSelectedUnit = (unit) => {
        setSelectedUnit(unit);
        setExpand(!expand);
    }
    const triggerFileChange = () => {
        document.getElementById('file-upload').click();
    }
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        setFile(prevFiles => [...prevFiles, ...selectedFiles]);
        selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(prevImages => [
                    ...prevImages,
                    { src: reader.result, name: file.name }
                ])
            }
            reader.readAsDataURL(file)
        })
    }
    const handleDragOver = (ref, e) => {
        e.preventDefault();
        setDragEnter(true);
        dragOverRef.current = ref;
        console.log(dragOverRef.current)
    }
    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragEnter(false);
        dragOverRef.current = null;
        console.log('drag exit', dragOverRef.current)
    }
    const fileUpload = async () => {
        setLoading(true);
        urlsRef.current = [];
        var fexists = false;
        const promises = files.map(async (file) => {
            const storageRef = ref(storage, `products/${file.name}`);
            try {
                const folderRef = ref(storage, 'products');
                const list = await listAll(folderRef);
                const fileExists = list.items.some((item) => item.name === file.name);
                console.log('file exists', fileExists)
                if (fileExists && !updating) {
                    toastMsg('fail', 'same image exists! please change image name!')
                    setLoading(false);
                    fexists = true;
                    return;
                }
                const snapshot = await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(snapshot.ref);
                urlsRef.current.push(downloadURL)
            } catch (error) {
                console.log(error);
                toastMsg('fail', 'failed to upload files!');
                throw error;
            }
        });
        await Promise.all(promises);
        return fexists;
    }
    const closeAddPopUp = () => {
        setAdding(false);
        setUpdating(false);
        clearAddedData();
    }
    const clearAddedData = () => {
        setFile([]);
        setPname('');
        setPstock(null);
        setPdesc('');
        setPprice(null);
        setSize(null);
        setImagePreview([])
        setSelectedUnit('Product Units')
        setSizelists([])
        setColorlists([])
        setSiexpand(false);
        setClexp(false);
        urlsRef.current = [];
    }
    const addProduct = async () => {
        if (pname === '') return toastMsg('fail', 'Product name Required!');
        if (pstock <= 0 || typeof pstock !== 'number') return toastMsg('fail', 'Stock must be more than 0');
        if (selectedUnit === 'Product Units') return toastMsg('fail', 'Product Unit Required');
        // if (psize <= 0 || typeof psize !== 'number') return toastMsg('fail', 'Size must be more than 0');
        if (pprice <= 0 || typeof pprice !== 'number') return toastMsg('fail', 'Price must be more than 0');
        if (pdesc === '') return toastMsg('fail', 'description Required!');
        if (adding && files.length === 0) return toastMsg('fail', 'at least 1 product image required!');

        console.log('files', files)
        let route = '';
        let fileExists = await fileUpload();
        if (adding && fileExists) return;

        if (updating && fileExists) return;


        if (adding) {
            route = 'https://multishop-ecommerce.onrender.com/api/product/addProduct';
        }
        else if (updating) {
            console.log("input photo", urlsRef.current)
            if (files.length > 0 && updating) { console.log("will delete!"); deletePhoto(); await fileUpload() };
            console.log(dragItem.imgSrcs)
            route = `https://multishop-ecommerce.onrender.com/api/product/${dragItem._id}`;
        }

        try {
            if (adding) {
                await axios.post(route, {
                    productname: pname,
                    price: pprice,
                    description: pdesc,
                    size: sizeLists,
                    unitname: selectedUnit,
                    imgSrcs: urlsRef.current,
                    initialstock: pstock,
                    color: colorLists,
                    shopId: id
                }, {
                    headers: {
                        'x-access-token': token
                    }
                })
            }
            else if (updating) {
                await axios.put(route, {
                    productname: pname,
                    price: pprice,
                    description: pdesc,
                    size: dragItem.size,
                    unitname: selectedUnit,
                    imgSrcs: urlsRef.current.length > 0 ? urlsRef.current : dragItem.imgSrcs,
                    initialstock: pstock,
                    color: dragItem.color,
                    shopId: id
                }, {
                    headers: {
                        'x-access-token': token
                    }
                })
            }
            clearAddedData();
            adding ? toastMsg('success', 'Product added successfully!') : toastMsg('success', 'Product updated successfully!');
            adding ? setAdding(false) : setUpdating(false);
            setDragItems(null)
            fetchProducts();
        } catch (error) {
            console.log(error);
            adding ?
                toastMsg('fail', 'Failed to add Product') :
                toastMsg('fail', 'Failed to update Product')
        }
        setLoading(false);
    }
    const handleimgclick = (src) => {
        setImgS(src);
        imgRef.current = src;
        console.log(imgRef.current)
    }
    const handleDrop = (e) => {
        console.log(dragOverRef.current)
        if (dragOverRef.current === null) {
            setDragItems(null);
        }
    }
    const handleDelete = () => {
        setConfirm(true);
    }
    const handleCancel = () => {
        setConfirm(false);
    }
    const deletePhoto = async () => {
        setLoading(true);
        try {
            dragItem.imgSrcs.map(async (img) => {
                const decodedUrl = decodeURIComponent(img.split('/o/')[1].split('?')[0]);
                const fileRef = ref(storage, decodedUrl);
                await deleteObject(fileRef);
            })
        } catch (error) {
            console.log(error);
            toastMsg('fail', 'Failed to Delete Image!');
            setLoading(false);
        }
    }
    const deleteProduct = async () => {
        try {
            deletePhoto();
            await axios.delete(`https://multishop-ecommerce.onrender.com/api/product/${dragItem._id}`, {
                headers: {
                    'x-access-token': token
                }
            })
            setConfirm(false);
            toastMsg('success', `${dragItem.productname} is successfully deleted!`);
            setDragItems(null);
            fetchProducts();
        } catch (error) {
            toastMsg('fail', error);
        }
        setTimeout(() => {
            setLoading(false);
        }, 500)

    }
    const handleUpdate = () => {
        setUpdating(true);
        setPname(dragItem.productname);
        setPstock(dragItem.initialstock);
        setPdesc(dragItem.description);
        setPprice(dragItem.price);
        const unit = unitlists.find((unit) =>
            unit.short === dragItem.unitname
        )
        setSelectedUnit(`${unit.short}`)
    }
    const addSize = () => {
        if (psize.trim() === '') return;
        else {
            updating ? dragItem.size = [...dragItem.size, psize] : setSizelists((prevSize) => [...prevSize, psize]);
            setSize('')
            setSiexpand(true);
        }

    }
    const addColor = () => {
        if (color.trim() === '') return;
        else {
            updating ? dragItem.color = [...dragItem.color, color] : setColorlists((prevColor) => [...prevColor, color]);
            setColor('#ffffff')
            setClexp(true);
        }
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter')
            addSize();
    }
    const chooseZ = (ind) => {
        setactZ(ind);
        ind === 0 ? setSiexpand(!siexpand) : setClexp(!clexp);
    }
    const deleteDataSize = (ind) => {
        dragItem.size = dragItem.size.filter((_, index) => index !== ind)
    }
    const deleteDataColor = (ind) => {
        dragItem.color = dragItem.color.filter((_, index) => index !== ind)
    }
    const filterColorList = (ind) => {
        setColorlists(colorLists.filter((_, index) => index !== ind));
    }
    const filterSizeList = (ind) => {
        setSizelists(sizeLists.filter((_, index) => index !== ind));
    }
    return (
        <div className='w-[100vw] h-[100vh] bg-white flex'>
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
            <Sidebar actInd={active} />
            {
                loading ?
                    <div className='absolute top-0 left-[4.1%]'>
                        {
                            adding ?
                                <Loading isLoad={loading} value={'Adding Data . . .'} />
                                :
                                <Loading isLoad={loading} value={'fetching Data . . .'} />
                        }

                    </div> : ""
            }
            <div className='h-full w-full bg-slate-200 p-2 flex'>
                <div className='w-[70%] h-full px-2'>
                    <PaginationProduct itemsPerPage={10} items={productLists} passDragSrc={setDragItems} drgOverSrc={dragOverRef.current} clrImg={setImgS} />
                </div>
                <div className='w-[30%] h-[98%] bg-whitev1 rounded-sm'>
                    <div className='flex w-full h-[5%] rounded-sm p-2 items-center bg-white justify-between cursor-pointer' onClick={handleAdding}>
                        <div className='wel-font'>Add Product </div>
                        <img src={addCircle} alt="" className='w-6' />
                    </div>
                    {
                        dragItem ?
                            <div className='w-full h-[90%] flex flex-col items-center '>
                                {
                                    dragItem.imgSrcs.length > 1 ?
                                        <div className='h-[40%] w-full mt-2 flex flex-col items-center '>
                                            <div className='h-[60%] w-full flex justify-center mt-4'>
                                                <img src={imgS ? imgS : dragItem.imgSrcs} alt="" className='w-[40%] h-[90%] ' />
                                            </div>
                                            <div className=' bg-obsidian bg-opacity-20 w-[80%] overflow-x-auto overflow-y-hidden flex items-center p-1'>{
                                                (dragItem.imgSrcs).map((img, index) => (
                                                    <img key={index} src={img} alt="" className={`${index !== dragItem.imgSrcs.length - 1 ? "mr-1" : ""} transition-all duration-[200ms]
                                                    hover:scale-110 cursor-pointer`}
                                                        style={{ width: `${100 / dragItem.imgSrcs.length}%` }}
                                                        onClick={() => handleimgclick(img)} />
                                                ))}
                                            </div>

                                        </div>
                                        : <img src={dragItem.imgSrcs} alt="" className='mt-10 w-[60%] h-[30%] rounded-md' />

                                }
                                <div className='w-full h-[50%] mt-4 px-4 py-2'>
                                    <div className='flex'>
                                        <div className='w-1/3 font-semibold'>Product Name</div>
                                        <div className='w-2/3 text-end'>{dragItem.productname}</div>
                                    </div>
                                    <div className='flex mt-4'>
                                        <div className='w-1/3 font-semibold'>Description</div>
                                        <div className='w-2/3 text-end'>{dragItem.description}</div>
                                    </div>
                                    <div className='flex mt-4'>
                                        <div className='w-1/3 font-semibold'>Size</div>
                                        <div className='w-2/3  text-end'>{
                                            dragItem.size.length > 0 ?
                                                dragItem.size.map((size, index) => (
                                                    <span >{size}{index !== dragItem.size.length - 1 ? "," : ""}</span>
                                                )) : <div>no sizes</div>
                                        }
                                        </div>
                                    </div>
                                    <div className='flex mt-4'>
                                        <div className='w-1/3 font-semibold'>Price</div>
                                        <div className='w-2/3 text-end'>{dragItem.price}$</div>
                                    </div>
                                    <div className='flex mt-4'>
                                        <div className='w-1/3 font-semibold'>Stock</div>
                                        <div className='w-2/3 text-end'>{dragItem.initialstock + " "}items</div>
                                    </div>
                                    <div className='flex mt-4 '>
                                        <div className='w-1/4 font-semibold'>Colors</div>
                                        <div className='w-3/4 flex justify-end'>
                                            {
                                                dragItem.color.length > 0 ?
                                                    dragItem.color.map((clr, index) => (
                                                        <div key={index} className='transition-all hover:scale-[1.05] duration-[200ms] w-[20px] clr-bg h-[20px] ml-1 rounded-full relative cursor-pointer' style={{ backgroundColor: clr }}>
                                                            <span className={`clr-hex w-[80px] rounded-sm text-center hidden absolute top-[130%] left-[-250%] bg-opacity-50
                                                            ${clr === '#444444' || '#7c2a00' ? 'text-whitev1' : 'text-black'}
                                                            `}
                                                                style={{ backgroundColor: clr }}
                                                            >{clr}</span>
                                                        </div>

                                                    )) : <div> no colors</div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            : <div className={`font-semibold cursor-pointer text-gry flex flex-col items-center justify-center h-[85%] w-full ${dragEnter ? 'bg-obsidian bg-opacity-35' : ''}`} onDragOver={(e) => handleDragOver('details', e)} onDrop={(e) => handleDrop(e)} onDragLeave={(e) => handleDragLeave(e)}>
                                <div className='opacity-45 text-md mb-6 sig-font px-6 text-center'>
                                    <div>Click Products</div>
                                    <div>--------------- Or ---------------</div>
                                    <div>Drag and Drop items to see Details </div>
                                </div>
                                <img src={analyst} alt="" className='w-[50%]' />
                            </div>
                    }
                    {
                        dragItem ?
                            <div className='w-full h-[5.2%] flex'>
                                <button className="w-1/2 text-center text-white bg-customBluishPurple"
                                    onClick={handleUpdate}
                                >Update</button>
                                <button className="w-1/2 text-center text-whitev1 bg-cherry" onClick={handleDelete}>Delete</button>
                            </div> : ""
                    }

                </div>

            </div>
            {
                adding || updating ?
                    <div className=' absolute flex justify-center items-center w-full h-full bg-black bg-opacity-50'>
                        <div className='transition-all duration-[200ms] w-[22%] bg-loading bg-opacity-50 hover:bg-opacity-65 h-2/3 bg-white p-4 rounded-lg relative flex flex-col items-center justify-between'>
                            <div className='w-full h-1/2 bg-slate-300 rounded-md cus-bg '></div>
                            <div className='w-2/4 h-[5%] text-center bg-obsidian text-white rounded-md wel-font absolute top-[-1%] left-[24%]'>
                                {adding ? 'Add' : 'Update'} To Shop
                            </div>
                            <div className='w-full'>
                                <button className='transition-all duration-[200ms] w-[49%] h-[40px] text-white bg-customBluishPurple rounded-full hover:bg-opacity-85' onClick={() => addProduct()}>{adding ? 'Add' : 'Update'} Product</button>
                                <button className='transition-all duration-[200ms] w-[49%] h-[40px] text-white ml-[4px] bg-cherry rounded-full hover:bg-opacity-85' onClick={closeAddPopUp}>Cancel</button>
                            </div>
                        </div>
                        <div className='transition-all duration-[200ms] w-[40%] bg-loading ml-2 h-2/3 bg-obsidian bg-opacity-50 hover:bg-opacity-60 rounded-lg flex flex-col justify-center items-center overflow-auto'>
                            <div className='flex w-3/4'>
                                <input value={pname} type="text" placeholder='Product Name' className='bg-transparent border-b-2  p-2 w-1/2 outline-none text-lavender' onChange={(e) => setPname(e.target.value)} />
                                <input value={pstock} type="number" placeholder='Stock' className='bg-transparent border-b-2 ml-4 p-2 w-1/2 outline-none text-lavender' onChange={(e) => setPstock(Number(e.target.value))} />
                            </div>
                            <div className='w-3/4 mt-6'>
                                <textarea value={pdesc} name="" id="" className='w-full wel-font h-[40px] px-2' placeholder='Description' onChange={(e) => setPdesc(e.target.value)}></textarea>
                            </div>
                            <div className='flex w-3/4 mt-4'>
                                <div className='w-1/2 bg-white mr-4 h-[40px] px-3 flex items-center justify-between wel-font relative' onClick={() => setExpand(!expand)}>
                                    {selectedUnit}
                                    <img src={upDown} alt="" className='w-4' />
                                    {
                                        expand ?
                                            <div className='w-full absolute top-[110%] left-0 h-[200px] overflow-auto bg-white rounded-b-md z-30'>
                                                {
                                                    unitlists.map((unit, index) => (
                                                        <div key={index} className={` transition-all duration-[200ms] italic cursor-pointer px-2 py-1  hover:bg-obsidian hover:bg-opacity-20 ${index !== unitlists.length - 1 ? "border-b-[1px]" : ""}`} onClick={() => handleSelectedUnit(unit.short)}
                                                        >{unit.unitname}({unit.short})</div>
                                                    ))
                                                }
                                            </div> : ""
                                    }
                                </div>
                                <div className='w-1/2'>
                                    <input value={pprice} type="number" placeholder='Price' className='bg-transparent border-b-2 p-2 w-full h-[40px] outline-none text-lavender' onChange={(e) => setPprice(Number(e.target.value))} />
                                </div>
                            </div>
                            <div className='w-3/4 mt-4 flex'>
                                <div className='flex'>
                                    <input value={psize} type="text" placeholder='Size' className='bg-transparent border-b-2 p-2 w-2/3 h-[40px] outline-none text-lavender mr-4' onChange={(e) => setSize(e.target.value)} onKeyDown={(e) => handleKeyPress(e)} />
                                    <button className='w-1/2 bg-cherry mr-2 rounded-sm' onClick={addSize}>Add</button>
                                </div>
                                <input type="file" className='hidden' id='file-upload' accept='image/*' multiple onChange={(e) => handleFileChange(e)} />
                                <button className=' bg-customBluishPurple w-1/2 h-[40px] flex items-center justify-center text-white' onClick={triggerFileChange}> + Add Product Images</button>
                            </div>

                            <div className='flex w-3/4 mt-4'>
                                <div className='w-full flex relative'>
                                    <div className='w-1/2 bg-white mr-2 h-[40px] px-3 cursor-pointer flex items-center justify-between wel-font' onClick={() => chooseZ(0)} >
                                        Size
                                        <img src={upDown} alt="" className='w-4' />
                                    </div>

                                    {
                                        sizeLists && siexpand ?
                                            <div className={`w-[200px] absolute top-[105%] left-0 h-[190px] overflow-auto bg-white `}>
                                                {
                                                    updating ? dragItem.size.map((size, index) => (
                                                        <div key={index} className={` transition-all duration-[200ms] italic cursor-pointer px-2 py-1 hover:border-obsidian flex items-center justify-between ${index !== unitlists.length - 1 ? "border-b-[1px]" : ""}`}
                                                        >{size}
                                                            {
                                                                updating ? <MdRemoveCircle className='transition-all duration-[200ms]  hover:text-red-600' onClick={() => deleteDataSize(index)} /> : ''
                                                            }
                                                        </div>
                                                    )) : sizeLists.map((size, index) => (
                                                        <div key={index} className={` transition-all duration-[200ms] italic cursor-pointer px-2 py-1 hover:bg-obsidian hover:bg-opacity-20 ${index !== sizeLists.length - 1 && "border-b-[1px]"} flex justify-between items-center`}
                                                        >{size}
                                                            <MdOutlineBookmarkRemove className='hover:text-red-500' onClick={() => filterSizeList(index)} />
                                                        </div>
                                                    ))
                                                }
                                            </div> : ""
                                    }


                                    <div className='w-2/3 bg-whitev1 bg-opacity-60 h-full flex items-center px-2'>
                                        <div className='w-1/2 flex justify-start'>
                                            <input value={color} type="color" onChange={(e) => setColor(e.target.value)} />
                                        </div>
                                        <div className='w-1/2 flex justify-end'>
                                            {color}
                                        </div>
                                    </div>
                                    <div className='w-1/3 h-full mx-2'>
                                        <button className='w-full bg-cherry rounded-sm h-full ' onClick={addColor}>Add</button>
                                    </div>
                                    <div className='w-1/2 mr-0 bg-white h-[40px] px-1 cursor-pointer flex items-center justify-between wel-font ' onClick={() => chooseZ(1)} >
                                        colors
                                        <img src={upDown} alt="" className='w-4' />
                                    </div>
                                    {
                                        colorLists && clexp ?
                                            <div className={`w-[200px] absolute top-[105%] right-0 h-[190px] overflow-auto z-30 bg-white `}>
                                                {
                                                    updating ? dragItem.color.map((size, index) => (
                                                        <div key={index} className={` transition-all duration-[200ms] italic cursor-pointer px-2 py-1 hover:border-obsidian flex items-center justify-between ${index !== dragItem.color.length - 1 ? "border-b-[1px]" : ""}`}
                                                        >{size}
                                                            {
                                                                updating ? <MdRemoveCircle className='transition-all duration-[200ms]  hover:text-red-600' onClick={() => deleteDataColor(index)} /> : ''
                                                            }
                                                        </div>
                                                    )) : colorLists.map((size, index) => (
                                                        <div key={index} className={` transition-all duration-[200ms] italic cursor-pointer px-2 py-1 hover:bg-obsidian hover:bg-opacity-20 ${index !== colorLists.length - 1 && "border-b-[1px]"} flex items-center justify-between`}
                                                        >{size}
                                                            <MdOutlineBookmarkRemove className='hover:text-red-500' onClick={() => filterColorList(index)} />
                                                        </div>
                                                    ))
                                                }
                                            </div> : ""
                                    }

                                </div>
                            </div>
                            <div className='w-3/4 h-[30%] bg-white mt-10 rounded-lg bg-opacity-15 flex overflow-auto'>
                                {
                                    adding || updating ?
                                        imagePreview.map((img, index) => (
                                            <img key={index} src={img.src} alt="" className=' rounded-md ml-2 my-2' />
                                        )) : ""
                                }

                            </div>
                        </div>
                    </div> : ""
            }
            {
                confirm ?
                    <div className='w-full h-full absolute bg-black bg-opacity-50 flex justify-center items-center'>
                        <div className='w-1/3 h-[15%] bg-whitev1 rounded-md bg-opacity-20 bg-loading'>
                            <div className='flex p-4 h-[40%] bg-white rounded-t-md items-center'>
                                <div className='wel-font'>Are You Sure to Delete </div> <span className=''>( {dragItem.productname} )?</span>
                            </div>
                            <div className='flex h-[60%] justify-end p-4 items-end'>
                                <button className='w-[20%] h-[90%] bg-obsidian bg-opacity-35 rounded-sm text-white' onClick={deleteProduct}>Confirm</button>
                                <button className='w-[20%] h-[90%] bg-white bg-opacity-50 rounded-sm ml-1'
                                    onClick={handleCancel}
                                >Cancel</button>
                            </div>
                        </div>
                    </div> : ""
            }
        </div >
    )
}

export default Product
