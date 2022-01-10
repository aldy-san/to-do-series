import { doc, deleteDoc } from "firebase/firestore"
import { useState } from "react"
import {db} from '../firebase/clientApp'

type items = {
    itemId: string
    title: string,
    maxEpisode: number,
    currentEpisode: number,
    dayUpdate?: string,
}

type item = {
    data: items
    getItem : () => void
}
type getFunc = () => void
export default function SeriesItem(data:item){
    console.log(data.data);
    
    async function DeleteItem(itemId:string){
        console.log("hai");
        console.log(itemId);
        await deleteDoc(doc(db, "series", itemId))
    }
    return (
        <div className="flex flex-col col-span-1 p-4 shadow-md rounded-lg space-y-3 ">
            <span className="font-bold text-xl">{data.data.title}</span>
            <span className="font-medium text-lg">Episode: {data.data.currentEpisode}/{data.data.maxEpisode}</span>
            <span className="text-lg">Next episode release on <span className="font-bold">{data.data.dayUpdate}</span></span>
            <div className="flex w-full space-x-2">
            <button className="flex-1 bg-red-600 text-white font-bold py-1 rounded-lg active:brightness-90" onClick={() => { DeleteItem(data.data.itemId); data.getItem()}}>Delete</button>
            <button className="flex-1 bg-green-600 text-white font-bold py-1 rounded-lg">Next</button>
            </div>
        </div>
    )
}