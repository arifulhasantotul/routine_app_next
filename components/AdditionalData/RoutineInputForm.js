import styles from "@/styles/RoutineInputForm.module.css";
import { getDataFromStorage } from "@/utils/temporarySave";
import { militaryTimeToStandard } from "@/utils/timeConversion";
import { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { checkValidation } from "./validation";

const RoutineInputForm = () => {
  const initialData = {
    name: "",
    target: "",
    wakingUpTime: "",
    sleepingTime: "",
    moreActive: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [errFormData, setErrFormData] = useState(initialData);
  const [hardSubjects, setHardSubjects] = useState([]);
  const [easySubjects, setEasySubjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const mainActivityOptions = ["Coaching", "Private", "College", "Batch"];
  const [mainActivity, setMainActivity] = useState({
    mainActivityName: "",
    mainActivityStartTime: "",
    mainActivityEndTime: "",
  });
  const [newActivity, setNewActivity] = useState({
    activityName: "",
    activityStartTime: "",
    activityEndTime: "",
  });

  const [newHardSubject, setNewHardSubject] = useState("");
  const [newEasySubject, setNewEasySubject] = useState("");

  const handleSubChange = (e) => {
    const { name, value } = e.target;
    if (!value) return;
    if (name === "hardSubject") {
      setNewHardSubject(value.trim());
    } else {
      setNewEasySubject(value.trim());
    }
  };
  // console.log("new hard", newHardSubject);
  // console.log("new easy", newEasySubject);
  // console.log("hardSubjects", hardSubjects);
  // console.log("easySubjects", easySubjects);
  // console.log("formData", formData);

  const handleAddSubject = (e, isHard = false) => {
    e.preventDefault();
    if (isHard) {
      setHardSubjects((prv) => [...prv, newHardSubject]);
      setNewHardSubject("");
    } else {
      setEasySubjects((prv) => [...prv, newEasySubject]);
      setNewEasySubject("");
    }
  };

  const handleDeleteSubject = (value, isHard = false) => {
    if (isHard) {
      const newSubjects = hardSubjects.filter((item) => item !== value);
      setHardSubjects(newSubjects);
    } else {
      const newSubjects = easySubjects.filter((item) => item !== value);
      setEasySubjects(newSubjects);
    }
  };

  const handleChangeActivity = (e) => {
    const { name, value } = e.target;
    if (name && name.startsWith("mainActivity")) {
      setMainActivity((prv) => ({
        ...prv,
        [name]: value,
      }));
    } else {
      setNewActivity((prv) => ({
        ...prv,
        [name]: value,
      }));
    }
  };

  const clearActivity = (isMainActivity = false) => {
    if (isMainActivity) {
      setMainActivity({
        mainActivityName: "",
        mainActivityStartTime: "",
        mainActivityEndTime: "",
      });
    } else {
      setNewActivity({
        activityName: "",
        activityStartTime: "",
        activityEndTime: "",
      });
    }
    document.getElementById(
      isMainActivity ? "mainActivityName" : "activityName"
    ).value = "";
    document.getElementById(
      isMainActivity ? "mainActivityStartTime" : "activityStartTime"
    ).value = "";
    document.getElementById(
      isMainActivity ? "mainActivityEndTime" : "activityEndTime"
    ).value = "";
  };

  const addActivity = (isMainActivity = false) => {
    if (isMainActivity) {
      if (
        !mainActivity.mainActivityName ||
        !mainActivity.mainActivityStartTime ||
        !mainActivity.mainActivityEndTime
      )
        return;

      const exists = activities.find(
        (item) => item.activityName === mainActivity.mainActivityName
      );
      if (exists) {
        alert("Activity already exists");
        return;
      }
      setActivities((prv) => [...prv, mainActivity]);
      clearActivity(true);
    } else {
      if (
        !newActivity?.activityName ||
        !newActivity?.activityStartTime ||
        !newActivity?.activityEndTime
      )
        return;

      const exists = activities.find(
        (item) => item.activityName === newActivity.activityName
      );
      if (exists) {
        alert("Activity already exists");
        return;
      }
      setActivities((prv) => [...prv, newActivity]);
      clearActivity();
    }
  };

  const deleteActivity = (value) => {
    const newActivities = activities.filter(
      (item) => item.activityName !== value
    );
    setActivities(newActivities);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prv) => ({
      ...prv,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const basicData = getDataFromStorage(localStorage, "routineAccount");
    if (basicData) {
      setFormData((prv) => ({
        ...prv,
        name: basicData?.name,
      }));
    }
  }, []);
  return (
    <>
      <div className={styles.form_wrapper}>
        <h2>Additional Data</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className={styles.input}
              value={formData?.name}
              placeholder="e.g. MD ARIFUL HASAN"
              onChange={handleChange}
              onBlur={(e) => checkValidation(e, setErrFormData)}
              disabled
              required
            />
          </div>
          {errFormData.name && (
            <div className={styles.error}> &#9888; {errFormData.name}</div>
          )}

          <div className={styles.form_group}>
            <label htmlFor="target">Target</label>
            <input
              type="text"
              name="target"
              id="target"
              className={styles.input}
              value={formData?.target}
              onChange={handleChange}
              onBlur={(e) => checkValidation(e, setErrFormData)}
              required
            />
          </div>
          {errFormData.wakingUpTime && (
            <div className={styles.error}>
              {" "}
              &#9888; {errFormData.wakingUpTime}
            </div>
          )}

          <div className={styles.form_group}>
            <label htmlFor="wakingUpTime">Waking Up Time</label>
            <input
              type="time"
              name="wakingUpTime"
              id="wakingUpTime"
              className={styles.input}
              value={formData?.wakingUpTime}
              onChange={handleChange}
              onBlur={(e) => checkValidation(e, setErrFormData)}
              required
            />
          </div>
          {errFormData.wakingUpTime && (
            <div className={styles.error}>
              {" "}
              &#9888; {errFormData.wakingUpTime}
            </div>
          )}

          <div className={styles.form_group}>
            <label htmlFor="sleepingTime">Sleeping Time</label>
            <input
              type="time"
              name="sleepingTime"
              id="sleepingTime"
              className={styles.input}
              value={formData?.sleepingTime}
              onChange={handleChange}
              onBlur={(e) => checkValidation(e, setErrFormData)}
              required
            />
          </div>
          {errFormData.sleepingTime && (
            <div className={styles.error}>
              {" "}
              &#9888; {errFormData.sleepingTime}
            </div>
          )}

          {/* activities start */}
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
                    {militaryTimeToStandard(
                      item?.activityStartTime || item?.mainActivityStartTime
                    )}{" "}
                    to{" "}
                    {militaryTimeToStandard(
                      item?.activityEndTime || item?.mainActivityEndTime
                    )}{" "}
                  </li>
                  <span
                    className={styles.dlt_icon}
                    title="Remove activity from list"
                  >
                    <MdClose
                      onClick={() => deleteActivity(item?.activityName)}
                    />
                  </span>
                </span>
              ))}
            </ul>
          )}
          {/* main activity start */}
          <div className={styles.form_group}>
            <div>
              <label htmlFor="mainActivityName">Activity Name (Main)</label>
              <select
                name="mainActivityName"
                id="mainActivityName"
                value={mainActivity?.mainActivityName}
                onChange={handleChangeActivity}
              >
                <option value="">--Select Activity--</option>
                {mainActivityOptions.map((item, idx) => (
                  <option value={item} key={idx}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.half_width}>
              <div>
                <label htmlFor="mainActivityStartTime">Start Time</label>
                <input
                  type="time"
                  name="mainActivityStartTime"
                  id="mainActivityStartTime"
                  className={styles.input}
                  value={mainActivity?.mainActivityStartTime}
                  onChange={handleChangeActivity}
                />
              </div>
              <div>
                <label htmlFor="mainActivityEndTime">End Time</label>
                <input
                  type="time"
                  name="mainActivityEndTime"
                  id="mainActivityEndTime"
                  className={styles.input}
                  value={mainActivity?.mainActivityEndTime}
                  onChange={handleChangeActivity}
                />
              </div>
            </div>
            <div className={styles.add_btn_div}>
              <button
                title="Add new activity"
                type="button"
                className={styles.add_btn}
                onClick={() => addActivity(true)}
              >
                {" "}
                + Add
              </button>
            </div>
          </div>
          {/* main activity end */}
          {/* ECA activity start */}
          <div className={styles.form_group}>
            <div>
              <label htmlFor="activityName">Activity Name (ECA)</label>
              <input
                type="text"
                name="activityName"
                id="activityName"
                placeholder="e.g. GYM, Sports, Reading, Coding, etc."
                className={styles.input}
                value={newActivity?.activityName}
                onChange={handleChangeActivity}
              />
            </div>
            <div className={styles.half_width}>
              <div>
                <label htmlFor="activityTime">Start Time</label>
                <input
                  type="time"
                  name="activityStartTime"
                  id="activityStartTime"
                  className={styles.input}
                  value={newActivity?.activityStartTime}
                  onChange={handleChangeActivity}
                />
              </div>
              <div>
                <label htmlFor="activityTime">End Time</label>
                <input
                  type="time"
                  name="activityEndTime"
                  id="activityEndTime"
                  className={styles.input}
                  value={newActivity?.activityEndTime}
                  onChange={handleChangeActivity}
                />
              </div>
            </div>
            <div className={styles.add_btn_div}>
              <button
                title="Add new activity"
                type="button"
                className={styles.add_btn}
                onClick={() => addActivity(false)}
              >
                {" "}
                + Add
              </button>
            </div>
          </div>
          {/* activities end */}

          {/* hard subject list */}
          {hardSubjects.length > 0 && (
            <div className={styles.sub_wrapper}>
              <h4 className={styles.activity_heading}>Hard Subjects</h4>
              <div className={styles.list_subject}>
                {hardSubjects.map((item, idx) => (
                  <span className={styles.list_subject_item} key={idx}>
                    <span>{item}</span>
                    <span
                      className={styles.dlt_icon}
                      title="Remove hard subject from list"
                    >
                      <MdClose
                        onClick={() => handleDeleteSubject(item, true)}
                      />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* hard subjects start */}
          <div className={styles.form_group}>
            <span className={styles.sub_head}>
              <label htmlFor="hardSubjects">Add New Hard Subject</label>
              <button onClick={(e) => handleAddSubject(e, true)}>+</button>
            </span>
            <input
              type="text"
              name="hardSubject"
              id="hardSubject"
              className={styles.input}
              value={newHardSubject}
              placeholder="e.g. Higher Math, Physics, Chemistry, etc."
              onChange={handleSubChange}
            />
          </div>
          {/* hard subjects end */}
          {/* Easy subjects */}
          {easySubjects.length > 0 && (
            <div className={styles.sub_wrapper}>
              <h4 className={styles.activity_heading}>Easy Subjects</h4>
              <div className={styles.list_subject}>
                {easySubjects.map((item, idx) => (
                  <span className={styles.list_subject_item} key={idx}>
                    <span>{item}</span>
                    <span
                      className={styles.dlt_icon}
                      title="Remove easy subject from list"
                    >
                      <MdClose
                        onClick={() => handleDeleteSubject(item, false)}
                      />
                    </span>
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* easy subjects start */}
          <div className={styles.form_group}>
            <span className={styles.sub_head}>
              <label htmlFor="easySubject">Add New Easy Subject</label>
              <button onClick={(e) => handleAddSubject(e, false)}>+</button>
            </span>
            <input
              type="text"
              name="easySubject"
              id="easySubject"
              className={styles.input}
              value={newEasySubject}
              placeholder="e.g. ICT, English, General Math, etc."
              onChange={handleSubChange}
            />
          </div>
          {/* easy subjects end */}
          <div className={styles.form_group}>
            <label>When are you more active?</label>
            <span className={styles.radio_opt}>
              <input
                name="moreActive"
                type="radio"
                id="moreActive"
                value="day"
                disabled={formData?.wakingUpTime ? false : true}
                onChange={handleChange}
              />
              {formData?.wakingUpTime ? (
                <label htmlFor="day">
                  From {militaryTimeToStandard(formData?.wakingUpTime)} to 7:00
                  PM
                </label>
              ) : (
                <label>Please provide your waking up time</label>
              )}
            </span>
            <span className={styles.radio_opt}>
              <input
                name="moreActive"
                type="radio"
                id="moreActive"
                value="night"
                disabled={formData?.sleepingTime ? false : true}
                onChange={handleChange}
              />
              {formData?.sleepingTime ? (
                <label htmlFor="night">
                  From 7:00 PM to{" "}
                  {militaryTimeToStandard(formData?.sleepingTime)}
                </label>
              ) : (
                <label>Please provide your sleeping time</label>
              )}
            </span>
          </div>
        </form>
      </div>
    </>
  );
};

export default RoutineInputForm;
