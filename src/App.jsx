import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import MapRoute from './pages/home';
import ProtectedRoute from './components/protected_route';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MapRoute />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
