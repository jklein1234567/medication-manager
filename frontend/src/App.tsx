import { Routes, Route, BrowserRouter } from "react-router-dom";
import {
  AddMedication,
  InactiveMedications,
  UserList,
  UserCalendar,
} from "./pages";
import { Layout } from "./Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route element={<Layout />}>
          <Route path="/:id/calendar" element={<UserCalendar />} />
          <Route path="/:id/add" element={<AddMedication />} />
          <Route path="/:id/inactive" element={<InactiveMedications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
