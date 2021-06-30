import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
const CourseDetail = (props) => {
  const [course, setCourse] = useState(null);
  const [learner, setLearner] = useState({ id: 1, name: "Learner",location:0,completion_status:false });
  const [launchURL, setLaunchURL] = useState("");
  const router = useRouter()
  useEffect(() => {
    const ScormAPI = {
      Initialize: () => {
        window.API_1484_11.SetValue("cmi.learner_name", learner.name);
        window.API_1484_11.SetValue("cmi.location",learner.location);
        window.API_1484_11.SetValue("cmi.completion_status",learner.completion_status);
        return true;
    },
      Terminate: () => {
          return true;
      },
      GetValue: (element) => {
        let elementHierarchy = element.split(".");
        if (elementHierarchy.length == 1) {
            return window.API_1484_11[elementHierarchy[0]]
        } else if (elementHierarchy.length == 2) {
            return window.API_1484_11[elementHierarchy[0]][elementHierarchy[1]]
        } else if (elementHierarchy.length == 3) {
            return window.API_1484_11[elementHierarchy[0]][elementHierarchy[1]][elementHierarchy[2]]
        }
      },
      SetValue: (element, val) => {
        let elementHierarchy = element.split(".");
        if (elementHierarchy.length == 1) {
          window.API_1484_11[elementHierarchy[0]] = val;
        } else if (elementHierarchy.length == 2) {
          if (!window.API_1484_11[elementHierarchy[0]]) {
            window.API_1484_11[elementHierarchy[0]] = {};
          }
          window.API_1484_11[elementHierarchy[0]][elementHierarchy[1]] = val;
        } else if (elementHierarchy.length == 3) {
          if (!window.API_1484_11[elementHierarchy[0]]) {
            window.API_1484_11[elementHierarchy[0]] = {};
          }
          if (!window.API_1484_11[elementHierarchy[0]][elementHierarchy[1]]) {
            window.API_1484_11[elementHierarchy[0]][elementHierarchy[1]] = {};
          }
          window.API_1484_11[elementHierarchy[0]][elementHierarchy[1]][
            elementHierarchy[2]
          ] = val;
        }
        let cmiData = window.API_1484_11.cmi;
        if (course != null && learner != null && cmiData != null) {
          const data = {
            userId: learner.id,
            courseId: course.course_id,
            location: cmiData.location,
            status: cmiData.completion_status == "completed" ? 1 : 0,
            score: cmiData.score?.raw ?? 0,
          };
          axios.post("http://localhost:5050/api/progress", data).then((res) => {
            console.log(res.data);
          });
        }
      },
      Commit: () => {
        return true;
      },
      GetLastError: () => {
        return 0;
      },
      GetErrorString: () => {
        return 0;
      },
      GetDiagnostic: () => {
        return 0;
      },
    };
    window.API_1484_11 = ScormAPI;
  }, [course, learner]);
  useEffect(() => {
    axios.get("http://localhost:5050/api/course/" + props.id).then((res) => {
      setCourse(res.data);
    });
    axios.get("http://localhost:5050/api/progress/"+props.id).then((res)=> {
        setLearner({...learner,completion_status:res.data.completion_status,location:res.data.location})
    })
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
      <button onClick={()=>router.push('/')}>back</button>
      {launchURL ? (
        <iframe
          style={{ width: "100vw", height: "80vh" }}
          src={"/content/" + course.name + "/" + launchURL}
        />
      ) : null}
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
