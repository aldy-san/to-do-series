import { NextPage } from "next";
interface Props {
    text: string;
    className?: string;
    disabled?: boolean;
    onClick?: React.MouseEventHandler;
}
const Button: NextPage<Props> = (Props) =>{
    return  <button className={(Props.className ? Props.className : "") + " px-4 py-2 rounded-lg font-bold text-white hover:brightness-125 active:scale-95 transition-transform duration-100"}
                    onClick={Props.onClick}
                    disabled={Props.disabled}>{Props.text}</button>
}

export default Button;