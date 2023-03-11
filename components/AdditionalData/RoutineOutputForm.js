import styles from "@/styles/RoutineOutputForm.module.css";
import { getDataFromStorage } from "@/utils/temporarySave";
import {
  differenceBetweenTwoTime,
  militaryTimeToStandardTime,
  next30Minutes,
} from "@/utils/timeConversion";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
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

    lastActivityTime =
      activities[activities.length - 1]?.activityEndTime ||
      activities[activities.length - 1]?.mainActivityEndTime;

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
        // moreActive: "night",
      });

      setAllSubjects([...basicData?.hardSubjects, ...basicData?.easySubjects]);
      setActivities(basicData?.activities || []);
    }
  }, []);
  return (
    <>
      <div className={styles.form_wrapper}>
        <h2>Prep Stone Routine Maker</h2>
        <div className={styles.upper_div}>
          <div className={styles.left}>Name: {formData?.name}</div>
          <div className={styles.right}>Target: {formData?.target}</div>
        </div>
        <div className={styles.form}>
          <h3 className={styles.form_head}>
            {" "}
            <u> QNA Publication</u>
          </h3>
          {finalRoutine.length > 0 ? (
            <TableContainer>
              <Table sx={{ maxWidth: 500 }} className={styles.form}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "15px",
                        color: "#6a63a9",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                      }}
                      align="center"
                    >
                      Topic
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "15px",
                        color: "#6a63a9",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                      }}
                      align="center"
                    >
                      Start Time
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "bold",
                        fontSize: "15px",
                        color: "#6a63a9",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                      }}
                      align="center"
                    >
                      End Time
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    className={
                      finalRoutine.length % 2 === 0
                        ? styles.list_activity_item
                        : ""
                    }
                  >
                    <TableCell align="center">Wake Up</TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center">
                      {militaryTimeToStandardTime(formData?.wakingUpTime)}
                    </TableCell>
                  </TableRow>
                  {finalRoutine.map((item, idx) => (
                    <TableRow
                      key={idx}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      className={idx % 2 === 1 ? styles.list_activity_item : ""}
                    >
                      <TableCell align="center">{item.topicName}</TableCell>
                      <TableCell align="center">
                        {militaryTimeToStandardTime(item?.topicStartTime)}
                      </TableCell>
                      <TableCell align="center">
                        {militaryTimeToStandardTime(item?.topicEndTime)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    className={
                      finalRoutine.length % 2 === 1
                        ? styles.list_activity_item
                        : ""
                    }
                  >
                    <TableCell align="center">Sleep</TableCell>
                    <TableCell align="center">
                      {militaryTimeToStandardTime(formData?.sleepingTime)}
                    </TableCell>
                    <TableCell align="center">
                      {militaryTimeToStandardTime(formData?.wakingUpTime)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          ) : null}
        </div>

        <Link href="/routine">Back</Link>
      </div>
    </>
  );
};

export default RoutineOutputForm;
