import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import {db} from '../firebase/clientApp'
import Button from "./button"

type items = {
    itemId: string,
    title: string,
    maxEpisode: number,
    currentEpisode: number,
    dayUpdate?: string,
    status?: string,
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
            <div className="flex flex-col col-span-1 p-4 shadow-md rounded-lg space-y-3">
                <span className="w-20 h-20 rounded-full bg-gray-200"></span>
                <span className="font-bold text-xl">{data.data.title}</span>
                <span className="font-medium text-lg mt-auto">Episode: {data.data.currentEpisode}/{data.data.maxEpisode}</span>
                <span className="font-bold text-lg mt-auto text-green-500">{data.data.status}</span>
                <span className={(data.data.dayUpdate != "" ? "" : "hidden ") + "text-lg"}>Next episode release on <span className="font-bold">{data.data.dayUpdate}</span></span>
                <div className="flex w-full space-x-2 h-full">
                    <Button text="Delete" 
                            className="bg-red-600 flex-1 mt-auto" 
                            onClick={() => { DeleteItem(data.data.itemId) }}/>
                    <Button text="Edit" 
                            className="bg-yellow-500 flex-1 mt-auto" 
                            onClick={() => { EditItem() }}/>
                    <Button text={(data.data.currentEpisode == data.data.maxEpisode) ? "Complete" : "Next"}
                            className="bg-green-600 flex-1 mt-auto" 
                            onClick={() => { UpdateEpisode(data.data.itemId, data.data.currentEpisode, data.data.maxEpisode) }}
                            disabled={data.data.isCompleted}/>
                </div>
            </div>
            
        </>
    )
}