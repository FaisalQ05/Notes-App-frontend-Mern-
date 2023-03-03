import React, { useRef } from 'react'
import { useEffect } from 'react';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Toast = ({ message, isError, isSuccess, edit }) => {

    const effectRan = useRef(false)

    const notifyError = () => toast.error(message, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide
    });

    const editErrorToast = () => toast.error(message, {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide
    });

    const notifySuccessToast = () => toast.success(message, {
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide
    });

    // console.log({ message, isError, isSuccess })

    useEffect(() => {
        if (process.env.NODE_ENV !== "development" || effectRan.current == true) {
            if (isError && !edit) {
                // console.log("Error toast")
                notifyError()
            }
            if (isSuccess) {
                notifySuccessToast()
            }
            if (edit) {
                editErrorToast()
            }
        }

        return () => {
            effectRan.current = true
        }
    }, [])
    return (
        <>
            <ToastContainer />
        </>
    )
}

export default Toast