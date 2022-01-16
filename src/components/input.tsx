import { NextPage } from "next";
interface Props {
    value: string|number;
    type: string;
    placeholder: string;
    className?: string;
    id? : string;
    onChange?: (e:any) => void;
}
const Input: NextPage<Props> = (Props) =>{
    return  <input  className={(Props.className ? Props.className : "") + " shadow-lg px-4 py-2 rounded-md border-none"}
                    type={Props.type}
                    placeholder={Props.placeholder}
                    onChange={Props.onChange}
                    id={Props.id}
                    value={Props.value}/>
}

export default Input;