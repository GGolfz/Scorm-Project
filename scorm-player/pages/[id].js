import axios from "axios";
import { useEffect, useState } from "react";

const CourseDetail = (props) => {
  const [course, setCourse] = useState(null);
  const [learner, setLearner] = useState({ id: 1, name: "Learner 1" });
  const [launchURL, setLaunchURL] = useState("");
  useEffect(() => {
    axios.get("http://localhost:5050/api/course/" + props.id).then((res) => {
      setCourse(res.data);
    });
  }, [props.id]);
  useEffect(() => {
    if (course?.name)
      axios
        .get(
          "http://localhost:5050/content/" + course.name + "/imsmanifest.xml"
        )
        .then((res) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(res.data, "text/xml");
          let launchURL = xmlDoc
            .getElementsByTagName("resource")[0]
            .getAttribute("href");
          setLaunchURL(launchURL);
        });
  }, [course]);
  return (
    <div>
      <h1>{course?.name}</h1>
      <h2>Hi {learner?.name}</h2>
      {
          launchURL ? (
            <iframe src={"http://localhost:5050/content/"+course.name+'/'+launchURL}/>
          ): null
      }
    </div>
  );
};

export async function getServerSideProps(ctx) {
  try {
    const id = ctx.query.id;
    return { props: { id } };
  } catch (err) {
    return { props: { id: "" } };
  }
}

export default CourseDetail;
