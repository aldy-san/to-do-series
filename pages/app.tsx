import type { NextPage } from 'next'
import {auth} from '../src/firebase/clientApp'
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/router'
import { Layout } from '../src/components/core/layout'
import { WithAuth } from '../src/components/core/with-auth'
const App: NextPage = () => {
  const router = useRouter();
  const data = [
    {
      title: "Meikyuu Black Company",
      maxEpisode: 12,
      currentEpisode:4, 
      dayUpdate: "Monday",
    },
    {
      title: "Meikyuu Black Company",
      maxEpisode: 12,
      currentEpisode:4, 
      dayUpdate: "Monday",
    },
    {
      title: "Meikyuu Black Company",
      maxEpisode: 12,
      currentEpisode:4, 
      dayUpdate: "Monday",
    },
    {
      title: "Meikyuu Black Company",
      maxEpisode: 12,
      currentEpisode:4, 
      dayUpdate: "Monday",
    },
  ]
  const AddItem = (title:string, maxEpisode: number) => {
    // const temp = {
    //   title:title, 
    //   maxEpisode: maxEpisode,
    //   currentEpisode: 1,
    //   dayUpdate: "Monday"
    // }
    // data.push(temp)
  }
  return (
    <WithAuth>
      <Layout>
        <div className="flex space-x-4 items-center mx-auto">
          <input className="shadow-lg px-4 py-2 rounded-md w-3/4 border-none" type="text" placeholder="Type the title"/>
          <input className="shadow-lg px-4 py-2 rounded-md w-1/6 border-none" type="number"  placeholder="Type the max episode"/>
          <button className="shadow-lg px-4 py-2 rounded-md bg-gray-800 text-white font-bold ">Add</button>
        </div>
        <div className="grid grid-cols-3 mt-16 gap-4">
          {
            data.map((items, idx)=>{
              return (
                <div className="flex flex-col col-span-1 p-4 border-2 rounded-lg space-y-3" key={idx}>
                  <span className="font-bold text-xl">{items.title}</span>
                  <span className="font-medium text-lg">Episode: {items.currentEpisode}/{items.maxEpisode}</span>
                  <span className="text-lg">Next episode release on <span className="font-bold">{items.dayUpdate}</span></span>
                  <div className="flex w-full space-x-2">
                    <button className="flex-1 bg-red-600 text-white font-bold py-1 rounded-lg">Delete</button>
                    <button className="flex-1 bg-green-600 text-white font-bold py-1 rounded-lg">Next</button>
                  </div>
                </div>
              )
            })
          }
        </div>
        <button className="bg-red-500 mt-24" onClick={() => { signOut(auth).then(()=>{
          router.push('/auth')
          console.log("keluar");
        })}}>keluar</button>
      </Layout>
    </WithAuth>
  )
}

export default App
