import { Routes, Route, BrowserRouter } from "react-router-dom";
import { HomePage, AddMedication } from "./pages";
import { Layout } from "./Layout";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/add" element={<AddMedication />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
