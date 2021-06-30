import axios from 'axios'
import { useEffect, useState } from 'react';
const Home = () => {
  const [course,setCourse] = useState([])
  useEffect(()=>{
    axios.get("http://localhost:5050/api/course").then(res=>{setCourse(res.data)})
  },[])
  return (
    <div>
      <h1>Here are course lists: </h1>
      <ol>
        {
          course.map(c=>(
            <a key={c.course_id} href={"/"+c.course_id}><li >{c.name}</li></a>
          ))
        }
      </ol>
    </div>
  )
}
export default Home;