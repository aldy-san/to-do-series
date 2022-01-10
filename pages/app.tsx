import firebase, {auth,db} from '../src/firebase/clientApp'
import { useRouter } from 'next/router'
import { Layout } from '../src/components/core/layout'
import { WithAuth } from '../src/components/core/with-auth'
import SeriesItem from '../src/components/series-item'
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";

const App = () => {
  const router = useRouter();
  const [series, setSeries] = useState([])
  const [title, setTitle] = useState("")
  const [episode, setEpisode] = useState(0)
  const [day, setDay] = useState("Day")
  const [show, setShow] = useState(false)
  const [user] = useAuthState(auth)

  
    async function getItem() {
      firebase.auth().onAuthStateChanged(async function(user) {
        const q = query(collection(db, "series"), where("uid", "==", user?.uid))
        const getSeries = await getDocs(q);
        let tempSeries = [] as any
        getSeries.forEach((doc) => {
          let tempData = doc.data();
          tempData["itemId"] = doc.id;
          tempSeries.push(tempData);
        });
        setSeries(tempSeries)
      });
    }
  
  useEffect(() => {
    getItem()
  }, [])

  async function AddItem() {
    const temp = {
      uid: user?.uid,
      title:title, 
      maxEpisode: episode,
      currentEpisode: 1,
      dayUpdate: day,
      isCompleted: false
    }
    await addDoc(collection(db, "series"),temp)
    getItem()
    setTitle("")
    setEpisode(0)
    setDay("Day")
  }
  
  return (
    <WithAuth>
      <Layout>
        <div className="flex space-x-4 items-center mx-auto">
          <input className="shadow-lg px-4 py-2 rounded-md w-3/4 border-none" type="text" placeholder="Type the title" onChange={(e) => {setTitle(e.target.value)}} value={title}/>
          <input className="shadow-lg px-4 py-2 rounded-md w-1/6 border-none" type="number" placeholder="Eps" onChange={(e) => {setEpisode(Number(e.target.value))}} value={episode}/>
        <div className="relative inline-block text-left">
          <div>
            <button type="button" className="inline-flex justify-center w-full rounded-md shadow-lg px-4 py-2 bg-white text-sm font-medium hover:bg-gray-50" onClick={() => {setShow(!show)}}>
              {day}
              <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
              </svg>
            </button>
          </div>
          <div className={(show ? "block" : "hidden") + " origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white"} >
            <div className="py-1">
              <button className="text-gray-700 block px-4 py-2 text-sm w-full font-medium text-right" onClick={() => {setDay("Monday"); setShow(false)}}>Monday</button>
              <button className="text-gray-700 block px-4 py-2 text-sm w-full font-medium text-right" onClick={() => {setDay("Tuesday"); setShow(false)}}>Tuesday</button>
              <button className="text-gray-700 block px-4 py-2 text-sm w-full font-medium text-right" onClick={() => {setDay("Wednesday"); setShow(false)}}>Wednesday</button>
              <button className="text-gray-700 block px-4 py-2 text-sm w-full font-medium text-right" onClick={() => {setDay("Thursday"); setShow(false)}}>Thursday</button>
              <button className="text-gray-700 block px-4 py-2 text-sm w-full font-medium text-right" onClick={() => {setDay("Friday"); setShow(false)}}>Friday</button>
              <button className="text-gray-700 block px-4 py-2 text-sm w-full font-medium text-right" onClick={() => {setDay("Saturday"); setShow(false)}}>Saturday</button>
              <button className="text-gray-700 block px-4 py-2 text-sm w-full font-medium text-right" onClick={() => {setDay("Sunday"); setShow(false)}}>Sunday</button>
            </div>
          </div>
        </div>

          <button className="shadow-lg px-4 py-2 rounded-md bg-gray-800 text-white font-bold" onClick={()=> {AddItem()}}>Add</button>
        </div>
        <div className="grid grid-cols-3 mt-16 gap-4 min-h-full">
          {
            series.map((item, idx)=>{
              return (
                <SeriesItem key={idx} data={item} getItem={getItem}/>
              )
            })
          }
        </div>
        
      </Layout>
    </WithAuth>
  )
}

export default App
