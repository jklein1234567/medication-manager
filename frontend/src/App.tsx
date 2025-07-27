import { Routes, Route, BrowserRouter } from "react-router-dom";
import { HomePage, AddMedication, InactiveMedications } from "./pages";
import { Layout } from "./Layout";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddMedication />} />
          <Route path="/inactive" element={<InactiveMedications />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
