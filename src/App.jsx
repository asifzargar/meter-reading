import "./App.css";
import LoginPage from "./Login";
import MeterEdit from "./MeterEdit";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/meter-edit" element={<MeterEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
