import { NextPage } from "next";
import Image from "next/image";
import SeriesItem from "./series-item";
interface Props {
  data: Array<any>;
  getItem: () => void;
  setPopUp: (data: any) => void;
}

const SeriesList: NextPage<Props> = (Props) => {
  if (Props.data.length == 0) {
    return (
      <div className="flex flex-col justify-center py-20 space-y-16">
        <Image src="/no-data.svg" alt="" width={300} height={300} />
        <span className="text-center font-bold text-3xl text-gray-600">
          Data is empty
        </span>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mt-8 lg:mt-16 gap-4 min-h-full w-full ">
      {Props.data.map((item, idx) => {
        return (
          <SeriesItem
            key={idx}
            data={item}
            getItem={Props.getItem}
            setItemPopUp={Props.setPopUp}
          />
        );
      })}
    </div>
  );
};
export default SeriesList;
