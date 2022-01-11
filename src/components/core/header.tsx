import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth';
import {auth} from '../../firebase/clientApp'
import Link from 'next/link'
export default function Header(data:any) {
    const router = useRouter();
    const [user] = useAuthState(auth)
    function Out(){
        signOut(auth).then(()=>{
            router.push('/auth')
        })
    }
    return(
        <header className="flex flex-col justify-center items-center text-center my-4 space-y-3">
            <h1 className="text-2l font-bold"><Link href="/"><a>{data.data ? "Hello "+data.data.displayName : "To do Series"}</a></Link></h1>
            <button className={(user ? "block" : "hidden")+" bg-red-700 rounded-md font-bold text-white text-sm px-2 py-1"} 
                    onClick={() => { Out() }}>
                        keluar
            </button>
        </header>
    )
}
