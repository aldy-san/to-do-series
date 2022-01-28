import * as React from "react";
import Header from "./header"
import Footer from "./footer"
import Head from "next/head";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
export const Layout:React.FC = ({ children }) => {
    const [user] = useAuthState(auth)
    
    return(
        <div className="flex flex-col min-h-screen">
            <Head>
                <title>To Do Series (beta)</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="fixed flex top-0 left-0 w-full justify-center mt-4" id="toast-container">
                {/* <Toast/> */}
            </div>
            <Header data={user}/>
            <main className="flex flex-col mx-2 lg:mx-40 mt-12 justify-center items-center mb-auto">
                {children}
            </main>
            <Footer/>
        </div>
    )
}