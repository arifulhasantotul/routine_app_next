import styles from "@/styles/RoutineOutputForm.module.css";
import { getDataFromStorage } from "@/utils/temporarySave";
import {
  differenceBetweenTwoTime,
  militaryTimeToStandardTime,
  next30Minutes,
} from "@/utils/timeConversion";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const RoutineOutputForm = () => {
  const router = useRouter();
  const initialData = {
    name: "",
    target: "",
    wakingUpTime: "",
    sleepingTime: "",
    moreActive: "",
  };
  const [formData, setFormData] = useState(initialData);
  const [hardSubjects, setHardSubjects] = useState([]);
  const [easySubjects, setEasySubjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [finalRoutine, setFinalRoutine] = useState([]);

  // sorting time in ascending order
  activities.sort((a, b) => {
    let timeA = a?.activityStartTime || a?.mainActivityStartTime;
    let timeB = b?.activityStartTime || b?.mainActivityStartTime;
    return timeA.localeCompare(timeB);
  });

  // console.log(formData);
  // console.log("sort", activities);

  const generateRoutineData = () => {
    const routineArr = [];
    const { wakingUpTime, sleepingTime } = formData;
    const firstActivityTime =
      activities[0]?.activityStartTime || activities[0]?.mainActivityStartTime;
    let subIdx = 0;

    let firstActivityTimeDiff = differenceBetweenTwoTime(
      wakingUpTime,
      firstActivityTime
    );
    let firstCount = 29;
    while (
      firstActivityTimeDiff / firstCount > 1 &&
      subIdx < allSubjects.length
    ) {
      routineArr.push({
        topicName: allSubjects[subIdx],
        topicStartTime: militaryTimeToStandardTime(wakingUpTime),
        topicEndTime: militaryTimeToStandardTime(firstActivityTime),
      });
      subIdx++;
      firstCount += 30;
    }

    for (let i = 0; i < activities.length; i++) {
      // console.log("allSubjects", activities[i]);
      let startTime =
        activities[i]?.activityEndTime || activities[i]?.mainActivityEndTime;
      let endTime =
        activities[i + 1]?.activityStartTime ||
        activities[i + 1]?.mainActivityStartTime;

      let timeDiff = differenceBetweenTwoTime(startTime, endTime);
      let middleCount = 29;
      let newStartTime = startTime;
      while (timeDiff / middleCount > 1 && subIdx < allSubjects.length) {
        routineArr.push({
          topicName: allSubjects[subIdx],
          topicStartTime: militaryTimeToStandardTime(newStartTime),
          topicEndTime: militaryTimeToStandardTime(next30Minutes(newStartTime)),
        });
        subIdx++;
        newStartTime = next30Minutes(newStartTime);
        middleCount += 30;
      }
    }

    const lastActivityTime =
      activities[activities.length - 1]?.activityEndTime ||
      activities[activities.length - 1]?.mainActivityEndTime;
    // console.log("lust", lastActivityTime);
    let lastActivityTimeDiff = differenceBetweenTwoTime(
      sleepingTime,
      lastActivityTime
    );

    console.log("lastActivityTimeDiff", lastActivityTimeDiff);
    let lastCount = 29;
    let lastStartTime = lastActivityTime;
    while (
      lastActivityTimeDiff / lastCount > 1 &&
      subIdx < allSubjects.length
    ) {
      routineArr.push({
        topicName: allSubjects[subIdx],
        topicStartTime: militaryTimeToStandardTime(lastStartTime),
        topicEndTime: militaryTimeToStandardTime(next30Minutes(lastStartTime)),
      });
      subIdx++;
      lastStartTime = next30Minutes(lastStartTime);
      lastCount += 30;
    }

    console.log("routineArr", routineArr);
  };

  console.log(allSubjects);

  useEffect(() => {
    generateRoutineData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activities]);

  useEffect(() => {
    const basicData = getDataFromStorage(localStorage, "routineInfo");
    if (basicData) {
      setFormData({
        name: basicData?.name || "",
        target: basicData?.target || "",
        sleepingTime: basicData?.sleepingTime || "",
        wakingUpTime: basicData?.wakingUpTime || "",
        moreActive: basicData?.moreActive || "",
      });

      if (basicData?.moreActive === "day") {
        setAllSubjects([
          ...basicData?.hardSubjects,
          ...basicData?.easySubjects,
        ]);
      } else {
        setAllSubjects([
          ...basicData?.easySubjects,
          ...basicData?.hardSubjects,
        ]);
      }

      setActivities(basicData?.activities || []);
      setHardSubjects(basicData?.hardSubjects || []);
      setEasySubjects(basicData?.easySubjects || []);
    }
  }, []);
  return (
    <>
      <div className={styles.form_wrapper}>
        <h2>Prep Stone Routine Maker</h2>
        <div className={styles.form}>
          <div className={styles.list_activity_item}>
            <strong> Waking Up Time:</strong>{" "}
            {militaryTimeToStandardTime(formData?.wakingUpTime)}
          </div>
          <div className={styles.list_activity_item}>
            <strong>Sleeping Time: </strong>{" "}
            {militaryTimeToStandardTime(formData?.sleepingTime)}
          </div>
          {activities.length > 0 && (
            <ul className={styles.list_activity}>
              <h4 className={styles.activity_heading}>Activities</h4>
              {activities.map((item, idx) => (
                <span className={styles.list_activity_item} key={idx}>
                  <li>
                    <strong>
                      {idx + 1}. {item?.activityName || item?.mainActivityName}{" "}
                      time:
                    </strong>{" "}
                    From{" "}
                    {militaryTimeToStandardTime(
                      item?.activityStartTime || item?.mainActivityStartTime
                    )}{" "}
                    to{" "}
                    {militaryTimeToStandardTime(
                      item?.activityEndTime || item?.mainActivityEndTime
                    )}{" "}
                  </li>
                  {/* <span
                    className={styles.dlt_icon}
                    title="Remove activity from list"
                  >
                    <MdClose
                      onClick={() =>
                        deleteActivity(
                          item?.activityName || item?.mainActivityName
                        )
                      }
                    />
                  </span> */}
                </span>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default RoutineOutputForm;
