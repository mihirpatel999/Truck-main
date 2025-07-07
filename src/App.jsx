// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
// import Home from './Home';
// import StaffPage from './StaffPage';
// import Login from './Login';
// import Navbar from './Navbar';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import GateKeeper from './GateKeeper';
// import TruckTransaction from './TruckTransaction';
// import PlantMaster from './PlantMaster';
// import Report from './Report'; 
// import UserMaster from './UserMaster';




// function Layout() {
//   const location = useLocation();
//   const hideNavbar = location.pathname === '/'; // Hide only on login

//   return (
//     <>
//       {!hideNavbar && <Navbar />}
//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/home" element={<Home />} />
//         <Route path="/staff" element={<StaffPage />} />
//         <Route path="/gate" element={<GateKeeper />} />
//          <Route path="/truck" element={<TruckTransaction />} />
//          <Route path="/plantmaster" element={<PlantMaster />} />
//         <Route path="/usermaster" element={<UserMaster />} />
//           <Route path="/reports" element={<Report />} />
//       </Routes>
//     </>
//   );
// }

// function App() {
//   return (
//     <Router>
//       <Layout />
//     </Router>
//   );
// }

// export default App;//////////////////my code ////////////////



// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
// import Home from './Home';
// import StaffPage from './StaffPage';
// import Login from './Login';
// import Navbar from './Navbar';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import GateKeeper from './GateKeeper';
// import TruckTransaction from './TruckTransaction';
// import PlantMaster from './PlantMaster';
// import Reports from './Report';
// import UserMaster from './UserMaster';
// import TruckFind from './TruckFind.jsx';

// // Role-based access control
// const roleAccess = {
//   owner:    ['plantmaster','usermaster','truck','gate','loader','reports','staff'],
//   admin:    ['plantmaster','usermaster','truck','gate','loader','reports','staff'],
//   dispatch: ['truck','truckfind'],
//   gatekeeper: ['gate'],
//   report:   ['reports'],
//   loader:   ['loader'],
// };

// // Authentication check
// const isAuthenticated = () => {
//   const username = localStorage.getItem('username');
//   const userRole = localStorage.getItem('userRole');
//   return username && userRole;
// };

// // Authorization check
// const canAccessRoute = (requiredRoute) => {
//   const roles = localStorage.getItem('userRole')?.split(',').map(r=>r.trim()) || [];
//   return roles.some(role => roleAccess[role]?.includes(requiredRoute));
// };

// // Reusable protected route
// function ProtectedRoute({ element: Component, requiredRoute }) {
//   if (!isAuthenticated()) return <Navigate to="/" replace />;
//   if (requiredRoute && !canAccessRoute(requiredRoute)) return <Navigate to="/home" replace />;
//   return <Component />;
// }

// function Layout() {
//   const location = useLocation();
//   const hideNavbar = location.pathname === '/';

//   return (
//     <>
//       {!hideNavbar && <Navbar />}
//       <Routes>
//         <Route path="/" element={<Login />} />

//         {/* Routes requiring authentication */}
//         <Route path="/home" element={<ProtectedRoute element={Home} />} />
//         <Route path="/staff" element={<ProtectedRoute element={StaffPage} requiredRoute="staff" />} />
//         <Route path="/gate" element={<ProtectedRoute element={GateKeeper} requiredRoute="gate" />} />
//         <Route path="/truck" element={<ProtectedRoute element={TruckTransaction} requiredRoute="truck" />} />
//         <Route path="/truckfind" element={<ProtectedRoute element={TruckFind} requiredRoute="truck" />} />
//         <Route path="/plantmaster" element={<ProtectedRoute element={PlantMaster} requiredRoute="plantmaster" />} />
//         <Route path="/reports" element={<ProtectedRoute element={Reports} requiredRoute="reports" />} />
//         <Route path="/usermaster" element={<ProtectedRoute element={UserMaster} requiredRoute="usermaster" />} />

//         {/* Wildcard: authenticated users go to home; unauthenticated go to login */}
//         <Route
//           path="*"
//           element={
//             isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/" replace />
//           }
//         />
//       </Routes>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <Layout />
//     </Router>
//   );
// }



///////////////


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
// import Home from './Home';
// import StaffPage from './StaffPage';
// import Login from './Login';
// import Navbar from './Navbar';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import GateKeeper from './GateKeeper';
// import TruckTransaction from './TruckTransaction';
// import PlantMaster from './PlantMaster';
// import Reports from './Report';
// import UserMaster from './UserMaster';
// import TruckFind from './TruckFind.jsx';

// // Role-based access control
// const roleAccess = {
//   owner: ['plantmaster', 'usermaster', 'truck', 'gate', 'loader', 'reports', 'staff'],
//   admin: ['plantmaster', 'usermaster', 'truck', 'gate', 'loader', 'reports', 'staff'],
//   dispatch: ['truck', 'truckfind'],
//   gatekeeper: ['gate'],
//   report: ['reports'],
//   loader: ['loader'],
// };

// // Authentication check
// const isAuthenticated = () => {
//   const username = localStorage.getItem('username');
//   const userRole = localStorage.getItem('userRole');
//   return username && userRole;
// };

// // Authorization check
// const canAccessRoute = (requiredRoute) => {
//   const roles = localStorage.getItem('userRole')
//     ?.split(',')
//     .map(r => r.trim().toLowerCase()) || [];

//   return roles.some(role => roleAccess[role]?.includes(requiredRoute));
// };

// // Reusable protected route
// function ProtectedRoute({ element: Component, requiredRoute }) {
//   if (!isAuthenticated()) return <Navigate to="/" replace />;
//   if (requiredRoute && !canAccessRoute(requiredRoute)) return <Navigate to="/home" replace />;
//   return <Component />;
// }

// function Layout() {
//   const location = useLocation();
//   const hideNavbar = location.pathname === '/';

//   return (
//     <>
//       {!hideNavbar && <Navbar />}
//       <Routes>
//         <Route path="/" element={<Login />} />

//         {/* Routes requiring authentication */}
//         <Route path="/home" element={<ProtectedRoute element={Home} />} />
//         <Route path="/staff" element={<ProtectedRoute element={StaffPage} requiredRoute="staff" />} />
//         <Route path="/gate" element={<ProtectedRoute element={GateKeeper} requiredRoute="gate" />} />
//         <Route path="/truck" element={<ProtectedRoute element={TruckTransaction} requiredRoute="truck" />} />
//         <Route path="/truckfind" element={<ProtectedRoute element={TruckFind} requiredRoute="truck" />} />
//         <Route path="/plantmaster" element={<ProtectedRoute element={PlantMaster} requiredRoute="plantmaster" />} />
//         <Route path="/reports" element={<ProtectedRoute element={Reports} requiredRoute="reports" />} />
//         <Route path="/usermaster" element={<ProtectedRoute element={UserMaster} requiredRoute="usermaster" />} />

//         {/* Wildcard: authenticated users go to home; unauthenticated go to login */}
//         <Route
//           path="*"
//           element={
//             isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/" replace />
//           }
//         />
//       </Routes>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <Layout />
//     </Router>
//   );
// }




import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './Home';
import StaffPage from './StaffPage';
import Login from './Login';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import GateKeeper from './GateKeeper';
import TruckTransaction from './TruckTransaction';
import PlantMaster from './PlantMaster';
import Reports from './Report';
import UserMaster from './UserMaster';
import TruckFind from './TruckFind.jsx';
import UserRegister from './UserRegister.jsx';
import  TruckSchedule from "./TruckSchedule.jsx";

// Role-based access control
const roleAccess = {
  owner: ['plantmaster', 'usermaster', 'truck', 'gate', 'loader', 'reports', 'staff','userregister','truckshedule'],
  admin: ['plantmaster', 'usermaster', 'truck', 'gate', 'loader', 'reports', 'staff','userregister','truckshedule'],
  dispatch: ['truck', 'truckfind'],
  gatekeeper: ['gate'],
  usermaster: ['usermaster'],
  userregister: ['userregister'],
  report: ['reports','truckshedule'],
  loader: ['loader'],
};

// Authentication check
const isAuthenticated = () => {
  const username = localStorage.getItem('username');
  const userRole = localStorage.getItem('userRole');
  return username && userRole;
};

// Authorization check
const canAccessRoute = (requiredRoute) => {
  const roles = localStorage.getItem('userRole')
    ?.split(',')
    .map(r => r.trim().toLowerCase()) || [];

  return roles.some(role => roleAccess[role]?.includes(requiredRoute));
};

// Reusable protected route
function ProtectedRoute({ element: Component, requiredRoute }) {
  if (!isAuthenticated()) return <Navigate to="/" replace />;
  if (requiredRoute && !canAccessRoute(requiredRoute)) return <Navigate to="/home" replace />;
  return <Component />;
}

function Layout() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/';

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />

        {/* Routes requiring authentication */}
        <Route path="/home" element={<ProtectedRoute element={Home} />} />
        <Route path="/staff" element={<ProtectedRoute element={StaffPage} requiredRoute="staff" />} />
        <Route path="/gate" element={<ProtectedRoute element={GateKeeper} requiredRoute="gate" />} />
        <Route path="/truck" element={<ProtectedRoute element={TruckTransaction} requiredRoute="truck" />} />
        <Route path="/truckfind" element={<ProtectedRoute element={TruckFind} requiredRoute="truck" />} />
        <Route path="/plantmaster" element={<ProtectedRoute element={PlantMaster} requiredRoute="plantmaster" />} />
        <Route path="/reports" element={<ProtectedRoute element={Reports} requiredRoute="reports" />} />
        <Route path="/usermaster" element={<ProtectedRoute element={UserMaster} requiredRoute="usermaster" />} />
        <Route path="/userregister" element={<ProtectedRoute element={UserRegister} requiredRoute="userregister" />} />
        <Route path="/truckshedule" element={<ProtectedRoute element={TruckSchedule} requiredRoute="truckshedule" />} />

        {/* Wildcard: authenticated users go to home; unauthenticated go to login */}
        <Route
          path="*"
          element={
            isAuthenticated() ? <Navigate to="/home" replace /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}