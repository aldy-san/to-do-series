import { NextPage } from "next";
interface Props {
    day: string;
    active: string;
    onClick?: React.MouseEventHandler;
}
const RadioButton: NextPage<Props> = (Props) =>{
    return  <div className={(Props.active == Props.day ? "bg-blue-500 text-white border-blue-500" : "bg-white")+" flex px-4 py-2 rounded-lg font-medium shadow-lg hover:cursor-pointer border-2 hover:border-blue-500 active:text-blue-400"}
                onClick={Props.onClick}>
                <input className="my-auto scale-125 hidden" type="radio" name="day" id={Props.day} />
                <label className="text-base hover:cursor-pointer" htmlFor={Props.day}>{Props.day}</label>
            </div>
}

export default RadioButton;