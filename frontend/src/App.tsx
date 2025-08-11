import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/page";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
};







