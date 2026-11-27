import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from './pages/SearchPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
     <Navbar />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;