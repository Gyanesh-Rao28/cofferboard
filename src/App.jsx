import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {

  const [data, setData] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`https://coffer-api.vercel.app/api/v1/getAnalytic`);

        if (res.data) {
          setData(res.data);
        }
      } catch (error) {
        console.log("Data fetching error", error);
      }
    }

    fetchData();
  }, []);
  // console.log(`${process.env.REACT_APP_COFFER_API_URL}/api/v1/getAnalytic`)
  console.log(data);
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello world!
      </h1>
    </>
  )
}

export default App
