import { NextPage } from "next";
interface Props {
    text: string;
    className?: string;
    onClick?: React.MouseEventHandler;
}
const Button: NextPage<Props> = (Props) =>{
    return  <button className={(Props.className ? Props.className : "") + " px-4 py-2 rounded-lg font-bold text-white hover:brightness-125"}
                    onClick={Props.onClick}>{Props.text}</button>
}

export default Button;