import type { NextPage } from 'next'
import {auth} from '../src/firebase/clientApp'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import { Layout } from '../src/components/core/layout'
import { WithAuth } from '../src/components/core/with-auth'
const App: NextPage = () => {
  const router = useRouter();
  
  return (
    <WithAuth>
      <Layout>
        <div>
          <input type="text" />
          <input type="number" />
        </div>
        <button onClick={() => { signOut(auth).then(()=>{
          router.push('/auth')
          console.log("keluar");
        })}}>keluar</button>
      </Layout>
    </WithAuth>
  )
}

export default App
