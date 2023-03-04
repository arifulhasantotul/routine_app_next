import styles from "@/styles/RoutineInputForm.module.css";
import { getDataFromStorage } from "@/utils/temporarySave";
import { useEffect, useState } from "react";
import { checkValidation } from "./validation";

const RoutineInputForm = () => {
  const initialData = {
    name: "",
    target: "",
    wakingUpTime: "",
    sleepingTime: "",
  };

  const [formData, setFormData] = useState(initialData);
  const [errFormData, setErrFormData] = useState(initialData);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    activityName: "",
    activityStartTime: "",
    activityEndTime: "",
  });

  const handleChangeActivity = (e) => {
    const { name, value } = e.target;
    setNewActivity((prv) => ({
      ...prv,
      [name]: value,
    }));
  };

  const addActivity = () => {
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
    setNewActivity({
      activityName: "",
      activityStartTime: "",
      activityEndTime: "",
    });
    document.getElementById("activityName").value = "";
    document.getElementById("activityStartTime").value = "";
    document.getElementById("activityEndTime").value = "";
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

          {activities.length > 0 && (
            <ul className={styles.list_activity}>
              <h4 className={styles.activity_heading}>Activities</h4>
              {activities.map((item, idx) => (
                <li key={idx}>
                  {" "}
                  {idx + 1}. {item?.activityName} time from{" "}
                  {item?.activityStartTime} to {item?.activityEndTime}
                </li>
              ))}
            </ul>
          )}
          <div className={styles.form_group}>
            <div>
              <label htmlFor="activityName">Activity Name</label>
              <input
                type="text"
                name="activityName"
                id="activityName"
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
                onClick={addActivity}
              >
                {" "}
                + Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default RoutineInputForm;
