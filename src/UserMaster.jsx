////////////////////////////////////////final full working code ///////////////////////////////////////////////////
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function UserMaster() {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     contactNumber: '',
//     moduleRights: [],
//     allowedPlants: [],
//   });

//   const [plantList, setPlantList] = useState([]);

//   useEffect(() => {
//     fetchPlants();
//   }, []);

//   const fetchPlants = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/plants`);
//       setPlantList(res.data);
//     } catch (err) {
//       console.error('❌ Error fetching plants:', err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === 'checkbox' && name === 'moduleRights') {
//       setFormData((prev) => ({
//         ...prev,
//         moduleRights: checked
//           ? [...prev.moduleRights, value]
//           : prev.moduleRights.filter((right) => right !== value),
//       }));
//     } else if (type === 'checkbox' && name === 'allowedPlants') {
//       setFormData((prev) => ({
//         ...prev,
//         allowedPlants: checked
//           ? [...prev.allowedPlants, value]
//           : prev.allowedPlants.filter((plant) => plant !== value),
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_URL}/api/users`, formData); // ✅ FIXED here
//       alert('✅ User created successfully!');
//       setFormData({
//         username: '',
//         password: '',
//         contactNumber: '',
//         moduleRights: [],
//         allowedPlants: [],
//       });
//     } catch (err) {
//       console.error('❌ Error creating user:', err);
//       alert('Failed to create user.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white px-4">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl">
//          <CancelButton/>
//         <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 flex items-center justify-center gap-2">
//           <span className="text-4xl">👤</span> User Master
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block mb-1 font-semibold">Username</label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-semibold">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-semibold">Contact Number</label>
//             <input
//               type="text"
//               name="contactNumber"
//               value={formData.contactNumber}
//               onChange={handleChange}
//               className="w-full border border-blue-300 rounded px-3 py-2 focus:outline-none focus:ring"
//             />
//           </div>

//           <div>
//             <label className="block mb-1 font-semibold">Module Rights</label>
//             <div className="flex flex-wrap gap-3">
//               {['Admin', 'GateKeeper', 'Report', 'Dispatch', 'Loader'].map((right) => (
//                 <label key={right} className="flex items-center gap-2 text-sm">
//                   <input
//                     type="checkbox"
//                     name="moduleRights"
//                     value={right}
//                     checked={formData.moduleRights.includes(right)}
//                     onChange={handleChange}
//                     className="accent-blue-600"
//                   />
//                   {right}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="block mb-1 font-semibold">Allowed Plants</label>
//             <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto border p-3 rounded bg-blue-50">
//               {plantList.map((plant) => {
//                 const plantId = String(plant.plantId || plant.plantid);
//                 return (
//                   <label key={plantId} className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       name="allowedPlants"
//                       value={plantId}
//                       checked={formData.allowedPlants.includes(plantId)}
//                       onChange={handleChange}
//                       className="accent-green-600"
//                     />
//                     {plant.plantName || plant.plantname}
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
//           >
//             Create User
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }///////////////////////final code //////////////////////////////////////////////////////




// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function UserMaster() {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     contactNumber: '',
//     moduleRights: [],
//     allowedPlants: [],
//   });

//   const [plantList, setPlantList] = useState([]);

//   useEffect(() => {
//     fetchPlants();
//   }, []);

//   const fetchPlants = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/plants`);
//       setPlantList(res.data);
//     } catch (err) {
//       console.error('❌ Error fetching plants:', err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === 'checkbox' && name === 'moduleRights') {
//       setFormData((prev) => ({
//         ...prev,
//         moduleRights: checked
//           ? [...prev.moduleRights, value]
//           : prev.moduleRights.filter((right) => right !== value),
//       }));
//     } else if (type === 'checkbox' && name === 'allowedPlants') {
//       setFormData((prev) => ({
//         ...prev,
//         allowedPlants: checked
//           ? [...prev.allowedPlants, value]
//           : prev.allowedPlants.filter((plant) => plant !== value),
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_URL}/api/users`, formData);
//       alert('✅ User created successfully!');
//       setFormData({
//         username: '',
//         password: '',
//         contactNumber: '',
//         moduleRights: [],
//         allowedPlants: [],
//       });
//     } catch (err) {
//       console.error('❌ Error creating user:', err);
//       alert('Failed to create user.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50 p-4">
//       <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-indigo-200">
//         <CancelButton />
//         <h2 className="text-4xl font-bold text-center mb-8 text-indigo-700 flex items-center justify-center gap-2">
//           <span className="text-5xl">👤</span> User Master
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex flex-col gap-1">
//             <label className="font-semibold text-slate-700">Username</label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="w-full border border-indigo-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Enter Username"
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="font-semibold text-slate-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full border border-indigo-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Enter Password"
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="font-semibold text-slate-700">Contact Number</label>
//             <input
//               type="text"
//               name="contactNumber"
//               value={formData.contactNumber}
//               onChange={handleChange}
//               className="w-full border border-indigo-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Enter Contact Number"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-slate-700 block mb-2">Module Rights</label>
//             <div className="flex flex-wrap gap-3">
//               {['Admin', 'GateKeeper', 'Report', 'Dispatch', 'Loader'].map((right) => (
//                 <label key={right} className="flex items-center gap-2 text-sm bg-indigo-50 px-3 py-1 rounded-full shadow">
//                   <input
//                     type="checkbox"
//                     name="moduleRights"
//                     value={right}
//                     checked={formData.moduleRights.includes(right)}
//                     onChange={handleChange}
//                     className="accent-indigo-600"
//                   />
//                   {right}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <label className="font-semibold text-slate-700 block mb-2">Allowed Plants</label>
//             <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-indigo-200 p-3 rounded-xl bg-indigo-50">
//               {plantList.map((plant) => {
//                 const plantId = String(plant.plantId || plant.plantid);
//                 return (
//                   <label key={plantId} className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       name="allowedPlants"
//                       value={plantId}
//                       checked={formData.allowedPlants.includes(plantId)}
//                       onChange={handleChange}
//                       className="accent-green-600"
//                     />
//                     {plant.plantName || plant.plantname}
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
//           >
//             Create User
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }////////////////////////////////final working code ///////////////////


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function UserMaster() {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     contactNumber: '',
//     moduleRights: [],
//     allowedPlants: [],
//   });

//   const [plantList, setPlantList] = useState([]);

//   useEffect(() => {
//     fetchPlants();
//   }, []);

//   const fetchPlants = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/plants`);
//       setPlantList(res.data);
//     } catch (err) {
//       console.error('❌ Error fetching plants:', err);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === 'checkbox' && name === 'moduleRights') {
//       setFormData((prev) => ({
//         ...prev,
//         moduleRights: checked
//           ? [...prev.moduleRights, value]
//           : prev.moduleRights.filter((right) => right !== value),
//       }));
//     } else if (type === 'checkbox' && name === 'allowedPlants') {
//       setFormData((prev) => ({
//         ...prev,
//         allowedPlants: checked
//           ? [...prev.allowedPlants, value]
//           : prev.allowedPlants.filter((plant) => plant !== value),
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSelectAllPlants = () => {
//     const allPlantIds = plantList.map((plant) => String(plant.plantId || plant.plantid));
//     const isAllSelected = allPlantIds.every((id) => formData.allowedPlants.includes(id));

//     setFormData((prev) => ({
//       ...prev,
//       allowedPlants: isAllSelected ? [] : allPlantIds,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_URL}/api/users`, formData);
//       alert('✅ User created successfully!');
//       setFormData({
//         username: '',
//         password: '',
//         contactNumber: '',
//         moduleRights: [],
//         allowedPlants: [],
//       });
//     } catch (err) {
//       console.error('❌ Error creating user:', err);
//       alert('Failed to create user.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50 p-4">
//       <div className="relative bg-white p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-indigo-200">
//         <CancelButton />
//         <h2 className="text-4xl font-bold text-center mb-8 text-indigo-700 flex items-center justify-center gap-2">
//           <span className="text-5xl">👤</span> User Master
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex flex-col gap-1">
//             <label className="font-semibold text-slate-700">Username</label>
//             <input
//               type="text"
//               name="username"
//               value={formData.username}
//               onChange={handleChange}
//               required
//               className="w-full border border-indigo-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Enter Username"
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="font-semibold text-slate-700">Password</label>
//             <input
//               type="password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full border border-indigo-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Enter Password"
//             />
//           </div>

//           <div className="flex flex-col gap-1">
//             <label className="font-semibold text-slate-700">Contact Number</label>
//             <input
//               type="text"
//               name="contactNumber"
//               value={formData.contactNumber}
//               onChange={handleChange}
//               className="w-full border border-indigo-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//               placeholder="Enter Contact Number"
//             />
//           </div>

//           <div>
//             <label className="font-semibold text-slate-700 block mb-2">Module Rights</label>
//             <div className="flex flex-wrap gap-3">
//               {['Admin', 'GateKeeper', 'Report', 'Dispatch', 'Loader','UserMaster','UserRegister'].map((right) => (
//                 <label key={right} className="flex items-center gap-2 text-sm bg-indigo-50 px-3 py-1 rounded-full shadow">
//                   <input
//                     type="checkbox"
//                     name="moduleRights"
//                     value={right}
//                     checked={formData.moduleRights.includes(right)}
//                     onChange={handleChange}
//                     className="accent-indigo-600"
//                   />
//                   {right}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <label className="font-semibold text-slate-700">Allowed Plants</label>
//               <button
//                 type="button"
//                 onClick={handleSelectAllPlants}
//                 className="text-indigo-600 text-sm font-medium hover:underline"
//               >
//                 {formData.allowedPlants.length === plantList.length ? 'Deselect All' : 'Select All'}
//               </button>
//             </div>
//             <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto border border-indigo-200 p-3 rounded-xl bg-indigo-50">
//               {plantList.map((plant) => {
//                 const plantId = String(plant.plantId || plant.plantid);
//                 return (
//                   <label key={plantId} className="flex items-center gap-2 text-sm">
//                     <input
//                       type="checkbox"
//                       name="allowedPlants"
//                       value={plantId}
//                       checked={formData.allowedPlants.includes(plantId)}
//                       onChange={handleChange}
//                       className="accent-green-600"
//                     />
//                     {plant.plantName || plant.plantname}
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
//           >
//             Create User
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }///////////// my working code 



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FiUser, FiLock, FiPhone, FiX, FiCheck, FiChevronRight } from 'react-icons/fi';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function UserMaster({ onClose }) {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     contactNumber: '',
//     moduleRights: [],
//     allowedPlants: [],
//   });

//   const [plantList, setPlantList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     fetchPlants();
//   }, []);

//   const fetchPlants = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/plants`);
//       setPlantList(res.data);
//     } catch (err) {
//       console.error('Error fetching plants:', err);
//       toast.error('Failed to load plant list', { position: "top-right" });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === 'checkbox' && name === 'moduleRights') {
//       setFormData((prev) => ({
//         ...prev,
//         moduleRights: checked
//           ? [...prev.moduleRights, value]
//           : prev.moduleRights.filter((right) => right !== value),
//       }));
//     } else if (type === 'checkbox' && name === 'allowedPlants') {
//       setFormData((prev) => ({
//         ...prev,
//         allowedPlants: checked
//           ? [...prev.allowedPlants, value]
//           : prev.allowedPlants.filter((plant) => plant !== value),
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSelectAllPlants = () => {
//     const allPlantIds = plantList.map((plant) => String(plant.plantId || plant.plantid));
//     const isAllSelected = allPlantIds.every((id) => formData.allowedPlants.includes(id));

//     setFormData((prev) => ({
//       ...prev,
//       allowedPlants: isAllSelected ? [] : allPlantIds,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
    
//     try {
//       await axios.post(`${API_URL}/api/users`, formData);
//       toast.success('User created successfully!', { position: "top-right" });
//       setFormData({
//         username: '',
//         password: '',
//         contactNumber: '',
//         moduleRights: [],
//         allowedPlants: [],
//       });
//     } catch (err) {
//       console.error('Error creating user:', err);
//       toast.error(err.response?.data?.message || 'Failed to create user', { position: "top-right" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
//       <ToastContainer />
      
//       <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-indigo-100 backdrop-blur-sm">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 p-2 rounded-full hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors"
//           aria-label="Close"
//         >
//           <FiX className="w-5 h-5" />
//         </button>

//         <div className="flex flex-col items-center mb-8">
//           <div className="bg-indigo-100 p-3 rounded-full mb-4">
//             <FiUser className="w-8 h-8 text-indigo-600" />
//           </div>
//           <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
//             User Master Registration
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">Create new user accounts with specific access rights</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex flex-col gap-1">
//               <label className="font-medium text-gray-700 text-sm">Username</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiUser className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter username"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="font-medium text-gray-700 text-sm">Password</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiLock className="text-gray-400" />
//                 </div>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter password"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="font-medium text-gray-700 text-sm">Contact Number</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiPhone className="text-gray-400" />
//                 </div>
//                 <input
//                   type="tel"
//                   name="contactNumber"
//                   value={formData.contactNumber}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter contact number"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="font-medium text-gray-700 text-sm block mb-2">Module Rights</label>
//             <div className="flex flex-wrap gap-2">
//               {['Admin', 'GateKeeper', 'Report', 'Dispatch', 'Loader', 'UserMaster', 'UserRegister'].map((right) => (
//                 <label 
//                   key={right} 
//                   className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-all 
//                     ${formData.moduleRights.includes(right) 
//                       ? 'bg-indigo-600 text-white shadow-md' 
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                 >
//                   <input
//                     type="checkbox"
//                     name="moduleRights"
//                     value={right}
//                     checked={formData.moduleRights.includes(right)}
//                     onChange={handleChange}
//                     className="hidden"
//                   />
//                   {formData.moduleRights.includes(right) ? <FiCheck className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
//                   {right}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//             <div className="flex justify-between items-center mb-3">
//               <label className="font-medium text-gray-700 text-sm">Allowed Plants</label>
//               <button
//                 type="button"
//                 onClick={handleSelectAllPlants}
//                 className="text-indigo-600 text-xs font-medium hover:underline flex items-center gap-1"
//               >
//                 {formData.allowedPlants.length === plantList.length ? (
//                   <>
//                     <FiX className="w-3 h-3" /> Deselect All
//                   </>
//                 ) : (
//                   <>
//                     <FiCheck className="w-3 h-3" /> Select All
//                   </>
//                 )}
//               </button>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2">
//               {plantList.map((plant) => {
//                 const plantId = String(plant.plantId || plant.plantid);
//                 return (
//                   <label 
//                     key={plantId} 
//                     className={`flex items-center gap-2 text-sm p-2 rounded-lg cursor-pointer transition-colors
//                       ${formData.allowedPlants.includes(plantId) 
//                         ? 'bg-indigo-50 border border-indigo-200' 
//                         : 'hover:bg-gray-100'}`}
//                   >
//                     <div className={`w-4 h-4 border rounded-sm flex items-center justify-center 
//                       ${formData.allowedPlants.includes(plantId) 
//                         ? 'bg-indigo-600 border-indigo-600 text-white' 
//                         : 'border-gray-300'}`}>
//                       {formData.allowedPlants.includes(plantId) && <FiCheck className="w-3 h-3" />}
//                     </div>
//                     <input
//                       type="checkbox"
//                       name="allowedPlants"
//                       value={plantId}
//                       checked={formData.allowedPlants.includes(plantId)}
//                       onChange={handleChange}
//                       className="hidden"
//                     />
//                     {plant.plantName || plant.plantname}
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md transition-all
//               ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
//           >
//             {isLoading ? 'Creating User...' : 'Create User'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FiUser, FiLock, FiPhone, FiX, FiCheck, FiChevronRight } from 'react-icons/fi';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function UserMaster({ onClose }) {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     contactNumber: '',
//     moduleRights: [],
//     allowedPlants: [],
//   });


//   const [plantList, setPlantList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const loggedInUsername = localStorage.getItem('username');
//   const loggedInRole = localStorage.getItem('userRole');

//   useEffect(() => {
//     if (!loggedInRole?.includes('Admin') && !loggedInRole?.includes('Owner')) {
//       toast.error('You are not authorized to create users');
//       onClose();
//       return;
//     }
//     fetchPlants();
//   }, []);

//   const fetchPlants = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/plants`);
//       setPlantList(res.data);
//     } catch (err) {
//       console.error('Error fetching plants:', err);
//       toast.error('Failed to load plant list', { position: "top-right" });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === 'checkbox' && name === 'moduleRights') {
//       setFormData((prev) => ({
//         ...prev,
//         moduleRights: checked
//           ? [...prev.moduleRights, value]
//           : prev.moduleRights.filter((right) => right !== value),
//       }));
//     } else if (type === 'checkbox' && name === 'allowedPlants') {
//       setFormData((prev) => ({
//         ...prev,
//         allowedPlants: checked
//           ? [...prev.allowedPlants, value]
//           : prev.allowedPlants.filter((plant) => plant !== value),
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSelectAllPlants = () => {
//     const allPlantIds = plantList.map((plant) => String(plant.plantId || plant.plantid));
//     const isAllSelected = allPlantIds.every((id) => formData.allowedPlants.includes(id));

//     setFormData((prev) => ({
//       ...prev,
//       allowedPlants: isAllSelected ? [] : allPlantIds,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const payload = {
//       ...formData,
//       createdBy: loggedInUsername,
//     };

//     try {
//       await axios.post(`${API_URL}/api/users`, payload);
//       toast.success('User created successfully!', { position: "top-right" });
//       setFormData({
//         username: '',
//         password: '',
//         contactNumber: '',
//         moduleRights: [],
//         allowedPlants: [],
//       });
//     } catch (err) {
//       console.error('Error creating user:', err);
//       toast.error(err.response?.data?.message || 'Failed to create user', { position: "top-right" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
//       <ToastContainer />

//       <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-indigo-100 backdrop-blur-sm">
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 p-2 rounded-full hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors"
//           aria-label="Close"
//         >
//           <FiX className="w-5 h-5" />
//         </button>

//         <div className="flex flex-col items-center mb-8">
//           <div className="bg-indigo-100 p-3 rounded-full mb-4">
//             <FiUser className="w-8 h-8 text-indigo-600" />
//           </div>
//           <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
//             User Master Registration
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">Create new user accounts with specific access rights</p>
//           <p className="text-gray-500 text-sm mt-1">
//             Logged in as: <span className="font-medium text-indigo-700">{loggedInUsername} ({loggedInRole})</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex flex-col gap-1">
//               <label className="font-medium text-gray-700 text-sm">Username</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiUser className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter username"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="font-medium text-gray-700 text-sm">Password</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiLock className="text-gray-400" />
//                 </div>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter password"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="font-medium text-gray-700 text-sm">Contact Number</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiPhone className="text-gray-400" />
//                 </div>
//                 <input
//                   type="tel"
//                   name="contactNumber"
//                   value={formData.contactNumber}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter contact number"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="font-medium text-gray-700 text-sm block mb-2">Module Rights</label>
//             <div className="flex flex-wrap gap-2">
//               {['Admin', 'GateKeeper', 'Report', 'Dispatch', 'Loader', 'UserMaster', 'UserRegister'].map((right) => (
//                 <label 
//                   key={right} 
//                   className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-all 
//                     ${formData.moduleRights.includes(right) 
//                       ? 'bg-indigo-600 text-white shadow-md' 
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                 >
//                   <input
//                     type="checkbox"
//                     name="moduleRights"
//                     value={right}
//                     checked={formData.moduleRights.includes(right)}
//                     onChange={handleChange}
//                     className="hidden"
//                   />
//                   {formData.moduleRights.includes(right) ? <FiCheck className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
//                   {right}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//             <div className="flex justify-between items-center mb-3">
//               <label className="font-medium text-gray-700 text-sm">Allowed Plants</label>
//               <button
//                 type="button"
//                 onClick={handleSelectAllPlants}
//                 className="text-indigo-600 text-xs font-medium hover:underline flex items-center gap-1"
//               >
//                 {formData.allowedPlants.length === plantList.length ? (
//                   <>
//                     <FiX className="w-3 h-3" /> Deselect All
//                   </>
//                 ) : (
//                   <>
//                     <FiCheck className="w-3 h-3" /> Select All
//                   </>
//                 )}
//               </button>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2">
//               {plantList.map((plant) => {
//                 const plantId = String(plant.plantId || plant.plantid);
//                 return (
//                   <label 
//                     key={plantId} 
//                     className={`flex items-center gap-2 text-sm p-2 rounded-lg cursor-pointer transition-colors
//                       ${formData.allowedPlants.includes(plantId) 
//                         ? 'bg-indigo-50 border border-indigo-200' 
//                         : 'hover:bg-gray-100'}`}
//                   >
//                     <div className={`w-4 h-4 border rounded-sm flex items-center justify-center 
//                       ${formData.allowedPlants.includes(plantId) 
//                         ? 'bg-indigo-600 border-indigo-600 text-white' 
//                         : 'border-gray-300'}`}>
//                       {formData.allowedPlants.includes(plantId) && <FiCheck className="w-3 h-3" />}
//                     </div>
//                     <input
//                       type="checkbox"
//                       name="allowedPlants"
//                       value={plantId}
//                       checked={formData.allowedPlants.includes(plantId)}
//                       onChange={handleChange}
//                       className="hidden"
//                     />
//                     {plant.plantName || plant.plantname}
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md transition-all
//               ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
//           >
//             {isLoading ? 'Creating User...' : 'Create User'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }/////final



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { FiUser, FiLock, FiPhone, FiX, FiCheck, FiChevronRight } from 'react-icons/fi';
// import { useNavigate } from 'react-router-dom';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function UserMaster({ onClose }) {
//   const [formData, setFormData] = useState({
//     username: '',
//     password: '',
//     contactNumber: '',
//     moduleRights: [],
//     allowedPlants: [],
//   });

//   const [plantList, setPlantList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const loggedInUsername = localStorage.getItem('username');
//   const loggedInRole = localStorage.getItem('userRole');

//   useEffect(() => {
//     if (!loggedInRole?.includes('Admin') && !loggedInRole?.includes('Owner')) {
//       toast.error('You are not authorized to create users');
//       handleClose();
//       return;
//     }
//     fetchPlants();
//   }, []);

//   const fetchPlants = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/plants`);
//       setPlantList(res.data);
//     } catch (err) {
//       console.error('Error fetching plants:', err);
//       toast.error('Failed to load plant list', { position: "top-right" });
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;

//     if (type === 'checkbox' && name === 'moduleRights') {
//       setFormData((prev) => ({
//         ...prev,
//         moduleRights: checked
//           ? [...prev.moduleRights, value]
//           : prev.moduleRights.filter((right) => right !== value),
//       }));
//     } else if (type === 'checkbox' && name === 'allowedPlants') {
//       setFormData((prev) => ({
//         ...prev,
//         allowedPlants: checked
//           ? [...prev.allowedPlants, value]
//           : prev.allowedPlants.filter((plant) => plant !== value),
//       }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSelectAllPlants = () => {
//     const allPlantIds = plantList.map((plant) => String(plant.plantId || plant.plantid));
//     const isAllSelected = allPlantIds.every((id) => formData.allowedPlants.includes(id));

//     setFormData((prev) => ({
//       ...prev,
//       allowedPlants: isAllSelected ? [] : allPlantIds,
//     }));
//   };

//   const handleClose = () => {
//     if (onClose) {
//       onClose();
//     }
//     navigate('/dashboard');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     const payload = {
//       ...formData,
//       createdBy: loggedInUsername,
//     };

//     try {
//       await axios.post(`${API_URL}/api/users`, payload);
//       toast.success('User created successfully!', { position: "top-right" });
//       setFormData({
//         username: '',
//         password: '',
//         contactNumber: '',
//         moduleRights: [],
//         allowedPlants: [],
//       });
//     } catch (err) {
//       console.error('Error creating user:', err);
//       toast.error(err.response?.data?.message || 'Failed to create user', { position: "top-right" });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
//       <ToastContainer />

//       <div className="relative bg-white p-6 md:p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-indigo-100 backdrop-blur-sm">
//         <button
//           onClick={handleClose}
//           className="absolute top-4 right-4 p-2 rounded-full hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 transition-colors"
//           aria-label="Close"
//         >
//           <FiX className="w-5 h-5" />
//         </button>

//         <div className="flex flex-col items-center mb-8">
//           <div className="bg-indigo-100 p-3 rounded-full mb-4">
//             <FiUser className="w-8 h-8 text-indigo-600" />
//           </div>
//           <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
//             User Master Registration
//           </h2>
//           <p className="text-gray-500 text-sm mt-1">Create new user accounts with specific access rights</p>
//           <p className="text-gray-500 text-sm mt-1">
//             Logged in as: <span className="font-medium text-indigo-700">{loggedInUsername} ({loggedInRole})</span>
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex flex-col gap-1">
//               <label className="font-medium text-gray-700 text-sm">Username</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiUser className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   name="username"
//                   value={formData.username}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter username"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="font-medium text-gray-700 text-sm">Password</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiLock className="text-gray-400" />
//                 </div>
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter password"
//                 />
//               </div>
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="font-medium text-gray-700 text-sm">Contact Number</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiPhone className="text-gray-400" />
//                 </div>
//                 <input
//                   type="tel"
//                   name="contactNumber"
//                   value={formData.contactNumber}
//                   onChange={handleChange}
//                   className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//                   placeholder="Enter contact number"
//                 />
//               </div>
//             </div>
//           </div>

//           <div>
//             <label className="font-medium text-gray-700 text-sm block mb-2">Module Rights</label>
//             <div className="flex flex-wrap gap-2">
//               {['Admin', 'PlantMaster', 'GateKeeper', 'Report', 'Dispatch', 'Loader', 'UserMaster', 'UserRegister'].map((right) => (
//                 <label 
//                   key={right} 
//                   className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg cursor-pointer transition-all 
//                     ${formData.moduleRights.includes(right) 
//                       ? 'bg-indigo-600 text-white shadow-md' 
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
//                 >
//                   <input
//                     type="checkbox"
//                     name="moduleRights"
//                     value={right}
//                     checked={formData.moduleRights.includes(right)}
//                     onChange={handleChange}
//                     className="hidden"
//                   />
//                   {formData.moduleRights.includes(right) ? <FiCheck className="w-4 h-4" /> : <FiChevronRight className="w-4 h-4" />}
//                   {right}
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
//             <div className="flex justify-between items-center mb-3">
//               <label className="font-medium text-gray-700 text-sm">Allowed Plants</label>
//               <button
//                 type="button"
//                 onClick={handleSelectAllPlants}
//                 className="text-indigo-600 text-xs font-medium hover:underline flex items-center gap-1"
//               >
//                 {formData.allowedPlants.length === plantList.length ? (
//                   <>
//                     <FiX className="w-3 h-3" /> Deselect All
//                   </>
//                 ) : (
//                   <>
//                     <FiCheck className="w-3 h-3" /> Select All
//                   </>
//                 )}
//               </button>
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2">
//               {plantList.map((plant) => {
//                 const plantId = String(plant.plantId || plant.plantid);
//                 return (
//                   <label 
//                     key={plantId} 
//                     className={`flex items-center gap-2 text-sm p-2 rounded-lg cursor-pointer transition-colors
//                       ${formData.allowedPlants.includes(plantId) 
//                         ? 'bg-indigo-50 border border-indigo-200' 
//                         : 'hover:bg-gray-100'}`}
//                   >
//                     <div className={`w-4 h-4 border rounded-sm flex items-center justify-center 
//                       ${formData.allowedPlants.includes(plantId) 
//                         ? 'bg-indigo-600 border-indigo-600 text-white' 
//                         : 'border-gray-300'}`}>
//                       {formData.allowedPlants.includes(plantId) && <FiCheck className="w-3 h-3" />}
//                     </div>
//                     <input
//                       type="checkbox"
//                       name="allowedPlants"
//                       value={plantId}
//                       checked={formData.allowedPlants.includes(plantId)}
//                       onChange={handleChange}
//                       className="hidden"
//                     />
//                     {plant.plantName || plant.plantname}
//                   </label>
//                 );
//               })}
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={isLoading}
//             className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg shadow-md transition-all
//               ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
//           >
//             {isLoading ? 'Creating User...' : 'Create User'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserMasterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    moduleRights: []
  });
  const [filteredModuleRights, setFilteredModuleRights] = useState([]);
  const [loading, setLoading] = useState(false);

  // Check if user has access to this page (Admin or Owner)
  const hasUserMasterAccess = () => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) return false;
    const userRoles = userRole.split(',').map(r => r.trim());
    return userRoles.includes('Admin') || userRoles.includes('Owner');
  };

  // Get filtered module rights based on logged-in user's roles
  const getFilteredModuleRights = () => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) return [];
    
    const userRoles = userRole.split(',').map(r => r.trim());
    const allModuleRights = [
      { value: 'Admin', label: 'Admin' },
      { value: 'PlantMaster', label: 'Plant Master' },
      { value: 'Dispatch', label: 'Dispatch' },
      { value: 'GateKeeper', label: 'Gate Keeper' },
      { value: 'Loader', label: 'Loader' },
      { value: 'Report', label: 'Report' },
      { value: 'UserMaster', label: 'User Master' },
      { value: 'UserRegister', label: 'User Register' }
    ];

    // Admin and Owner can assign all rights
    if (userRoles.includes('Admin') || userRoles.includes('Owner')) {
      return allModuleRights;
    }

    // For other users, only show the rights they have
    return allModuleRights.filter(module => 
      userRoles.includes(module.value)
    );
  };

  useEffect(() => {
    if (!hasUserMasterAccess()) {
      toast.error("You don't have permission to access this page");
      navigate('/dashboard');
      return;
    }
    
    setFilteredModuleRights(getFilteredModuleRights());
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      if (checked) {
        return {
          ...prev,
          moduleRights: [...prev.moduleRights, value]
        };
      } else {
        return {
          ...prev,
          moduleRights: prev.moduleRights.filter(item => item !== value)
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate form data
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      // Your API call to register the user
      // await registerUser(formData);
      toast.success("User registered successfully");
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        moduleRights: []
      });
    } catch (error) {
      toast.error(error.message || "Failed to register user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-master-container">
      <div className="form-header">
        <h2>User Registration</h2>
        <p>Create new user accounts with specific module access rights</p>
      </div>

      <form onSubmit={handleSubmit} className="user-master-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Module Rights</label>
          <div className="checkbox-group">
            {filteredModuleRights.length > 0 ? (
              filteredModuleRights.map((right) => (
                <div key={right.value} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={right.value}
                    name="moduleRights"
                    value={right.value}
                    checked={formData.moduleRights.includes(right.value)}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor={right.value}>{right.label}</label>
                </div>
              ))
            ) : (
              <p className="no-rights-message">No module rights available to assign</p>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Registering...' : 'Register User'}
        </button>
      </form>
    </div>
  );
};

export default UserMaster;
