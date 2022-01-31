// @ts-ignore
import ReactDOM from 'react-dom';
import { NextPage } from "next";
import { useEffect, useState } from 'react';

interface Props {
    message: String;
    type: String;
} 
const checkIcon =   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 rounded-full border-2 border-white px-1" viewBox="0 0 20 20" fill="currentColor">
                        <path  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
const refreshIcon =   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 rounded-full border-2 border-white px-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
                    </svg>
const crossIcon =   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 rounded-full border-2 border-white px-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
                    </svg>
const Toast: NextPage<Props> = (props) => {
    const [color, setColor] = useState("bg-gray-500 border-gray-600");
    const [icon, setIcon] = useState(checkIcon);
    const SwitchType = (type: String) =>{
        switch(type){
            case 'success':
                setColor("bg-green-500 border-green-600");
                break;
            case 'warning':
                setColor("bg-yellow-500 border-yellow-600");
                setIcon(refreshIcon)
                break;
            case 'danger':
                setColor("bg-red-500 border-red-600")
                setIcon(crossIcon)
                break;
            default:
                setColor("bg-gray-500 border-gray-500")
                break;
        }
    }
    useEffect(() => {
      SwitchType(props.type);
    }, [props]);
    
    return(
        <div className={color + " flex justify-start rounded-md text-white px-8 py-4 items-center space-x-3 border-b-4"}>
            {icon}
            <p className="text-lg font-medium">{props.message}</p>
        </div>
    )
}
interface ToastProps {
    remove: () => void, 
    currentToast: boolean,
    timeout: any,
    notify: (message:String, options: string) => void, 
}
export const toast:ToastProps = {
    remove: () => {
        ReactDOM.unmountComponentAtNode(document.getElementById('toast-container'))
        toast.currentToast = false
        if(toast.timeout){
          clearTimeout(toast.timeout)
          toast.timeout = null
        }
    },
    currentToast: false,
    timeout: null,
    notify: (message, type) => {
        let duration = 2;
        if (toast.currentToast) {
            toast.remove()
        }

        ReactDOM.render(<Toast message={message} type={type}/>, document.getElementById('toast-container'))
        toast.currentToast = true;
        toast.timeout = setTimeout(toast.remove, duration*1000)
    }
}