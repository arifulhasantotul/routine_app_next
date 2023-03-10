import styles from "@/styles/RoutineOutputForm.module.css";
import { getDataFromStorage } from "@/utils/temporarySave";
import {
  differenceBetweenTwoTime,
  militaryTimeToStandardTime,
  next30Minutes,
} from "@/utils/timeConversion";
import Link from "next/link";
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
  const [activities, setActivities] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [finalRoutine, setFinalRoutine] = useState([]);

  // sorting time in ascending order
  activities.sort((a, b) => {
    let timeA = a?.activityStartTime || a?.mainActivityStartTime;
    let timeB = b?.activityStartTime || b?.mainActivityStartTime;
    return timeA.localeCompare(timeB);
  });

  finalRoutine.sort((a, b) => {
    return a.topicStartTime.localeCompare(b.topicStartTime);
  });

  const firstPartOfRoutine = (subIdx) => {
    const firstPartData = [];
    const { wakingUpTime } = formData;
    const firstActivityTime =
      activities[0]?.activityStartTime || activities[0]?.mainActivityStartTime;

    let firstActivityTimeDiff = differenceBetweenTwoTime(
      wakingUpTime,
      firstActivityTime
    );
    let firstCount = 29;
    while (
      firstActivityTimeDiff / firstCount > 1 &&
      subIdx < allSubjects.length
    ) {
      firstPartData.push({
        topicName: allSubjects[subIdx],
        topicStartTime: wakingUpTime,
        topicEndTime: firstActivityTime,
      });
      subIdx++;
      firstCount += 30;
    }
    return { firstPartData, firsPartIdx: subIdx };
  };

  const lastPartOfRoutine = (subIdx) => {
    const lastPartOfData = [];
    const { sleepingTime, moreActive } = formData;
    let lastActivityTime;
    if (moreActive === "day") {
      lastActivityTime =
        activities[activities.length - 1]?.activityEndTime ||
        activities[activities.length - 1]?.mainActivityEndTime;
    } else {
      for (let i = 0; i < activities.length; i++) {
        let actTime =
          activities[i]?.activityEndTime || activities[i]?.mainActivityEndTime;
        if (actTime > "19:00") {
          lastActivityTime = actTime;
          break;
        }
      }
    }

    let totalTimeDiff;
    if (lastActivityTime > sleepingTime) {
      let firstDiff = differenceBetweenTwoTime(lastActivityTime, "23:59");
      let secondDiff = differenceBetweenTwoTime("00:00", sleepingTime);
      totalTimeDiff = firstDiff + secondDiff;
    } else {
      totalTimeDiff = differenceBetweenTwoTime(lastActivityTime, sleepingTime);
    }

    let lastCount = 29;
    let lastStartTime = lastActivityTime;

    while (totalTimeDiff / lastCount > 1 && subIdx < allSubjects.length) {
      lastPartOfData.push({
        topicName: allSubjects[subIdx],
        topicStartTime: lastStartTime,
        topicEndTime: next30Minutes(lastStartTime),
      });
      subIdx++;
      lastStartTime = next30Minutes(lastStartTime);
      lastCount += 30;
    }
    return { lastPartOfData, lastPartIdx: subIdx };
  };

  const generateRoutineData = () => {
    const routineArr = [];
    const { moreActive } = formData;
    let subIdx = 0;

    if (moreActive === "day") {
      const { firstPartData, firsPartIdx } = firstPartOfRoutine(subIdx);
      routineArr.push(...firstPartData);
      subIdx = firsPartIdx;
    } else {
      const { lastPartOfData, lastPartIdx } = lastPartOfRoutine(subIdx);
      routineArr.push(...lastPartOfData);
      subIdx = lastPartIdx;
    }

    for (let i = 0; i < activities.length; i++) {
      routineArr.push({
        topicName: activities[i].activityName || activities[i].mainActivityName,
        topicStartTime:
          activities[i]?.activityStartTime ||
          activities[i]?.mainActivityStartTime,
        topicEndTime:
          activities[i]?.activityEndTime || activities[i]?.mainActivityEndTime,
      });
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
          topicStartTime: newStartTime,
          topicEndTime: next30Minutes(newStartTime),
        });
        subIdx++;
        newStartTime = next30Minutes(newStartTime);
        middleCount += 30;
      }
    }

    if (moreActive !== "day") {
      const { firstPartData, firsPartIdx } = firstPartOfRoutine(subIdx);
      routineArr.push(...firstPartData);
      subIdx = firsPartIdx;
    } else {
      const { lastPartOfData, lastPartIdx } = lastPartOfRoutine(subIdx);
      routineArr.push(...lastPartOfData);
      subIdx = lastPartIdx;
    }

    setFinalRoutine(routineArr);
  };

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

      setAllSubjects([...basicData?.hardSubjects, ...basicData?.easySubjects]);
      setActivities(basicData?.activities || []);
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
          <div className={styles.list_activity_item}>
            <strong>Active Time: </strong> {formData?.moreActive}
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
                </span>
              ))}
            </ul>
          )}
          {finalRoutine.length > 0 && (
            <ul className={styles.list_activity}>
              <h4 className={styles.activity_heading}>Routine</h4>
              {finalRoutine.map((item, idx) => (
                <span className={styles.list_activity_item} key={idx}>
                  <li>
                    <strong>
                      {idx + 1}. {item?.topicName}:
                    </strong>{" "}
                    From {militaryTimeToStandardTime(item?.topicStartTime)} to{" "}
                    {militaryTimeToStandardTime(item?.topicEndTime)}{" "}
                  </li>
                </span>
              ))}
            </ul>
          )}
        </div>
        <Link href="/routine">Back</Link>
      </div>
    </>
  );
};

export default RoutineOutputForm;
