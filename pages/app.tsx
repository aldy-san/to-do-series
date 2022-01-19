import firebase, {auth,db} from '../src/firebase/clientApp'
import { Layout } from '../src/components/core/layout'
import { WithAuth } from '../src/components/core/with-auth'
import SeriesItem from '../src/components/series-item'
import { collection, doc, addDoc, getDocs, query, where, setDoc } from "firebase/firestore"
import { useEffect, useState } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import RadioButton from '../src/components/radio-button'
import Button from '../src/components/button'
import Input from '../src/components/input'

interface itemSeries {
  itemId: string,
  title: string,
  maxEpisode: number,
  currentEpisode: number,
  status?: string,
  dayUpdate?: string,
  isCompleted: boolean
}

const App = () => {
  const itemDefault: itemSeries = {
    itemId: '',
    title: '',
    maxEpisode: 0,
    currentEpisode: 0,
    dayUpdate: '',
    isCompleted: false
  }
  //list of series
  const [series, setSeries] = useState([])
  const [title, setTitle] = useState("")
  const [episode, setEpisode] = useState(1)
  const [itemPopUp, setItemPopUp] = useState<itemSeries>(itemDefault)
  const [user] = useAuthState(auth)

  function compare( a:any, b:any ) {
    if ( a.title < b.title ){
      return -1;
    }
    if ( a.title > b.title ){
      return 1;
    }
    return 0;
  }
  async function getItem() {
    firebase.auth().onAuthStateChanged(async function(user) {
      if (user) {
        const q = query(collection(db, "series"), where("uid", "==", user?.uid))
        console.log(user?.uid);
        const getSeries = await getDocs(q);
        let tempSeries = [] as any
        getSeries.forEach((doc) => {
          let tempData = doc.data();
          tempData["itemId"] = doc.id;
          tempSeries.push(tempData);
        });
        
        tempSeries.sort( compare );
        setSeries(tempSeries)
      }
    });
  }
  useEffect(() => {
    getItem()
  }, []) 
  function setPopUp(data: any){
    setItemPopUp( data )
  }
  function changePopUp(property: keyof itemSeries, value: any){
    setItemPopUp((prevState => {
      let obj: itemSeries = {...prevState, [property]: value };
      return obj
    }))
  }
  async function addItem() {
    const temp = {
      uid: user?.uid,
      title:title, 
      maxEpisode: episode,
      currentEpisode: 1,
      dayUpdate: "",
      status: "",
      isCompleted: false
    }
    await addDoc(collection(db, "series"),temp)
    getItem()
    setTitle("")
    setEpisode(1)
  }

  async function updateItem() {
      const docRef = doc(db, "series", itemPopUp.itemId);
      await setDoc(docRef,itemPopUp);
  }

  return (
    <WithAuth>
      <Layout>
        {/* ADD ITEM */}
        {/* <div className="fixed top-0 left-0 w-full flex justify-center mt-4">
          <p className="text-lg bg-green-100 border-2 border-green-400 rounded-lg text-green-500 px-4 py-2 font-normal">Your Data is <span className="text-green-700 font-bold">saved</span></p>
        </div> */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 justify-center px-4 mx-2 w-full">
          <div className="flex flex-col space-y-2 w-11/12">
            <label htmlFor="addTitle" className="font-medium">Title</label>
            <Input  value={title}
                    type="text"
                    placeholder="Type the title"
                    onChange={(e) => {setTitle(e.target.value)}}/>
          </div>
          <div className="flex flex-col space-y-2 w-1/12">
            <label htmlFor="addEpisode" className="font-medium">Episodes</label>
            <Input  value={episode}
                    type="number"
                    placeholder="Eps"
                    onChange={(e) => {setEpisode(Number(e.target.value))}}/>
          </div>
          <Button text="Add" className="bg-gray-800" onClick={()=> {addItem()}}/>
        </div>
        {/* LIST ITEM */}
        <div className="grid grid-cols-1 lg:grid-cols-3 mt-16 gap-4 min-h-full">
          {
            series.map((item, idx)=>{
              return (
                <SeriesItem key={idx} data={item} getItem={getItem} setItemPopUp={setPopUp}/>
              )
            })
          }
        </div>
        {/* EDIT POP UP */}
        <div  className={(itemPopUp.itemId ? "flex" : "hidden") + " fixed flex top-0 left-0 w-screen h-screen bg-gray-400 bg-opacity-20 z-10 items-center"}>
            <div className="flex-1 flex flex-col bg-gray-100 shadow-lg mx-96 rounded-lg space-y-4 p-4">
                <span className="text-2xl font-bold">{itemPopUp ? itemPopUp.title : ""}</span>
                <label htmlFor="title" className="font-medium">Title</label>
                <Input  value={itemPopUp ? itemPopUp.title : ""}
                        type="text"
                        placeholder="Type the title"
                        onChange={(e) => {changePopUp('title', e.target.value)}}/>
                <label htmlFor="" className="font-medium">Episode</label>
                <div className="flex space-x-3">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="current" className="text-sm">Current</label>
                    <Input  className="w-20"
                            value={itemPopUp ? itemPopUp.currentEpisode : ""}
                            type="number"
                            placeholder="Current"
                            id="current"
                            onChange={(e) => {changePopUp('currentEpisode', e.target.value)}}/>
                  </div>
                  <span className="text-4xl mt-auto mb-1">/</span>
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="max" className="text-sm">Max</label>
                    <Input  className="w-20"
                            value={itemPopUp ? itemPopUp.maxEpisode : ""}
                            type="number"
                            placeholder="Max"
                            id="max"
                            onChange={(e) => {changePopUp('maxEpisode', e.target.value)}}/>
                  </div>
                </div>
                <label htmlFor="" className="font-medium">Status</label>
                <div className="flex justify-start px-1 space-x-4">
                  <RadioButton  day='On-Going' 
                                name="status"
                                className="hover:border-cyan-500 active:text-cyan-400"
                                activeClassName='bg-cyan-500 border-cyan-500' 
                                active={itemPopUp.status} 
                                onClick={() => {changePopUp('status', 'On-Going')}}/>
                  <RadioButton  day='On-Hold' 
                                name="status"
                                className="hover:border-yellow-500 active:text-yellow-400"
                                activeClassName='bg-yellow-500 border-yellow-500' 
                                active={itemPopUp.status} 
                                onClick={() => {changePopUp('status', 'On-Hold')}}/>
                  <RadioButton  day='Finished' 
                                name="status"
                                className="hover:border-green-500 active:text-green-400"
                                activeClassName='bg-green-500 border-green-500' 
                                active={itemPopUp.status} 
                                onClick={() => {changePopUp('status', 'Finished')}}/>
                </div>
                <label htmlFor="" className={(itemPopUp.status === "On-Going" ? "" : "hidden ")+"font-medium"}>Day Update</label>
                <div className={(itemPopUp.status === "On-Going" ? "" : "hidden ")+"flex justify-start px-1 space-x-4"}>
                  <RadioButton  day='Monday' 
                                name="day"
                                className="hover:border-blue-500 active:text-blue-400"
                                activeClassName='bg-blue-500 border-blue-500' 
                                active={itemPopUp.dayUpdate} 
                                onClick={() => {changePopUp('dayUpdate', 'Monday')}}/>
                  <RadioButton  day='Tuesday' 
                                name="day"
                                className="hover:border-blue-500 active:text-blue-400"
                                activeClassName='bg-blue-500 border-blue-500' 
                                active={itemPopUp.dayUpdate} 
                                onClick={() => {changePopUp('dayUpdate', 'Tuesday')}}/>
                  <RadioButton  day='Wednesday' 
                                name="day"
                                className="hover:border-blue-500 active:text-blue-400"
                                activeClassName='bg-blue-500 border-blue-500' 
                                active={itemPopUp.dayUpdate} 
                                onClick={() => {changePopUp('dayUpdate', 'Wednesday')}}/>
                  <RadioButton  day='Thursday' 
                                name="day"
                                className="hover:border-blue-500 active:text-blue-400"
                                activeClassName='bg-blue-500 border-blue-500' 
                                active={itemPopUp.dayUpdate} 
                                onClick={() => {changePopUp('dayUpdate', 'Thursday')}}/>
                  <RadioButton  day='Friday' 
                                name="day"
                                className="hover:border-blue-500 active:text-blue-400"
                                activeClassName='bg-blue-500 border-blue-500' 
                                active={itemPopUp.dayUpdate} 
                                onClick={() => {changePopUp('dayUpdate', 'Friday')}}/>
                  <RadioButton  day='Saturday' 
                                name="day"
                                className="hover:border-blue-500 active:text-blue-400"
                                activeClassName='bg-blue-500 border-blue-500' 
                                active={itemPopUp.dayUpdate} 
                                onClick={() => {changePopUp('dayUpdate', 'Saturday')}}/>
                  <RadioButton  day='Sunday' 
                                name="day"
                                className="hover:border-blue-500 active:text-blue-400"
                                activeClassName='bg-blue-500 border-blue-500' 
                                active={itemPopUp.dayUpdate} 
                                onClick={() => {changePopUp('dayUpdate', 'Sunday')}}/>
                </div>
                <div className="flex space-x-3 justify-end py-4">
                  <Button text="Close" className="bg-red-500" onClick={() => {setItemPopUp(itemDefault); getItem()}}/>
                  <Button text="Save" className="bg-green-500" onClick={() => {updateItem()}}/>
                </div>
            </div>
        </div>
      </Layout>
    </WithAuth>
  )
}

export default App
