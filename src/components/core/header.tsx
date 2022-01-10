import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import {auth} from '../../firebase/clientApp'
export default function Header(data:any) {
    const router = useRouter();    
    return(
        <header className="flex flex-col justify-center items-center text-center my-4 space-y-3">
            <h1 className="text-2l font-bold">{data.data ? "Hello "+data.data.displayName : "To do Series"}</h1>
            <button className="bg-red-700 rounded-md font-bold text-white text-sm px-2 py-1" onClick={() => { signOut(auth).then(()=>{
                router.push('/auth')
                console.log("keluar");
                })}}>keluar</button>
        </header>
    )
}
