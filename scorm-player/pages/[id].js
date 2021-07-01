import axios from "axios";
import { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
const CourseDetail = (props) => {
  const [course, setCourse] = useState(null);
  const [learner, setLearner] = useState({
    id: 1,
    name: "Learner",
    location: 0,
    completion_status: false,
  });
  const [launchURL, setLaunchURL] = useState("");
  const router = useRouter();
  useEffect(() => {
    const Scorm2004API = {
      Initialize: () => {
        window.API_1484_11.SetValue("cmi.learner_id", learner.id);
        window.API_1484_11.SetValue("cmi.learner_name", learner.name);
        window.API_1484_11.SetValue("cmi.location", learner.location);
        window.API_1484_11.SetValue(
          "cmi.completion_status",
          learner.completion_status
        );
        return true;
      },
      Terminate: () => {
        return true;
      },
      GetValue: (element) => {
        let elementHierarchy = element.split(".");
        if (elementHierarchy.length == 1) {
          return window.API_1484_11[elementHierarchy[0]];
        } else if (elementHierarchy.length == 2) {
          return window.API_1484_11[elementHierarchy[0]][elementHierarchy[1]];
        } else if (elementHierarchy.length == 3) {
          return window.API_1484_11[elementHierarchy[0]][elementHierarchy[1]][
            elementHierarchy[2]
          ];
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
        if (
          element.includes("location") ||
          element.includes("status") ||
          element.includes("score")
        ) {
          let cmiData = window.API_1484_11.cmi;
          if (course != null && learner != null && cmiData != null) {
            const data = {
              userId: learner.id,
              courseId: course.course_id,
              location: cmiData.location,
              status: cmiData.completion_status == "completed" ? 1 : 0,
              score: cmiData.score?.raw ?? 0,
            };
            axios
              .post("http://localhost:5050/api/progress", data)
              .then((res) => {});
          }
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
    window.API_1484_11 = Scorm2004API;
    const ScormAPI = {
      LMSInitialize: () => {
        window.API.LMSSetValue("cmi.core.student_id", learner.id);
        window.API.LMSSetValue("cmi.core.student_name", learner.name);
        window.API.LMSSetValue("cmi.core.lesson_location", learner.location);
        window.API.LMSSetValue(
          "cmi.core.lesson_status",
          learner.completion_status
        );
        return true;
      },
      LMSFinish: () => {
        return true;
      },
      LMSGetValue: (element) => {
        let elementHierarchy = element.split(".");
        if (elementHierarchy.length == 1) {
          return window.API[elementHierarchy[0]];
        } else if (elementHierarchy.length == 2) {
          return window.API[elementHierarchy[0]][elementHierarchy[1]];
        } else if (elementHierarchy.length == 3) {
          return window.API[elementHierarchy[0]][elementHierarchy[1]][
            elementHierarchy[2]
          ];
        } else if (elementHierarchy.length == 4) {
          return window.API[elementHierarchy[0]][elementHierarchy[1]][
            elementHierarchy[2]
          ][elementHierarchy[3]];
        }
      },
      LMSSetValue: (element, val) => {
        console.log(element,val)
        let elementHierarchy = element.split(".");
        if (elementHierarchy.length == 1) {
          window.API[elementHierarchy[0]] = val;
        } else if (elementHierarchy.length == 2) {
          if (!window.API[elementHierarchy[0]]) {
            window.API[elementHierarchy[0]] = {};
          }
          window.API[elementHierarchy[0]][elementHierarchy[1]] = val;
        } else if (elementHierarchy.length == 3) {
          if (!window.API[elementHierarchy[0]]) {
            window.API[elementHierarchy[0]] = {};
          }
          if (!window.API[elementHierarchy[0]][elementHierarchy[1]]) {
            window.API[elementHierarchy[0]][elementHierarchy[1]] = {};
          }
          window.API[elementHierarchy[0]][elementHierarchy[1]][
            elementHierarchy[2]
          ] = val;
        } else if (elementHierarchy.length == 4) {
          if (!window.API[elementHierarchy[0]]) {
            window.API[elementHierarchy[0]] = {};
          }
          if (!window.API[elementHierarchy[0]][elementHierarchy[1]]) {
            window.API[elementHierarchy[0]][elementHierarchy[1]] = {};
          }
          if (
            !window.API[elementHierarchy[0]][elementHierarchy[1]][
              elementHierarchy[2]
            ]
          ) {
            window.API[elementHierarchy[0]][elementHierarchy[1]][
              elementHierarchy[2]
            ] = {};
          }
          window.API[elementHierarchy[0]][elementHierarchy[1]][
            elementHierarchy[2]
          ][elementHierarchy[3]] = val;
        }
        let coreData = window.API.cmi.core;
        if (
          element.includes("location") ||
          element.includes("status") ||
          element.includes("score")
        ) {
          if (course != null && learner != null && coreData != null) {
            const data = {
              userId: learner.id,
              courseId: course.course_id,
              location: coreData.lesson_location,
              status: coreData.lesson_status == "passed" ? 1 : 0,
              score: coreData.score?.raw ?? 0,
            };
            axios
              .post("http://localhost:5050/api/progress", data)
              .then((res) => {});
          }
        }
      },
      LMSCommit: () => {
        return true;
      },
      LMSGetLastError: () => {
        return 0;
      },
      LMSGetErrorString: () => {
        return 0;
      },
      LMSGetDiagnostic: () => {
        return 0;
      },
    };
    window.API = ScormAPI;
  }, [course, learner]);
  useEffect(() => {
    axios.get("http://localhost:5050/api/course/" + props.id).then((res) => {
      setCourse(res.data);
    });
    axios.get("http://localhost:5050/api/progress/" + props.id).then((res) => {
      setLearner((l) => ({
        id: l.id,
        name: l.name,
        completion_status: res.data.completion_status,
        location: res.data.location,
      }));
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
      <button onClick={() => router.push("/")}>back</button>
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
