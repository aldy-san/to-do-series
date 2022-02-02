import { NextPage } from "next";
interface Props {
    text: string;
    className?: string;
    disabled?: boolean;
    onClick: React.MouseEventHandler;
    isLoading?: boolean;
}
const Button: NextPage<Props> = (Props) =>{
    return  <button className={(Props.className ? Props.className : "") + (!Props.disabled ? " hover:brightness-125 active:scale-95" : " hover:cursor-not-allowed") + " flex justify-center px-4 py-2 rounded-lg font-bold text-white transition-transform duration-100"}
                    onClick={Props.onClick}
                    disabled={Props.disabled}>
                <div className={(Props.isLoading ? "block" : "hidden")+" animate-pulse h-4 w-4 bg-white rounded-full my-1"}></div>
                <span className={(!Props.isLoading ? "block my-auto" : "hidden")}>{!Props.isLoading ? Props.text : ""}</span>
            </button>
}

export default Button;