import { NextPage } from "next";
interface Props {
    day: string;
    active?: string;
    activeClassName: string;
    className: string;
    name: string;
    onClick?: React.MouseEventHandler;
}
const RadioButton: NextPage<Props> = (Props) =>{
    return  <div className={(Props.active == Props.day ? Props.activeClassName+" text-white" : "bg-white")+" flex px-4 py-2 rounded-lg font-medium shadow-lg hover:cursor-pointer border-2 "+ Props.className}
                onClick={Props.onClick}>
                <input className="my-auto scale-125 hidden" type="radio" name={Props.name} id={Props.day} />
                <label className="text-base hover:cursor-pointer" htmlFor={Props.day}>{Props.day}</label>
            </div>
}

export default RadioButton;