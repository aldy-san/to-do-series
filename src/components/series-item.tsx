import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import {db} from '../firebase/clientApp'

type items = {
    itemId: string,
    title: string,
    maxEpisode: number,
    currentEpisode: number,
    dayUpdate?: string,
    isCompleted: boolean
}

type item = {
    data: items
    getItem : () => void
    setItemPopUp : (data:any) => void
}

export default function SeriesItem(data:item){
    async function DeleteItem(itemId:string){
        await deleteDoc(doc(db, "series", itemId))
        data.getItem()
    }
    async function EditItem(){
        data.setItemPopUp(data.data)
    }
    async function UpdateEpisode(itemId: string, currentEpisode: number, maxEpisode: number){
        
        if (currentEpisode == maxEpisode){
            await updateDoc(doc(db, "series", itemId), {
                isCompleted: true
            })
        } else {
            await updateDoc(doc(db, "series", itemId), {
                currentEpisode: currentEpisode + 1
            })
        }
        data.getItem()
    }

    return (
        <>
            <div className="flex flex-col col-span-1 p-4 shadow-md rounded-lg space-y-2">
                <span className="font-bold text-xl">{data.data.title}</span>
                <span className="font-medium text-lg mt-auto">Episode: {data.data.currentEpisode}/{data.data.maxEpisode}</span>
                <span className="text-lg">Next episode release on <span className="font-bold">{data.data.dayUpdate}</span></span>
                <div className="flex w-full space-x-2 h-full">
                    <button className="flex-1 bg-red-600 text-white font-bold py-1 rounded-lg active:brightness-90 mt-auto" 
                            onClick={() => { DeleteItem(data.data.itemId) }}>Delete</button>
                    <button className="flex-1 bg-yellow-600 text-white font-bold py-1 rounded-lg active:brightness-90 mt-auto" 
                            onClick={() => { EditItem() }}>Edit</button>
                    <button className={(data.data.isCompleted ? "brightness-75" : "") + " flex-1 bg-green-600 text-white font-bold py-1 rounded-lg active:brightness-90 mt-auto"} 
                            onClick={() => { UpdateEpisode(data.data.itemId, data.data.currentEpisode, data.data.maxEpisode) }}
                            disabled={data.data.isCompleted}>{(data.data.currentEpisode == data.data.maxEpisode) ? "Complete" : "Next"}</button>
                </div>
            </div>
            
        </>
    )
}