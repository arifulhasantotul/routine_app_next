import styles from "@/styles/RoutineInputForm.module.css";

const RoutineInputForm = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <>
      <div className={styles.form_wrapper}>
        <h2>Additional Data</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.form_group}>
            <label htmlFor="name">Name</label>
          </div>
        </form>
      </div>
    </>
  );
};

export default RoutineInputForm;
