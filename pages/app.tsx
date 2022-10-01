import firebase, { auth, db } from "../src/firebase/clientApp";
import { Layout } from "../src/components/core/layout";
import { WithAuth } from "../src/components/core/with-auth";
import SeriesList from "../src/components/series/series-list";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  setDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import RadioButton from "../src/components/radio-button";
import Button from "../src/components/button";
import Input from "../src/components/input";
import { NextPage } from "next";
import { toast } from "../src/components/toast";

interface itemSeries {
  itemId: string;
  title: string;
  maxEpisode: any;
  currentEpisode: number;
  status?: string;
  dayUpdate?: string;
  isCompleted: boolean;
}
// export async function getStaticProps (){

// }
const App: NextPage = () => {
  const itemDefault: itemSeries = {
    itemId: "",
    title: "",
    maxEpisode: 0,
    currentEpisode: 0,
    dayUpdate: "",
    isCompleted: false,
  };
  //list of series
  const [series, setSeries] = useState<itemSeries[]>([]);
  const [tempSeries, setTempSeries] = useState<itemSeries[]>([]);
  const [title, setTitle] = useState("");
  const [itemPopUp, setItemPopUp] = useState<itemSeries>(itemDefault);
  const [user] = useAuthState(auth);
  const [isLoading, setIsloading] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    getItem();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    function search(val: string) {
      if (val === "") setSeries(tempSeries);
      else {
        const filtered = tempSeries.filter((item) => {
          //console.log(item.title, val, "==>", item.title.includes(val));
          return item.title.toLowerCase().includes(val.toLowerCase());
        });
        setSeries(filtered);
      }
      setTitle(val);
    }
    //call function when something change in state
    search(title);
  }, [tempSeries, title]);

  function compare(a: any, b: any) {
    let A = a.currentEpisode / a.maxEpisode;
    let B = b.currentEpisode / b.maxEpisode;
    if (a.maxEpisode === null) A = 0;
    if (b.maxEpisode === null) B = 0;
    if (A < B) {
      return -1;
    }
    if (A > B) {
      return 1;
    }
    return 0;
  }

  async function getItem() {
    setIsloading(true);
    firebase.auth().onAuthStateChanged(async function (user) {
      if (user) {
        const q = query(
          collection(db, "series"),
          where("uid", "==", user?.uid)
        );
        const getSeries = await getDocs(q);
        let temp = [] as any;
        getSeries.forEach((doc) => {
          let tempData = doc.data();
          tempData["itemId"] = doc.id;
          temp.push(tempData);
        });
        // console.log(tempSeries);
        temp.sort(compare);
        setTempSeries(temp);

        setIsloading(false);
      }
    });
  }

  function setPopUp(data: any) {
    setItemPopUp(data);
  }

  function changePopUp(property: keyof itemSeries, value: any) {
    setItemPopUp((prevState) => {
      let obj: itemSeries = { ...prevState, [property]: value };
      return obj;
    });
  }

  async function addItem() {
    const temp = {
      uid: user?.uid,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      maxEpisode: null,
      currentEpisode: 1,
      dayUpdate: "",
      status: "",
      isCompleted: false,
    };
    if (title == "") {
      toast.notify("This field is required", "danger");
    } else {
      await addDoc(collection(db, "series"), temp).then(async () => {
        await getItem().then(() => {
          toast.notify("Added", "success");
        });
      });
    }
  }

  async function updateItem() {
    const payload = { ...itemPopUp };
    if (payload.maxEpisode === 0 || payload.maxEpisode === null) {
      payload.maxEpisode = null;
    }
    const docRef = doc(db, "series", payload.itemId);
    await setDoc(docRef, payload).then(async () => {
      await getItem().then(() => {
        toast.notify("Updated", "success");
      });
    });
  }

  return (
    <WithAuth>
      <Layout>
        {/* ADD ITEM */}
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 justify-center w-full">
          <div className="flex flex-col space-y-2 lg:w-11/12">
            <Input
              value={title}
              type="text"
              placeholder="Search or add item"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </div>
          <Button
            text="Add"
            className="bg-gray-800"
            onClick={() => {
              addItem();
            }}
          />
        </div>
        <div className="flex flex-col space-y-1 mt-4">
          <p>{title ? "Search: " + title : ""}</p>
          <p>
            Found <span className="font-bold">{series.length}</span> item
          </p>
          <p>
            Complete{" "}
            <span className="font-bold">
              {series.filter((item) => item.isCompleted).length}
            </span>{" "}
            item
          </p>
          <p>
            Not Completed{" "}
            <span className="font-bold">
              {series.filter((item) => !item.isCompleted).length}
            </span>{" "}
            item
          </p>
        </div>
        <div className="flex flex-col space-y-1 mt-4">
          <Button
            text={showCompleted ? "Hide Completed" : "Show Completed"}
            className="bg-green-600"
            onClick={() => {
              setShowCompleted(!showCompleted);
            }}
          />
        </div>
        {/* LIST ITEM */}
        <SeriesList
          data={series}
          getItem={getItem}
          setPopUp={setPopUp}
          isLoading={isLoading}
          showCompleted={showCompleted}
        />
        {/* EDIT POP UP */}
        <div
          className={
            (itemPopUp.itemId ? "flex" : "hidden") +
            " fixed flex top-0 left-0 w-screen h-screen bg-gray-400 bg-opacity-20 z-10 items-center px-2"
          }
        >
          <div className="flex-1 flex flex-col bg-gray-100 shadow-lg lg:mx-96 rounded-lg space-y-4 p-4 max-h-96 lg:max-h-max overflow-y-auto overflow-x-hidden">
            <span className="text-2xl font-bold">
              {itemPopUp ? itemPopUp.title : ""}
            </span>
            <label htmlFor="title" className="font-medium">
              Title
            </label>
            <Input
              value={itemPopUp ? itemPopUp.title : ""}
              type="text"
              placeholder="Type the title"
              onChange={(e) => {
                changePopUp("title", e.target.value);
              }}
            />
            <label htmlFor="" className="font-medium">
              Episode
            </label>
            <div className="flex space-x-3">
              <div className="flex flex-col space-y-2">
                <label htmlFor="current" className="text-sm">
                  Current
                </label>
                <Input
                  className="w-20"
                  value={itemPopUp ? itemPopUp.currentEpisode : ""}
                  type="number"
                  placeholder="Current"
                  id="current"
                  onChange={(e) => {
                    changePopUp("currentEpisode", parseInt(e.target.value));
                  }}
                />
              </div>
              <span className="text-4xl mt-auto mb-1">/</span>
              <div className="flex flex-col space-y-2">
                <label htmlFor="max" className="text-sm">
                  Max
                </label>
                <Input
                  className="w-20"
                  value={itemPopUp ? itemPopUp.maxEpisode : ""}
                  type="number"
                  placeholder="Max"
                  id="max"
                  onChange={(e) => {
                    changePopUp("maxEpisode", parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
            <label htmlFor="" className="font-medium">
              Status
            </label>
            <div className="flex flex-col lg:flex-row justify-start px-1 space-y-3 lg:space-y-0 lg:space-x-4">
              <RadioButton
                day="On-Going"
                name="status"
                className="hover:border-cyan-500 active:text-cyan-400"
                activeClassName="bg-cyan-500 border-cyan-500"
                active={itemPopUp.status}
                onClick={() => {
                  changePopUp("status", "On-Going");
                }}
              />
              <RadioButton
                day="On-Hold"
                name="status"
                className="hover:border-yellow-500 active:text-yellow-400"
                activeClassName="bg-yellow-500 border-yellow-500"
                active={itemPopUp.status}
                onClick={() => {
                  changePopUp("status", "On-Hold");
                }}
              />
              <RadioButton
                day="Finished"
                name="status"
                className="hover:border-green-500 active:text-green-400"
                activeClassName="bg-green-500 border-green-500"
                active={itemPopUp.status}
                onClick={() => {
                  changePopUp("status", "Finished");
                }}
              />
            </div>
            <label
              htmlFor=""
              className={
                (itemPopUp.status === "On-Going" ? "" : "hidden ") +
                "font-medium"
              }
            >
              Day Update
            </label>
            <div
              className={
                (itemPopUp.status === "On-Going" ? "" : "hidden") +
                " flex flex-col lg:flex-row justify-start px-1 space-y-3 lg:space-y-0 lg:space-x-4"
              }
            >
              <RadioButton
                day="Monday"
                name="day"
                className="hover:border-blue-500 active:text-blue-400"
                activeClassName="bg-blue-500 border-blue-500"
                active={itemPopUp.dayUpdate}
                onClick={() => {
                  changePopUp("dayUpdate", "Monday");
                }}
              />
              <RadioButton
                day="Tuesday"
                name="day"
                className="hover:border-blue-500 active:text-blue-400"
                activeClassName="bg-blue-500 border-blue-500"
                active={itemPopUp.dayUpdate}
                onClick={() => {
                  changePopUp("dayUpdate", "Tuesday");
                }}
              />
              <RadioButton
                day="Wednesday"
                name="day"
                className="hover:border-blue-500 active:text-blue-400"
                activeClassName="bg-blue-500 border-blue-500"
                active={itemPopUp.dayUpdate}
                onClick={() => {
                  changePopUp("dayUpdate", "Wednesday");
                }}
              />
              <RadioButton
                day="Thursday"
                name="day"
                className="hover:border-blue-500 active:text-blue-400"
                activeClassName="bg-blue-500 border-blue-500"
                active={itemPopUp.dayUpdate}
                onClick={() => {
                  changePopUp("dayUpdate", "Thursday");
                }}
              />
              <RadioButton
                day="Friday"
                name="day"
                className="hover:border-blue-500 active:text-blue-400"
                activeClassName="bg-blue-500 border-blue-500"
                active={itemPopUp.dayUpdate}
                onClick={() => {
                  changePopUp("dayUpdate", "Friday");
                }}
              />
              <RadioButton
                day="Saturday"
                name="day"
                className="hover:border-blue-500 active:text-blue-400"
                activeClassName="bg-blue-500 border-blue-500"
                active={itemPopUp.dayUpdate}
                onClick={() => {
                  changePopUp("dayUpdate", "Saturday");
                }}
              />
              <RadioButton
                day="Sunday"
                name="day"
                className="hover:border-blue-500 active:text-blue-400"
                activeClassName="bg-blue-500 border-blue-500"
                active={itemPopUp.dayUpdate}
                onClick={() => {
                  changePopUp("dayUpdate", "Sunday");
                }}
              />
            </div>
            <div className="flex space-x-3 justify-end py-4">
              <Button
                text="Close"
                className="bg-red-500"
                onClick={() => {
                  setItemPopUp(itemDefault);
                }}
              />
              <Button
                text="Save"
                className="bg-green-500"
                onClick={() => {
                  updateItem();
                }}
              />
            </div>
          </div>
        </div>
      </Layout>
    </WithAuth>
  );
};

export default App;
