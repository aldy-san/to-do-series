// @ts-ignore
import ReactDOM from 'react-dom';
import { NextPage } from "next";
interface Props {
    className?: String;
    text?: String;
}

interface Props {
    message: String;
    color: String;
} 
const Toast: NextPage<Props> = (props) => {
    return(
        <div className="flex justify-start bg-green-400 rounded-md text-white px-8 py-4 items-center space-x-3 border-b-4 border-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 rounded-full border-2 border-white px-1" viewBox="0 0 20 20" fill="currentColor">
                <path  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
            <p className="text-lg font-medium">{props.message}</p>
        </div>
    )
}
interface ToastProps {
    remove: () => void, 
    currentToast: boolean,
    timeout: any,
    notify: (message:String, options?: any) => void, 
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
    notify: (message, options) => {
        let duration = 2;
        // let color = 'green';
        if (toast.currentToast) {
            toast.remove()
        }

        // let transitionPercentage = 0.3*(100/duration);
        ReactDOM.render(<Toast message={message} color=""/>, document.getElementById('toast-container'))
        toast.currentToast = true;
        toast.timeout = setTimeout(toast.remove, duration*1000)
    }
}