import { Routes, Route, BrowserRouter } from "react-router-dom";
import {
  AddMedication,
  AddUser,
  InactiveMedications,
  UserList,
  UserCalendar,
} from "./pages";
import { Layout } from "./Layout";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<UserList />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/:id/calendar" element={<UserCalendar />} />
          <Route path="/:id/add-medication" element={<AddMedication />} />
          <Route path="/:id/inactive-medications" element={<InactiveMedications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
