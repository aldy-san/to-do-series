import firebase, {auth,db} from '../src/firebase/clientApp'
import { Layout } from '../src/components/core/layout'
import { WithAuth } from '../src/components/core/with-auth'
import SeriesItem from '../src/components/series-item'
import { collection, addDoc, getDocs, query, where } from "firebase/firestore"
import { useEffect, useState } from 'react'
import { useAuthState } from "react-firebase-hooks/auth";
import RadioButton from '../src/components/radio-button'
import Button from '../src/components/button'
import Input from '../src/components/input'

const App = () => {
  const itemDefault = {
    itemId: '',
    title: '',
    maxEpisode: 0,
    currentEpisode: 0,
    dayUpdate: '',
    isCompleted: false
  }
  const [series, setSeries] = useState([])
  const [title, setTitle] = useState("")
  const [episode, setEpisode] = useState(1)
  const [itemPopUp, setItemPopUp] = useState(itemDefault)
  const [radio, setRadio] = useState("")
  const [user] = useAuthState(auth)
  
  async function getItem() {
    firebase.auth().onAuthStateChanged(async function(user) {
      if (user) {
        const q = query(collection(db, "series"), where("uid", "==", user?.uid))
        const getSeries = await getDocs(q);
        let tempSeries = [] as any
        getSeries.forEach((doc) => {
          let tempData = doc.data();
          tempData["itemId"] = doc.id;
          tempSeries.push(tempData);
        });
        setSeries(tempSeries)
      }
    });
  }
  useEffect(() => {
    getItem()
  }, [])
  function setPopUp(data: any){
    setItemPopUp( data )
    console.log(data);
  }

  async function addItem() {
    const temp = {
      uid: user?.uid,
      title:title, 
      maxEpisode: episode,
      currentEpisode: 1,
      dayUpdate: "",
      isCompleted: false
    }
    await addDoc(collection(db, "series"),temp)
    getItem()
    setTitle("")
    setEpisode(1)
  }

  return (
    <WithAuth>
      <Layout>
        <div className="flex space-x-4 items-center mx-auto">
          <div className="flex flex-col w-5/6 space-y-2">
            <label htmlFor="addTitle" className="font-medium">Title</label>
            <Input  value={title}
                    type="text"
                    placeholder="Type the title"
                    onChange={(e) => {setTitle(e.target.value)}}/>
          </div>
          <div className="flex flex-col w-1/6 space-y-2">
            <label htmlFor="addEpisode" className="font-medium">Episodes</label>
            <Input  value={episode}
                    type="number"
                    placeholder="Eps"
                    onChange={(e) => {setEpisode(Number(e.target.value))}}/>
          </div>
          <Button text="Add" className="bg-gray-800 mt-auto" onClick={()=> {addItem()}}/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 mt-16 gap-4 min-h-full">
          {
            series.map((item, idx)=>{
              return (
                <SeriesItem key={idx} data={item} getItem={getItem} setItemPopUp={setPopUp}/>
              )
            })
          }
        </div>
        <div  className={(itemPopUp.itemId ? "flex" : "hidden") + " fixed flex top-0 left-0 w-screen h-screen bg-gray-400 bg-opacity-20 z-10 items-center"}>
                <div className="flex-1 flex flex-col bg-gray-100 shadow-lg mx-96 rounded-lg space-y-4 p-4">
                    <span className="text-2xl font-bold">{itemPopUp ? itemPopUp.title : ""}</span>
                    <label htmlFor="title" className="font-medium">Title</label>
                    <Input  value={itemPopUp ? itemPopUp.title : ""}
                            type="text"
                            placeholder="Type the title"
                            onChange={(e) => {setTitle(e.target.value)}}/>
                    <label htmlFor="current" className="font-medium">Episode</label>
                    <div className="flex space-x-3">
                      <div className="flex">
                      <Input  className="w-20"
                              value={itemPopUp ? itemPopUp.currentEpisode : ""}
                              type="number"
                              placeholder="Current"
                              id="current"
                              onChange={(e) => {}}/>
                      </div>
                      <span className="text-3xl">/</span>
                      <div className="flex">
                        <Input  className="w-20"
                                value={itemPopUp ? itemPopUp.maxEpisode : ""}
                                type="number"
                                placeholder="Max"
                                onChange={(e) => {}}/>
                      </div>
                    </div>
                    <label htmlFor="" className="font-medium">Day Update</label>
                    <div className="flex justify-start px-1 space-x-4">
                      <RadioButton day='Monday' active={radio} onClick={() => {setRadio('Monday');}}/>
                      <RadioButton day='Tuesday' active={radio} onClick={() => {setRadio('Tuesday')}}/>
                      <RadioButton day='Wednesday' active={radio} onClick={() => {setRadio('Wednesday')}}/>
                      <RadioButton day='Thursday' active={radio} onClick={() => {setRadio('Thursday')}}/>
                      <RadioButton day='Friday' active={radio} onClick={() => {setRadio('Friday')}}/>
                      <RadioButton day='Saturday' active={radio} onClick={() => {setRadio('Saturday')}}/>
                      <RadioButton day='Sunday' active={radio} onClick={() => {setRadio('Sunday')}}/>
                    </div>
                    <div className="flex space-x-3 justify-end py-4">
                      <Button text="Close" className="bg-red-500" onClick={() => {setItemPopUp(itemDefault)}}/>
                      <Button text="Save" className="bg-green-500" onClick={() => {setItemPopUp(itemDefault)}}/>
                    </div>
                </div>
            </div>
      </Layout>
    </WithAuth>
  )
}

export default App
