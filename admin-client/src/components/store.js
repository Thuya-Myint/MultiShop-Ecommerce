import React, { useState, useEffect } from 'react'
import Sidebar from '../components/sidebar'
import logo1 from '../assets/shop logo/borcelle.png'
import { LuImagePlus } from "react-icons/lu";
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios';
import app from '../config/firebase'
import { ref, getStorage, uploadBytes, getDownloadURL } from 'firebase/storage'
import Loading from './loading';
import { useNavigate } from 'react-router-dom';

const Store = ({ tokenx, id, username, role }) => {
    const active = 5;
    const storage = getStorage(app);
    const [file, setFile] = useState();
    const [imagePreview, setImagePreview] = useState();
    const [shopUsername, setShopUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [userCreated, setUserCreated] = useState(false);
    const [action, setAction] = useState("Go to Shop Creation");
    const [shopName, setShopName] = useState('');
    const [shopAddress, setShopAddress] = useState('');
    const [shopPhoneNumber, setShopPhoneNumber] = useState('');
    const inputLists = [shopName, shopAddress, shopPhoneNumber];
    const inputMsg = ['shop name', 'shop address', 'shop phone number'];
    const navigate = useNavigate();


    const toastMsg = (status, detail) => {
        switch (status) {
            case 'success': return toast.success(detail);
            case 'fail': return toast.error(detail);
        }
    }
    const createShop = async () => {
        if (username.trim() === '') {
            setUserCreated(false);
            return toastMsg('fail', 'Invalid username!');
        }
        else if (password.trim() === '') {
            setUserCreated(false);
            return toastMsg('fail', 'Invalid password!');
        }
        else if (!file)
            return toastMsg('fail', 'shop logo require!');

        inputLists.map((input, index) => {
            if (input.trim() === '') {
                toastMsg('fail', inputMsg[index] + ' require!');
            }

        })

        setLoading(true);
        try {
            let logoUrl = '';
            const storageRef = ref(storage, `shop logo/${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            logoUrl = await getDownloadURL(snapshot.ref);
            const token = await axios.post('http://localhost:8090/api/user/new', {
                username: shopUsername,
                password: password,
                imgSrc: 'default',
                role: 'shop admin',
                shopName: shopName,
                shopAddress: shopAddress,
                shopPhoneNumber: shopPhoneNumber,
                shopLogo: logoUrl
            }, {
                headers: {
                    'x-access-token': tokenx
                }
            })
            if (token) toastMsg('success', 'Successfully Create Shop Admin');
            setShopUsername('');
            setPassword('');
            setShopName('');
            setShopAddress('');
            setShopPhoneNumber('');
            setFile();
            setImagePreview();
            setTimeout(() => {
                setLoading(false)
            }, 1000);
            setUserCreated(true)
        } catch (error) {
            setLoading(false)
            if (error.status === 401)
                return toastMsg('fail', 'User already exists or same name exists');
            console.log(error);
            toastMsg('fail', error.detail.message)
        }
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview({ src: reader.result, name: selectedFile.name });
            };
            reader.readAsDataURL(selectedFile);
        }
    };
    const triggerFileUpload = () => {
        document.getElementById('file-upload').click();
    }
    const handleChanges = () => {
        setAction(userCreated ? 'Go to Shop Creation' : 'Go to User Creation')
        setUserCreated(!userCreated);

    }
    return (

        <div className='w-[100vw] h-[100vh] bg-white flex overflow-auto'>
            < ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
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
                    <div className='z-50 absolute left-[4.3%] bg-transparent'>
                        <Loading isLoad={loading} value={'Creating Shop'} />
                    </div> :
                    <div className=' h-full w-full overflow-hidden relative'>
                        <div className='h-full w-full rounded-md p-1 flex flex-col items-center justify-center'>

                            <div className='w-[30%] relative mb-1 text-center bg-obsidian bg-opacity-80 rounded-md p-2 sig-font text-white'>Create new Shop Admin
                                {
                                    loading &&
                                    <div className={`absolute w-[5%] h-[2px] top-[90%] left-0 rounded-md bg-whitev2 ${loading && 'stick-Ani'}`}></div>
                                }
                            </div>


                            <div className='w-[30%] h-[30%] bg-whitev3 rounded-md flex flex-col justify-center items-center'>
                                <input type="text" value={shopUsername} onChange={(e) => setShopUsername(e.target.value)}
                                    className='w-3/4 p-2 bg-opacity-35 rounded-md outline-none'
                                    placeholder='Username'
                                />
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                    className='w-3/4 p-2 bg-opacity-35 rounded-md outline-none mt-[5%]'
                                    placeholder='password'
                                />
                            </div>
                            <div className='w-[30%] flex items-end justify-center text-white sig-font mt-1'>
                                <button className={`transition-all  duration-[600ms] w-[30%] left-[35%] bg-customBluishPurple p-2 mr-1 rounded-md active:scale-[0.9] absolute  ${userCreated ? 'top-[5%] z-20' : ' top-[69%]  '}`} onClick={handleChanges}>{action}</button>

                            </div>
                        </div>

                        <div className={`absolute transition-all duration-[500ms] w-full h-full bg-white rounded-sm p-2 flex items-center flex-col justify-center  ${userCreated ? 'top-[0%]' : 'top-[100%]'}`}>

                            <div className='w-full h-[40%]  flex items-center justify-center'>
                                <div className='w-[20%] h-full bg-obsidian bg-opacity-55 rounded-md mr-2 p-2'>
                                    <div className='w-full h-[90%] '>
                                        {
                                            imagePreview?.src ?
                                                <img src={imagePreview?.src} alt="" className='w-full h-full rounded-sm' /> :
                                                <div className='bg-obsidian'>
                                                </div>
                                        }
                                    </div>
                                    <input type="file" className='hidden' accept='image/*' id='file-upload' onChange={(e) => handleFileChange(e)} />
                                    <button className='transition-all duration-[200ms] w-full bg-obsidian p-1 mt-1 rounded-sm bg-opacity-30 active:bg-opacity-60 active:scale-[0.95] sig-font text-whitev3 text-[0.9rem] flex justify-center items-center'
                                        onClick={triggerFileUpload}
                                    > <LuImagePlus className='text-[1.2rem] mr-1' /> Add Shop Logo</button>
                                </div>
                                <div className='w-[25%] h-full  bg-opacity-65 rounded-md'>
                                    <div className='justify-center items-center w-full p-1 h-[80%]'>
                                        <div className='w-full p-1'>
                                            <div className='mb-1 '>Shop Name</div>
                                            <input value={shopName} type="text" className='w-full p-1 bg-obsidian bg-opacity-15 outline-none rounded-sm focus:outline-obsidian outline-offset-2 ' onChange={(e) => setShopName(e.target.value)} />
                                        </div>
                                        <div className='w-full mt-1 p-1'>
                                            <div className='mb-1'>Shop Address</div>
                                            <input value={shopAddress} type="text" className='w-full p-1 bg-obsidian bg-opacity-15  outline-none rounded-sm focus:outline-obsidian outline-offset-2 '
                                                onChange={(e) => setShopAddress(e.target.value)}
                                            />
                                        </div>
                                        <div className='w-full mt-1 p-1'>
                                            <div className='mb-1'>Shop Phone Number</div>
                                            <input value={shopPhoneNumber} type="text" className='w-full p-1 bg-obsidian bg-opacity-15  outline-none rounded-sm focus:outline-obsidian outline-offset-2 '
                                                onChange={(e) => setShopPhoneNumber(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className='h-[20%] flex items-end'>
                                        <button className='transition-all duration-[200ms] active:scale-[0.9] bg-cherry text-white w-full p-1 rounded-sm sig-font m-1' onClick={createShop}>Create Shop </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
            }

        </div>
    )
}
export default Store;
