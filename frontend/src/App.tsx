import { Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/dashboard/page";
import { CollectionDetails } from "./pages/collectionDetails/page";

export const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/:collectionId" element={<CollectionDetails />} />
      </Routes>
    </>
  );
};







