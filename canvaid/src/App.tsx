// src/App.tsx
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import CourseDetail from './pages/CourseDetail'; // <-- Import the new page

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        {/* Add the new route below */}
        <Route path="courses/:courseId" element={<CourseDetail />} />
      </Route>
    </Routes>
  );
}

export default App;