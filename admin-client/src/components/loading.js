import { React, useState } from 'react'

const Loading = ({ isLoad, value }) => {
    return (
        <div className='w-[100vw] h-[100vh]'>
            {
                isLoad ?
                    <div className='w-screen h-screen absolute top-0 left-0 bg-obsidian bg-opacity-50 bg-loading z-20 flex flex-col items-center justify-center text-white cursor-pointer'>
                        <div className='fetch-text'>{value}</div>
                        <div className='flex text-2xl w-[200px] h-[4px] bg-white mt-4 rounded-full'>
                            <div className='load-stick bg-customBluishPurple'></div>
                        </div>
                    </div>
                    : ""
            }
        </div>
    )
}

export default Loading
