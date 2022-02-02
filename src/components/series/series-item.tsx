import { doc, deleteDoc, updateDoc } from "firebase/firestore"
import { useState } from "react"
import {db} from '../../firebase/clientApp'
import Button from "../button"
import {toast} from "../toast";

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
    const [isLoadingNext, setIsLoadingNext] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    async function DeleteItem(itemId:string){
        setIsLoadingDelete(true);
        await deleteDoc(doc(db, "series", itemId)).then(() => {
            data.getItem()
            toast.notify("Deleted", "danger")
            setIsLoadingDelete(false);
        })
    }
    async function EditItem(){
        data.setItemPopUp(data.data)
    }
    async function UpdateEpisode(itemId: string, title: string, currentEpisode: number, maxEpisode: number){
        setIsLoadingNext(true);
        if (currentEpisode == maxEpisode){
            await updateDoc(doc(db, "series", itemId), {
                isCompleted: true
            }).then(() => {
                data.getItem()
                toast.notify("Saved", "success")
            })
        } else {
            await updateDoc(doc(db, "series", itemId), {
                currentEpisode: currentEpisode + 1
            }).then(() => {
                data.getItem()
                toast.notify("Saved", "success")
            })
        }
        setIsLoadingNext(false);
    }

    return (
        <>
            <div className="flex flex-col col-span-1 p-4 shadow-md rounded-lg space-y-3 max-h-min">
                <div className="relative w-full h-4 rounded-full bg-gray-200">
                    <div className="h-full bg-green-400 rounded-full" style={{width:((data.data.currentEpisode/data.data.maxEpisode)*100)+"%"}}></div>
                </div>
                <span className="font-bold text-xl">{data.data.title}</span>
                <span className="text-lg mt-auto">Episode: <span className="font-bold">{data.data.currentEpisode}</span> / {data.data.maxEpisode}</span>
                <span className={(data.data.status ? "" : "hidden ")+"text-lg mt-auto"}>Airing Status: <span className="font-bold text-green-600">{data.data.status}</span></span>
                <span className={((data.data.dayUpdate != "") && (data.data.status === "On-Going") ? "" : "hidden ") + "text-lg"}>Next episode release on <span className="font-bold">{data.data.dayUpdate}</span></span>
                <div className="flex w-full space-x-2 grow">
                    <Button text="Delete"
                            className="bg-red-600 flex-1 mt-auto"
                            onClick={() => { DeleteItem(data.data.itemId) }}
                            disabled={isLoadingDelete}
                            isLoading={isLoadingDelete}/>
                    <Button text="Edit"
                            className="bg-yellow-500 flex-1 mt-auto"
                            onClick={() => { EditItem() }}/>
                    <Button text={(data.data.currentEpisode == data.data.maxEpisode) ? "Complete" : "Next"}
                            className="bg-green-600 flex-1 mt-auto"
                            onClick={() => { UpdateEpisode(data.data.itemId, data.data.title, data.data.currentEpisode, data.data.maxEpisode) }}
                            disabled={data.data.isCompleted || isLoadingNext}
                            isLoading={isLoadingNext}/>
                </div>
            </div>
        </>
    )
}