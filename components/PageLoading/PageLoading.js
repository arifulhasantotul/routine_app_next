import { CircularProgress } from "@mui/material";

const PageLoading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <CircularProgress />
    </div>
  );
};

export default PageLoading;
