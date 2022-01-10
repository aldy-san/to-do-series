
export default function Header(data:any) {
    // console.log("header", data);
    
    return(
        <header className="flex items-center text-center my-4">
            <h1 className="mx-auto text-xl font-medium">{data.data ? "Hello "+data.data.displayName : "To do Series"}</h1>
        </header>
    )
}
