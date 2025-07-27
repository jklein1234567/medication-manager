import { Routes, Route, BrowserRouter } from "react-router-dom";
import { HomePage, AddMedication } from "./pages";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/add" element={<AddMedication />} />
      </Routes>
    </BrowserRouter>
  );
}
