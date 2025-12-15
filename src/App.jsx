import "./App.css";
import LoginPage from "./Login";
import MeterEdit from "./MeterEdit";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NoInternet from "./NoInternate";
import useNetworkStatus from "./hooks/useNetworkStatus";
import AdminPanel from "./Admin";
import MeterEditPage from "./MeterEditPage";

function App() {
  const isOnline = useNetworkStatus({
    pingUrl: "https://farm4.staticflickr.com/3319/3211138044_9232086442.jpg",
    pingInterval: 4000,
  });

  return (
    <>
      {!isOnline && <NoInternet />}
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<MeterEditPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
