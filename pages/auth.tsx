import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Layout } from '../src/components/core/layout';
import { WithoutAuth } from '../src/components/core/without-auth';
import firebase from '../src/firebase/clientApp';
const uiConfig = {
    signInSuccessUrl: "/app",
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
}

export default function SignInScreen(){
    return(
        <WithoutAuth>
            <Layout>
                <div className="flex flex-col bg-gray-800 text-white mx-72 py-8 rounded-lg space-y-3">
                    <h1 className="mx-auto font-bold text-2xl">Welcome</h1>
                    <span className="mx-auto text-lg">Nice to meet you again</span>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
                </div>
            </Layout>
        </WithoutAuth>
    )
}
