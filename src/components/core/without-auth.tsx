import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import firebase from "../../firebase/clientApp";
export const WithoutAuth:React.FC = ({ children }) => {
    const router = useRouter();
    useEffect(() => {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                router.push("/app")
            }
          });
      }, [router])
    
    return (<>{children}</>)
}