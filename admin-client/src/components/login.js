import React, { useEffect, useRef, useState } from 'react'
import smoothscroll from 'smoothscroll-polyfill'
import { toast, ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
smoothscroll.polyfill();

const Login = ({ setid, setusername, setrole }) => {
    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState('SIGN IN');
    const [name, setName] = useState('');
    const [pass, setPassword] = useState('');
    const navigate = useNavigate();
    const divRef = useRef(null);
    const divRef1 = useRef(null);
    const clickRef = useRef(null);
    const [role, setRole] = useState('please select role!');
    const roleLists = ['super admin', 'shop admin'];
    const [expand, setExpand] = useState(false);

    useEffect(() => {
        clickRef.current = 'SIGN IN';
    }, [])
    const toastforfail = (why) => {
        toast.error(why, {
            position: 'top-center'
        })
    }
    const toastforSuccess = (why) => {
        toast.success(why);
    }
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleUser();
        }
    }
    // const SignUp = async () => {
    //     setLoading(true)
    //     try {
    //         const token = await axios.post('http://localhost:8090/api/user/new', {
    //             username: name,
    //             password: pass,
    //             imgSrc: 'default',
    //             role: role
    //         })
    //         localStorage.setItem('x-access-token', JSON.stringify(token.data))
    //         toastforSuccess(`Excited you're Here!`);
    //         setTimeout(() => {
    //             setLoading(false);
    //         }, 2000)
    //         navigate('/dashboard')
    //     } catch (error) {
    //         console.error(error);
    //         toastforfail(error.response.data.message)
    //     }
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 2000)

    // }
    const SignIn = async () => {
        setLoading(true);
        try {
            const token = await axios.post('http://localhost:8090/api/user/old', {
                username: name,
                password: pass,
                role: role,
            })
            localStorage.removeItem('x-access-token')
            localStorage.setItem('x-access-token', JSON.stringify(token.data))
            const decoded = jwtDecode(token.data);
            setid(decoded.id);
            setusername(decoded.username);
            setrole(decoded.role);
            toastforSuccess('User Authorized!');
            navigate('/dashboard');
        } catch (error) {
            console.log(error.response.data.message);
            toastforfail(error.response.data.message)
        }
        setTimeout(() => {
            setLoading(false)
        }, 2000)
    }
    const handleUser = async () => {
        name.length === 0 || pass.length === 0 || role === 'please select role!' ?
            toastforfail(`Input Invalid!`) :
            SignIn();
    }
    const changeValue = (value) => {
        if (clickRef.current === 'SIGN IN') {
            divRef.current.scrollBy({
                top: 30,
                behavior: 'smooth'
            })
            divRef1.current.scrollBy({
                top: 30,
                behavior: 'smooth'
            })
        }
        else {
            divRef.current.scrollBy({
                top: -30,
                behavior: 'smooth'
            })
            divRef1.current.scrollBy({
                top: -30,
                behavior: 'smooth'
            })
        }
        clickRef.current = value;
        setMethod(value);
    }
    const handleSelectRole = (role) => {
        setRole(role);
        setExpand(!expand);
    }
    return (
        <div className='w-[100vw] h-[100vh] bg-cus flex '>
            <div className='w-full h-full bg-black bg-opacity-30 flex xl:flex-row flex-col items-center justify-center'>
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
                <div className="text-white xl:w-[40%] text-3xl text-center ">
                    <div className='wel-font'>Welcome Page!</div>
                    <div ref={divRef1} className='text-lg mt-6 font-extralight h-[30px] overflow-hidden'>
                        <div>“Great to see you again! Your app experience just got better!”</div>
                        <div>“Welcome! We’re excited to have you join our app community!”</div>
                    </div>
                    <button className='transition-all duration-[200ms] text-slate-300 text-sm px-4 py-2 mt-10 border-slate-50 border-[1px] hover:bg-black hover:bg-opacity-35 sig-font' onClick={() => changeValue(method === 'SIGN IN' ? 'SIGN UP' : 'SIGN IN')}>Please Sign In!</button>
                </div>
                <div className='xl:w-1/3 w-full h-1/2 flex justify-center items-center relative'>
                    <div className='w-[80%] h-3/4 bg-baseColor bg-opacity-70 flex flex-col items-center rounded-md'>
                        <div ref={divRef} className='text-xl font-extralight text-center mt-[5%] sign-font h-[30px] overflow-hidden'>
                            <div>SIGN IN</div>
                            <div>SIGN UP</div>
                        </div>

                        <input type="text" value={name} className={`transition-all wel-font duration-[100ms] cursor-pointer border-none outline-none w-3/4 mt-6 bg-baseColor px-2 py-1 rounded-sm`} placeholder='Name' onChange={(e) => setName(e.target.value)} />


                        <input type="password" value={pass} className={`cursor-pointer wel-font border-none outline-none w-3/4 mt-2 bg-baseColor px-2 py-1 rounded-sm`} placeholder='Password' onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyPress} />


                        <div className='w-3/4 bg-obsidian mt-2 bg-opacity-65 p-1 rounded-sm relative'>
                            <div className='text-[0.9rem] text-whitev2'>Your Role</div>
                            <div className='transition-all duration-[200ms] cursor-pointer hover:bg-whitev3 bg-whitev1 text-center text-[0.9rem] active:bg-obsidian active:text-white'
                                onClick={() => setExpand(!expand)}
                            >{role}</div>
                            {
                                expand &&
                                <div className='transition-all duration-200 bg-whitev1 absolute w-full left-0 rounded-b-sm top-[50%] bg-loading bg-opacity-65 p-1'>
                                    {
                                        roleLists.map((role, index) => (
                                            <div key={index} className={`transition-all duration-[200ms] p-1 px-2 mt-1 cursor-pointer hover:bg-whitev1 hover:bg-opacity-100 z-10 active:bg-obsidian active:bg-opacity-60 active:text-white`} onClick={() => handleSelectRole(role)}>
                                                {role}
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                        </div>
                        {/* <div className='font-extralight flex items-center w-3/4 mt-2'>
                            <input type="checkbox" className='mr-2' />
                            <div>Remember me!</div>
                        </div> */}
                        <button className=' border-[1px] w-2/3 mt-[4%] py-[2px] bg-black bg-opacity-50 transition-all duration-[200ms] hover:bg-opacity-70 text-white wel-font' onClick={handleUser}>{method}</button>
                    </div>
                    {
                        loading ?
                            <div className='custom-spinner absolute top-[11.5%] shadow-lg shadow-orange-400'></div> : ""
                    }
                </div>

            </div>
        </div>
    )
}

export default Login
