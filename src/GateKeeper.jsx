// // GateKeeper.jsx
// // Full code with strict priority validation (integer-only, sequential enforcement)
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import truckImage from './assets/Truck.png.png';
// import { useNavigate } from 'react-router-dom';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// function GateKeeper() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     truckNo: '',
//     dispatchDate: new Date().toISOString().split('T')[0],
//     invoiceNo: '',
//     remarks: 'This is a system-generated remark.',
//   });

//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('');
//   const [truckNumbers, setTruckNumbers] = useState([]);
//   const [checkedInTrucks, setCheckedInTrucks] = useState([]);
//   const [quantityPanels, setQuantityPanels] = useState([]);

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     const role = localStorage.getItem('role');
//     const allowedPlantsRaw = localStorage.getItem('allowedPlants') || '';
//     const allowedPlants = allowedPlantsRaw.split(',').map(p => p.trim()).filter(Boolean);

//     axios.get(`${API_URL}/api/plants`, {
//       headers: { userid: userId, role }
//     })
//     .then(res => {
//       const filtered = res.data.filter(plant => {
//         const pid = String(plant.PlantID || plant.PlantId || plant.plantid || '');
//         return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
//       });
//       setPlantList(filtered);
//     })
//     .catch(err => {
//       console.error('❌ Error fetching plants:', err);
//       toast.error('Failed to fetch plant list');
//     });
//   }, []);

//   useEffect(() => {
//     if (!selectedPlant) return;
//     axios.get(`${API_URL}/api/trucks?plantName=${selectedPlant}`)
//       .then(res => setTruckNumbers(res.data))
//       .catch(err => console.error('Error fetching trucks:', err));

//     axios.get(`${API_URL}/api/checked-in-trucks?plantName=${selectedPlant}`)
//       .then(res => setCheckedInTrucks(res.data))
//       .catch(err => console.error('Error fetching checked-in trucks:', err));
//   }, [selectedPlant]);

//   const getTruckNo = truck => truck.TruckNo || truck.truckno || truck.truck_no || '';
//   const getPlantName = plant => typeof plant === 'string' ? plant : (plant.PlantName || plant.plantname || 'Unknown');

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const handlePlantChange = (e) => {
//     setSelectedPlant(e.target.value);
//     setCheckedInTrucks([]);
//     setQuantityPanels([]);
//     setFormData(prev => ({ ...prev, truckNo: '', dispatchDate: new Date().toISOString().split('T')[0] }));
//   };

//   const handleTruckSelect = async (truckNo) => {
//     setFormData(prev => ({ ...prev, truckNo }));
//     try {
//       const remarksRes = await axios.get(`${API_URL}/api/fetch-remarks`, {
//         params: { plantName: selectedPlant, truckNo }
//       });
//       const quantityRes = await axios.get(`${API_URL}/api/truck-plant-quantities?truckNo=${truckNo}`);
//       setQuantityPanels(quantityRes.data);
//       setFormData(prev => ({ ...prev, remarks: remarksRes.data.remarks || 'No remarks available.' }));
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setFormData(prev => ({ ...prev, remarks: 'No remarks available or error fetching remarks.' }));
//     }
//   };

//   const handleCheckedInClick = (truckNo) => handleTruckSelect(truckNo);

//   const handleSubmit = async (type) => {
//     const { truckNo, dispatchDate, invoiceNo } = formData;
//     const role = localStorage.getItem('role');

//     if (!selectedPlant) return toast.warn('Please select a plant first.');
//     if (!truckNo) return toast.warn('🚛 Please select a truck number.');

//     try {
//       const priorityRes = await axios.get(`${API_URL}/api/check-priority-status`, {
//         params: { truckNo, plantName: selectedPlant }
//       });

//       const { hasPending, canProceed, nextPriority, nextPlant } = priorityRes.data;

//       if (hasPending && !canProceed) {
//         return toast.error(`🚫 Priority ${nextPriority} at ${nextPlant} must be completed first.`);
//       }
//     } catch (error) {
//       console.error('Priority check error:', error);
//       toast.error('❌ Error checking priority status');
//       return;
//     }

//     if (type === 'Check In' && checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
//       return toast.error('🚫 This truck is already checked in!');
//     }

//     try {
//       const response = await axios.post(`${API_URL}/api/update-truck-status`, {
//         truckNo,
//         plantName: selectedPlant,
//         type,
//         dispatchDate,
//         invoiceNo,
//         quantity: quantityPanels.reduce((acc, p) => acc + (p.quantity || 0), 0),
//       });

//       if (response.data.message?.includes('✅')) {
//         setTruckNumbers(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         if (type === 'Check In') setCheckedInTrucks(prev => [...prev, { TruckNo: truckNo }]);
//         toast.success(response.data.message);
//         setFormData(prev => ({ ...prev, truckNo: '' }));
//         setQuantityPanels([]);
//       } else {
//         toast.error(response.data.message || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       toast.error(err.response?.data?.message || 'Something went wrong.');
//     }
//   };

//   const maxQty = Math.max(...quantityPanels.map(p => p.quantity || 0), 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6">
//       <CancelButton />
//       <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className="space-y-4">
//           <select value={selectedPlant} onChange={handlePlantChange} className="w-full border rounded px-4 py-2">
//             <option value="">Select Plant</option>
//             {plantList.map((plant, i) => (
//               <option key={i} value={getPlantName(plant)}>{getPlantName(plant)}</option>
//             ))}
//           </select>
//           <div className="bg-blue-100 rounded p-4 h-64 overflow-y-auto">
//             <h3 className="font-bold text-blue-700">Truck List</h3>
//             {truckNumbers.length === 0 && <p className="text-gray-400 italic">No trucks available</p>}
//             <ul>
//               {truckNumbers.map((t, i) => (
//                 <li key={i} onClick={() => handleTruckSelect(getTruckNo(t))} className="cursor-pointer hover:text-blue-600">
//                   🚛 {getTruckNo(t)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="relative h-56 w-full bg-blue-200 rounded-lg overflow-hidden shadow-md">
//             <div className="absolute bottom-[51px] left-[50px] h-[75px] w-[80px] flex items-end gap-[2px] z-10" style={{ width: 'calc(100% - 170px)', maxWidth: '370px' }}>
//               {quantityPanels.map((panel, index) => {
//                 const height = maxQty ? (panel.quantity / maxQty) * 100 : 0;
//                 const bgColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
//                 return (
//                   <div
//                     key={index}
//                     className={`flex flex-col items-center justify-end text-white text-[10px] ${bgColors[index % bgColors.length]} rounded-t-md transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer`}
//                     style={{ height: `${height}%`, width: `${100 / quantityPanels.length}%` }}
//                     title={`${panel.plantname}: ${panel.quantity}`}
//                   >
//                     <div className="flex items-center gap-[2px]">
//                       <span>📦</span>
//                       <span>{panel.quantity}</span>
//                     </div>
//                     <div className="whitespace-nowrap text-[8px]">{panel.plantname}</div>
//                   </div>
//                 );
//               })}
//             </div>
//             <img
//               src={truckImage}
//               alt="Truck"
//               className="absolute bottom-0 left-0 w-full h-auto object-contain z-0"
//               style={{ height: '65%' }}
//             />
//           </div>

//           <input name="truckNo" value={formData.truckNo} onChange={handleChange} placeholder="Truck No" className="w-full border px-4 py-2 rounded" />
//           <input name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
//           <input name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} placeholder="Invoice No" className="w-full border px-4 py-2 rounded" />
//           <textarea name="remarks" readOnly value={formData.remarks} className="w-full border px-4 py-2 bg-gray-100 rounded" rows="3" />
//           <div className="flex gap-4">
//             <button onClick={() => handleSubmit('Check In')} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Check In</button>
//             <button onClick={() => handleSubmit('Check Out')} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">Check Out</button>
//           </div>
//         </div>

//         <div className="bg-green-100 rounded p-4 h-full overflow-y-auto">
//           <h3 className="font-bold text-green-700 mb-2">Checked In Trucks</h3>
//           {checkedInTrucks.length === 0 && <p className="text-gray-400 italic">No checked-in trucks</p>}
//           <ul>
//             {checkedInTrucks.map((t, i) => (
//               <li key={i} onClick={() => handleCheckedInClick(getTruckNo(t))} className="cursor-pointer hover:text-green-600">
//                 ✓ {getTruckNo(t)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
//     </div>
//   );
// }

// export default GateKeeper;////////////////////// final working code only auto referch 


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import truckImage from './assets/Truck.png.png';
// import { useNavigate } from 'react-router-dom';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// function GateKeeper() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     truckNo: '',
//     dispatchDate: new Date().toISOString().split('T')[0],
//     invoiceNo: '',
//     remarks: 'This is a system-generated remark.',
//   });

//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('');
//   const [truckNumbers, setTruckNumbers] = useState([]);
//   const [checkedInTrucks, setCheckedInTrucks] = useState([]);
//   const [quantityPanels, setQuantityPanels] = useState([]);

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     const role = localStorage.getItem('role');
//     const allowedPlantsRaw = localStorage.getItem('allowedPlants') || '';
//     const allowedPlants = allowedPlantsRaw.split(',').map(p => p.trim()).filter(Boolean);

//     axios.get(`${API_URL}/api/plants`, {
//       headers: { userid: userId, role }
//     })
//     .then(res => {
//       const filtered = res.data.filter(plant => {
//         const pid = String(plant.PlantID || plant.PlantId || plant.plantid || '');
//         return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
//       });
//       setPlantList(filtered);
//     })
//     .catch(err => {
//       console.error('❌ Error fetching plants:', err);
//       toast.error('Failed to fetch plant list');
//     });
//   }, []);

//   useEffect(() => {
//     if (!selectedPlant) return;
//     axios.get(`${API_URL}/api/trucks?plantName=${selectedPlant}`)
//       .then(res => setTruckNumbers(res.data))
//       .catch(err => console.error('Error fetching trucks:', err));

//     axios.get(`${API_URL}/api/checked-in-trucks?plantName=${selectedPlant}`)
//       .then(res => setCheckedInTrucks(res.data))
//       .catch(err => console.error('Error fetching checked-in trucks:', err));
//   }, [selectedPlant]);

//   const getTruckNo = truck => truck.TruckNo || truck.truckno || truck.truck_no || '';
//   const getPlantName = plant => typeof plant === 'string' ? plant : (plant.PlantName || plant.plantname || 'Unknown');

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const handlePlantChange = (e) => {
//     setSelectedPlant(e.target.value);
//     setCheckedInTrucks([]);
//     setQuantityPanels([]);
//     setFormData(prev => ({ ...prev, truckNo: '', dispatchDate: new Date().toISOString().split('T')[0] }));
//   };

//   const handleTruckSelect = async (truckNo) => {
//     setFormData(prev => ({ ...prev, truckNo }));
//     try {
//       const remarksRes = await axios.get(`${API_URL}/api/fetch-remarks`, {
//         params: { plantName: selectedPlant, truckNo }
//       });
//       const quantityRes = await axios.get(`${API_URL}/api/truck-plant-quantities?truckNo=${truckNo}`);
//       setQuantityPanels(quantityRes.data);
//       setFormData(prev => ({ ...prev, remarks: remarksRes.data.remarks || 'No remarks available.' }));
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setFormData(prev => ({ ...prev, remarks: 'No remarks available or error fetching remarks.' }));
//     }
//   };

//   const handleCheckedInClick = (truckNo) => handleTruckSelect(truckNo);

//   const handleSubmit = async (type) => {
//     const { truckNo, dispatchDate, invoiceNo } = formData;
//     const role = localStorage.getItem('role');

//     if (!selectedPlant) return toast.warn('Please select a plant first.');
//     if (!truckNo) return toast.warn('🚛 Please select a truck number.');

//     // priority check
//     try {
//       const priorityRes = await axios.get(`${API_URL}/api/check-priority-status`, {
//         params: { truckNo, plantName: selectedPlant }
//       });
//       const { hasPending, canProceed, nextPriority, nextPlant } = priorityRes.data;
//       if (hasPending && !canProceed) {
//         return toast.error(`🚫 Priority ${nextPriority} at ${nextPlant} must be completed first.`);
//       }
//     } catch (error) {
//       console.error('Priority check error:', error);
//       toast.error('❌ Error checking priority status');
//       return;
//     }

//     if (type === 'Check In' && checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
//       return toast.error('🚫 This truck is already checked in!');
//     }

//     try {
//       const response = await axios.post(`${API_URL}/api/update-truck-status`, {
//         truckNo,
//         plantName: selectedPlant,
//         type,
//         dispatchDate,
//         invoiceNo,
//         quantity: quantityPanels.reduce((acc, p) => acc + (p.quantity || 0), 0),
//       });

//       if (response.data.message?.includes('✅')) {
//         // remove from left list on Check In
//         setTruckNumbers(prev => prev.filter(t => getTruckNo(t) !== truckNo));

//         // 🚀 NEW: on Check Out, remove from checked-in list
//         if (type === 'Check Out') {
//           setCheckedInTrucks(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         } else {
//           // on Check In, add to checked-in list
//           setCheckedInTrucks(prev => [...prev, { TruckNo: truckNo }]);
//         }

//         toast.success(response.data.message);
//         setFormData(prev => ({ ...prev, truckNo: '' }));
//         setQuantityPanels([]);
//       } else {
//         toast.error(response.data.message || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       toast.error(err.response?.data?.message || 'Something went wrong.');
//     }
//   };

//   const maxQty = Math.max(...quantityPanels.map(p => p.quantity || 0), 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6">
//       <CancelButton />
//       <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* left */}
//         <div className="space-y-4">
//           <select value={selectedPlant} onChange={handlePlantChange} className="w-full border rounded px-4 py-2">
//             <option value="">Select Plant</option>
//             {plantList.map((plant, i) => (
//               <option key={i} value={getPlantName(plant)}>{getPlantName(plant)}</option>
//             ))}
//           </select>
//           <div className="bg-blue-100 rounded p-4 h-64 overflow-y-auto">
//             <h3 className="font-bold text-blue-700">Truck List</h3>
//             {truckNumbers.length === 0 && <p className="text-gray-400 italic">No trucks available</p>}
//             <ul>
//               {truckNumbers.map((t, i) => (
//                 <li key={i} onClick={() => handleTruckSelect(getTruckNo(t))} className="cursor-pointer hover:text-blue-600">
//                   🚛 {getTruckNo(t)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* center */}
//         <div className="space-y-4">
//           <div className="relative h-56 w-full bg-blue-200 rounded-lg overflow-hidden shadow-md">
//             <div className="absolute bottom-[51px] left-[50px] h-[75px] w-[calc(100%-170px)] max-w-[370px] flex items-end gap-[2px] z-10">
//               {quantityPanels.map((panel, index) => {
//                 const height = maxQty ? (panel.quantity / maxQty) * 100 : 0;
//                 const bgColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
//                 return (
//                   <div
//                     key={index}
//                     className={`flex flex-col items-center justify-end text-white text-[10px] ${bgColors[index % bgColors.length]} rounded-t-md transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer`}
//                     style={{ height: `${height}%`, width: `${100 / quantityPanels.length}%` }}
//                     title={`${panel.plantname}: ${panel.quantity}`}
//                   >
//                     <div className="flex items-center gap-[2px]">
//                       <span>📦</span>
//                       <span>{panel.quantity}</span>
//                     </div>
//                     <div className="whitespace-nowrap text-[8px]">{panel.plantname}</div>
//                   </div>
//                 );
//               })}
//             </div>
//             <img
//               src={truckImage}
//               alt="Truck"
//               className="absolute bottom-0 left-0 w-full h-auto object-contain z-0"
//               style={{ height: '65%' }}
//             />
//           </div>

//           <input name="truckNo" value={formData.truckNo} onChange={handleChange} placeholder="Truck No" className="w-full border px-4 py-2 rounded" />
//           <input name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
//           <input name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} placeholder="Invoice No" className="w-full border px-4 py-2 rounded" />
//           <textarea name="remarks" readOnly value={formData.remarks} className="w-full border px-4 py-2 bg-gray-100 rounded" rows="3" />
//           <div className="flex gap-4">
//             <button onClick={() => handleSubmit('Check In')} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Check In</button>
//             <button onClick={() => handleSubmit('Check Out')} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">Check Out</button>
//           </div>
//         </div>

//         {/* right */}
//         <div className="bg-green-100 rounded p-4 h-full overflow-y-auto">
//           <h3 className="font-bold text-green-700 mb-2">Checked In Trucks</h3>
//           {checkedInTrucks.length === 0 && <p className="text-gray-400 italic">No checked-in trucks</p>}
//           <ul>
//             {checkedInTrucks.map((t, i) => (
//               <li key={i} onClick={() => handleCheckedInClick(getTruckNo(t))} className="cursor-pointer hover:text-green-600">
//                 ✓ {getTruckNo(t)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
//     </div>
//   );
// }

// export default GateKeeper;//////////// refrech done 


// // ✅ Final version of GateKeeper.jsx with these updates:
// // 1. Quantity chart bars sorted by priority (left to right)
// // 2. Added "From" and "Next" plant info below truck image

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import truckImage from './assets/Truck.png.png';
// import { useNavigate } from 'react-router-dom';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// function GateKeeper() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     truckNo: '',
//     dispatchDate: new Date().toISOString().split('T')[0],
//     invoiceNo: '',
//     remarks: 'This is a system-generated remark.',
//   });

//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('');
//   const [truckNumbers, setTruckNumbers] = useState([]);
//   const [checkedInTrucks, setCheckedInTrucks] = useState([]);
//   const [quantityPanels, setQuantityPanels] = useState([]);
//   const [fromPlant, setFromPlant] = useState('Unknown');
//   const [nextPlant, setNextPlant] = useState('');

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     const role = localStorage.getItem('role');
//     const allowedPlantsRaw = localStorage.getItem('allowedPlants') || '';
//     const allowedPlants = allowedPlantsRaw.split(',').map(p => p.trim()).filter(Boolean);

//     axios.get(`${API_URL}/api/plants`, {
//       headers: { userid: userId, role }
//     })
//     .then(res => {
//       const filtered = res.data.filter(plant => {
//         const pid = String(plant.PlantID || plant.PlantId || plant.plantid || '');
//         return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
//       });
//       setPlantList(filtered);
//     })
//     .catch(err => {
//       console.error('❌ Error fetching plants:', err);
//       toast.error('Failed to fetch plant list');
//     });
//   }, []);

//   useEffect(() => {
//     if (!selectedPlant) return;
//     axios.get(`${API_URL}/api/trucks?plantName=${selectedPlant}`)
//       .then(res => setTruckNumbers(res.data))
//       .catch(err => console.error('Error fetching trucks:', err));

//     axios.get(`${API_URL}/api/checked-in-trucks?plantName=${selectedPlant}`)
//       .then(res => setCheckedInTrucks(res.data))
//       .catch(err => console.error('Error fetching checked-in trucks:', err));
//   }, [selectedPlant]);

//   const getTruckNo = truck => truck.TruckNo || truck.truckno || truck.truck_no || '';
//   const getPlantName = plant => typeof plant === 'string' ? plant : (plant.PlantName || plant.plantname || 'Unknown');

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const handlePlantChange = (e) => {
//     setSelectedPlant(e.target.value);
//     setCheckedInTrucks([]);
//     setQuantityPanels([]);
//     setFormData(prev => ({ ...prev, truckNo: '', dispatchDate: new Date().toISOString().split('T')[0] }));
//   };

//   const handleTruckSelect = async (truckNo) => {
//     setFormData(prev => ({ ...prev, truckNo }));
//     try {
//       const remarksRes = await axios.get(`${API_URL}/api/fetch-remarks`, {
//         params: { plantName: selectedPlant, truckNo }
//       });
//       const quantityRes = await axios.get(`${API_URL}/api/truck-plant-quantities?truckNo=${truckNo}`);
//       const sortedByPriority = [...quantityRes.data].sort((a, b) => a.priority - b.priority);
//       setQuantityPanels(sortedByPriority);
//       setFormData(prev => ({ ...prev, remarks: remarksRes.data.remarks || 'No remarks available.' }));
//       // set from/next
//       const pendingRes = await axios.get(`${API_URL}/api/check-priority-status`, {
//         params: { truckNo, plantName: selectedPlant }
//       });
//       setNextPlant(pendingRes.data.nextPlant || '');
//       const currentIndex = sortedByPriority.findIndex(p => p.plantname?.toLowerCase() === selectedPlant.toLowerCase());
//       const from = sortedByPriority.slice(0, currentIndex).filter(p => p.checkinstatus && p.checkoutstatus).pop();
//       setFromPlant(from?.plantname || 'Unknown');
//     } catch (err) {
//       console.error('Error fetching truck data:', err);
//       setFormData(prev => ({ ...prev, remarks: 'No remarks available or error fetching remarks.' }));
//     }
//   };

//   const handleCheckedInClick = (truckNo) => handleTruckSelect(truckNo);

//   const handleSubmit = async (type) => {
//     const { truckNo, dispatchDate, invoiceNo } = formData;
//     const role = localStorage.getItem('role');
//     if (!selectedPlant) return toast.warn('Please select a plant first.');
//     if (!truckNo) return toast.warn('🚛 Please select a truck number.');
//     try {
//       const priorityRes = await axios.get(`${API_URL}/api/check-priority-status`, {
//         params: { truckNo, plantName: selectedPlant }
//       });
//       const { hasPending, canProceed, nextPriority, nextPlant } = priorityRes.data;
//       if (hasPending && !canProceed) {
//         return toast.error(`🚫 Priority ${nextPriority} at ${nextPlant} must be completed first.`);
//       }
//     } catch (error) {
//       console.error('Priority check error:', error);
//       toast.error('❌ Error checking priority status');
//       return;
//     }
//     if (type === 'Check In' && checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
//       return toast.error('🚫 This truck is already checked in!');
//     }
//     try {
//       const response = await axios.post(`${API_URL}/api/update-truck-status`, {
//         truckNo,
//         plantName: selectedPlant,
//         type,
//         dispatchDate,
//         invoiceNo,
//         quantity: quantityPanels.reduce((acc, p) => acc + (p.quantity || 0), 0),
//       });
//       if (response.data.message?.includes('✅')) {
//         setTruckNumbers(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         if (type === 'Check Out') {
//           setCheckedInTrucks(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         } else {
//           setCheckedInTrucks(prev => [...prev, { TruckNo: truckNo }]);
//         }
//         toast.success(response.data.message);
//         setFormData(prev => ({ ...prev, truckNo: '' }));
//         setQuantityPanels([]);
//       } else {
//         toast.error(response.data.message || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       toast.error(err.response?.data?.message || 'Something went wrong.');
//     }
//   };

//   const maxQty = Math.max(...quantityPanels.map(p => p.quantity || 0), 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6">
//       <CancelButton />
//       <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* left */}
//         <div className="space-y-4">
//           <select value={selectedPlant} onChange={handlePlantChange} className="w-full border rounded px-4 py-2">
//             <option value="">Select Plant</option>
//             {plantList.map((plant, i) => (
//               <option key={i} value={getPlantName(plant)}>{getPlantName(plant)}</option>
//             ))}
//           </select>
//           <div className="bg-blue-100 rounded p-4 h-64 overflow-y-auto">
//             <h3 className="font-bold text-blue-700">Truck List</h3>
//             {truckNumbers.length === 0 && <p className="text-gray-400 italic">No trucks available</p>}
//             <ul>
//               {truckNumbers.map((t, i) => (
//                 <li key={i} onClick={() => handleTruckSelect(getTruckNo(t))} className="cursor-pointer hover:text-blue-600">
//                   🚛 {getTruckNo(t)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* center */}
//         <div className="space-y-4">
//           <div className="relative h-56 w-full bg-blue-200 rounded-lg overflow-hidden shadow-md">
//             <div className="absolute bottom-[51px] left-[50px] h-[75px] w-[calc(100%-170px)] max-w-[370px] flex items-end gap-[2px] z-10">
//               {quantityPanels.map((panel, index) => {
//                 const height = maxQty ? (panel.quantity / maxQty) * 100 : 0;
//                 const bgColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
//                 return (
//                   <div
//                     key={index}
//                     className={`flex flex-col items-center justify-end text-white text-[10px] ${bgColors[index % bgColors.length]} rounded-t-md transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer`}
//                     style={{ height: `${height}%`, width: `${100 / quantityPanels.length}%` }}
//                     title={`${panel.plantname}: ${panel.quantity}`}
//                   >
//                     <div className="flex items-center gap-[2px]">
//                       <span>📦</span>
//                       <span>{panel.quantity}</span>
//                     </div>
//                     <div className="whitespace-nowrap text-[8px]">{panel.plantname}</div>
//                   </div>
//                 );
//               })}
//             </div>
//             <img
//               src={truckImage}
//               alt="Truck"
//               className="absolute bottom-0 left-0 w-full h-auto object-contain z-0"
//               style={{ height: '65%' }}
//             />
//           </div>

//           {/* 👇 NEW: Source and Destination */}
//           <div className="flex gap-4 justify-between text-sm font-semibold">
//             <div className="bg-gray-100 px-4 py-2 rounded w-1/2">From: {fromPlant}</div>
//             <div className="bg-gray-100 px-4 py-2 rounded w-1/2 text-right">Next: {nextPlant}</div>
//           </div>

//           <input name="truckNo" value={formData.truckNo} onChange={handleChange} placeholder="Truck No" className="w-full border px-4 py-2 rounded" />
//           <input name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
//           <input name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} placeholder="Invoice No" className="w-full border px-4 py-2 rounded" />
//           <textarea name="remarks" readOnly value={formData.remarks} className="w-full border px-4 py-2 bg-gray-100 rounded" rows="3" />
//           <div className="flex gap-4">
//             <button onClick={() => handleSubmit('Check In')} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Check In</button>
//             <button onClick={() => handleSubmit('Check Out')} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">Check Out</button>
//           </div>
//         </div>

//         {/* right */}
//         <div className="bg-green-100 rounded p-4 h-full overflow-y-auto">
//           <h3 className="font-bold text-green-700 mb-2">Checked In Trucks</h3>
//           {checkedInTrucks.length === 0 && <p className="text-gray-400 italic">No checked-in trucks</p>}
//           <ul>
//             {checkedInTrucks.map((t, i) => (
//               <li key={i} onClick={() => handleCheckedInClick(getTruckNo(t))} className="cursor-pointer hover:text-green-600">
//                 ✓ {getTruckNo(t)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
//     </div>
//   );
// }

// export default GateKeeper;

///////////////////

// // ✅ Final GateKeeper.jsx (priority-based sorted chart, proper 'From' and 'Next' handling)
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import truckImage from './assets/Truck.png.png';
// import { useNavigate } from 'react-router-dom';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// function GateKeeper() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     truckNo: '',
//     dispatchDate: new Date().toISOString().split('T')[0],
//     invoiceNo: '',
//     remarks: 'This is a system-generated remark.',
//   });

//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('');
//   const [truckNumbers, setTruckNumbers] = useState([]);
//   const [checkedInTrucks, setCheckedInTrucks] = useState([]);
//   const [quantityPanels, setQuantityPanels] = useState([]);
//   const [fromPlant, setFromPlant] = useState('Unknown');
//   const [nextPlant, setNextPlant] = useState('');

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     const role = localStorage.getItem('role');
//     const allowedPlantsRaw = localStorage.getItem('allowedPlants') || '';
//     const allowedPlants = allowedPlantsRaw.split(',').map(p => p.trim()).filter(Boolean);

//     axios.get(`${API_URL}/api/plants`, {
//       headers: { userid: userId, role }
//     })
//       .then(res => {
//         const filtered = res.data.filter(plant => {
//           const pid = String(plant.PlantID || plant.PlantId || plant.plantid || '');
//           return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
//         });
//         setPlantList(filtered);
//       })
//       .catch(err => {
//         console.error('❌ Error fetching plants:', err);
//         toast.error('Failed to fetch plant list');
//       });
//   }, []);

//   useEffect(() => {
//     if (!selectedPlant) return;
//     axios.get(`${API_URL}/api/trucks?plantName=${selectedPlant}`)
//       .then(res => setTruckNumbers(res.data))
//       .catch(err => console.error('Error fetching trucks:', err));

//     axios.get(`${API_URL}/api/checked-in-trucks?plantName=${selectedPlant}`)
//       .then(res => setCheckedInTrucks(res.data))
//       .catch(err => console.error('Error fetching checked-in trucks:', err));
//   }, [selectedPlant]);

//   const getTruckNo = truck => truck.TruckNo || truck.truckno || truck.truck_no || '';
//   const getPlantName = plant => typeof plant === 'string' ? plant : (plant.PlantName || plant.plantname || 'Unknown');

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const handlePlantChange = (e) => {
//     setSelectedPlant(e.target.value);
//     setCheckedInTrucks([]);
//     setQuantityPanels([]);
//     setFormData(prev => ({ ...prev, truckNo: '', dispatchDate: new Date().toISOString().split('T')[0] }));
//   };

//   const handleTruckSelect = async (truckNo) => {
//     setFormData(prev => ({ ...prev, truckNo }));
//     try {
//       const remarksRes = await axios.get(`${API_URL}/api/fetch-remarks`, {
//         params: { plantName: selectedPlant, truckNo }
//       });

//       const quantityRes = await axios.get(`${API_URL}/api/truck-plant-quantities`, {
//         params: { truckNo }
//       });

//       const sortedPanels = [...quantityRes.data].sort((a, b) => a.priority - b.priority);
//       setQuantityPanels(sortedPanels);

//       setFormData(prev => ({ ...prev, remarks: remarksRes.data.remarks || 'No remarks available.' }));

//       // set next and from
//       const statusRes = await axios.get(`${API_URL}/api/check-priority-status`, {
//         params: { truckNo, plantName: selectedPlant }
//       });

//       const { hasPending, nextPlant } = statusRes.data;
//       setNextPlant(hasPending ? nextPlant : 'Done');

//       const finishedRes = await axios.get(`${API_URL}/api/finished-plant`, {
//         params: { truckNo }
//       });
//       setFromPlant(finishedRes.data.lastFinished || 'Unknown');

//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setFormData(prev => ({ ...prev, remarks: 'No remarks available or error fetching remarks.' }));
//     }
//   };

//   const handleCheckedInClick = (truckNo) => handleTruckSelect(truckNo);

//   const handleSubmit = async (type) => {
//     const { truckNo, dispatchDate, invoiceNo } = formData;
//     const role = localStorage.getItem('role');

//     if (!selectedPlant) return toast.warn('Please select a plant first.');
//     if (!truckNo) return toast.warn('🚛 Please select a truck number.');

//     try {
//       const priorityRes = await axios.get(`${API_URL}/api/check-priority-status`, {
//         params: { truckNo, plantName: selectedPlant }
//       });
//       const { hasPending, canProceed, nextPriority, nextPlant } = priorityRes.data;
//       if (hasPending && !canProceed) {
//         return toast.error(`🚫 Priority ${nextPriority} at ${nextPlant} must be completed first.`);
//       }
//     } catch (error) {
//       console.error('Priority check error:', error);
//       toast.error('❌ Error checking priority status');
//       return;
//     }

//     if (type === 'Check In' && checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
//       return toast.error('🚫 This truck is already checked in!');
//     }

//     try {
//       const response = await axios.post(`${API_URL}/api/update-truck-status`, {
//         truckNo,
//         plantName: selectedPlant,
//         type,
//         dispatchDate,
//         invoiceNo,
//         quantity: quantityPanels.reduce((acc, p) => acc + (p.quantity || 0), 0),
//       });

//       if (response.data.message?.includes('✅')) {
//         setTruckNumbers(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         if (type === 'Check Out') {
//           setCheckedInTrucks(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         } else {
//           setCheckedInTrucks(prev => [...prev, { TruckNo: truckNo }]);
//         }
//         toast.success(response.data.message);
//         setFormData(prev => ({ ...prev, truckNo: '' }));
//         setQuantityPanels([]);
//       } else {
//         toast.error(response.data.message || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       toast.error(err.response?.data?.message || 'Something went wrong.');
//     }
//   };

//   const maxQty = Math.max(...quantityPanels.map(p => p.quantity || 0), 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6">
//       <CancelButton />
//       <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//         <div className="space-y-4">
//           <select value={selectedPlant} onChange={handlePlantChange} className="w-full border rounded px-4 py-2">
//             <option value="">Select Plant</option>
//             {plantList.map((plant, i) => (
//               <option key={i} value={getPlantName(plant)}>{getPlantName(plant)}</option>
//             ))}
//           </select>
//           <div className="bg-blue-100 rounded p-4 h-64 overflow-y-auto">
//             <h3 className="font-bold text-blue-700">Truck List</h3>
//             {truckNumbers.length === 0 && <p className="text-gray-400 italic">No trucks available</p>}
//             <ul>
//               {truckNumbers.map((t, i) => (
//                 <li key={i} onClick={() => handleTruckSelect(getTruckNo(t))} className="cursor-pointer hover:text-blue-600">
//                   🚛 {getTruckNo(t)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <div className="space-y-4">
//           <div className="relative h-56 w-full bg-blue-200 rounded-lg overflow-hidden shadow-md">
//             <div className="absolute bottom-[51px] left-[50px] h-[75px] w-[calc(100%-170px)] max-w-[370px] flex items-end gap-[2px] z-10">
//               {quantityPanels.map((panel, index) => {
//                 const height = maxQty ? (panel.quantity / maxQty) * 100 : 0;
//                 const bgColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
//                 return (
//                   <div
//                     key={index}
//                     className={`flex flex-col items-center justify-end text-white text-[10px] ${bgColors[index % bgColors.length]} rounded-t-md transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer`}
//                     style={{ height: `${height}%`, width: `${100 / quantityPanels.length}%` }}
//                     title={`${panel.plantname}: ${panel.quantity}`}
//                   >
//                     <div className="flex items-center gap-[2px]">
//                       <span>📦</span>
//                       <span>{panel.quantity}</span>
//                     </div>
//                     <div className="whitespace-nowrap text-[8px]">{panel.plantname}</div>
//                   </div>
//                 );
//               })}
//             </div>
//             <img src={truckImage} alt="Truck" className="absolute bottom-0 left-0 w-full h-auto object-contain z-0" style={{ height: '65%' }} />
//           </div>

//           <div className="grid grid-cols-2 gap-2 text-sm text-center">
//             <div className="bg-gray-100 rounded p-1">From: {fromPlant}</div>
//             <div className="bg-gray-100 rounded p-1">Next: {nextPlant}</div>
//           </div>

//           <input name="truckNo" value={formData.truckNo} onChange={handleChange} placeholder="Truck No" className="w-full border px-4 py-2 rounded" />
//           <input name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
//           <input name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} placeholder="Invoice No" className="w-full border px-4 py-2 rounded" />
//           <textarea name="remarks" readOnly value={formData.remarks} className="w-full border px-4 py-2 bg-gray-100 rounded" rows="3" />
//           <div className="flex gap-4">
//             <button onClick={() => handleSubmit('Check In')} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Check In</button>
//             <button onClick={() => handleSubmit('Check Out')} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">Check Out</button>
//           </div>
//         </div>

//         <div className="bg-green-100 rounded p-4 h-full overflow-y-auto">
//           <h3 className="font-bold text-green-700 mb-2">Checked In Trucks</h3>
//           {checkedInTrucks.length === 0 && <p className="text-gray-400 italic">No checked-in trucks</p>}
//           <ul>
//             {checkedInTrucks.map((t, i) => (
//               <li key={i} onClick={() => handleCheckedInClick(getTruckNo(t))} className="cursor-pointer hover:text-green-600">
//                 ✓ {getTruckNo(t)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
//     </div>
//   );
// }

// export default GateKeeper;/////


/////////////////////////////////



// ////////////////////////////////


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import truckImage from './assets/Truck.png.png';
// import { useNavigate } from 'react-router-dom';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// function GateKeeper() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     truckNo: '',
//     dispatchDate: new Date().toISOString().split('T')[0],
//     invoiceNo: '',
//     remarks: 'This is a system-generated remark.',
//   });

//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('');
//   const [truckNumbers, setTruckNumbers] = useState([]);
//   const [checkedInTrucks, setCheckedInTrucks] = useState([]);
//   const [quantityPanels, setQuantityPanels] = useState([]);
//   const [fromPlant, setFromPlant] = useState('—');
//   const [nextPlant, setNextPlant] = useState('—');

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     const role = localStorage.getItem('role');
//     const allowedPlantsRaw = localStorage.getItem('allowedPlants') || '';
//     const allowedPlants = allowedPlantsRaw.split(',').map(p => p.trim()).filter(Boolean);

//     axios.get(`${API_URL}/api/plants`, {
//       headers: { userid: userId, role }
//     })
//       .then(res => {
//         const filtered = res.data.filter(plant => {
//           const pid = String(plant.PlantID || plant.PlantId || plant.plantid || '');
//           return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
//         });
//         setPlantList(filtered);
//       })
//       .catch(err => {
//         console.error('❌ Error fetching plants:', err);
//         toast.error('Failed to fetch plant list');
//       });
//   }, []);

//   useEffect(() => {
//     if (!selectedPlant) return;

//     setFormData(prev => ({
//       ...prev,
//       truckNo: '',
//       dispatchDate: new Date().toISOString().split('T')[0],
//       invoiceNo: '',
//       remarks: 'This is a system-generated remark.'
//     }));
//     setCheckedInTrucks([]);
//     setQuantityPanels([]);

//     axios.get(`${API_URL}/api/trucks?plantName=${selectedPlant}`)
//       .then(res => setTruckNumbers(res.data))
//       .catch(err => console.error('Error fetching trucks:', err));

//     axios.get(`${API_URL}/api/checked-in-trucks?plantName=${selectedPlant}`)
//       .then(res => setCheckedInTrucks(res.data))
//       .catch(err => console.error('Error fetching checked-in trucks:', err));
//   }, [selectedPlant]);

//   const getTruckNo = truck => truck.TruckNo || truck.truckno || truck.truck_no || '';
//   const getPlantName = plant => typeof plant === 'string' ? plant : (plant.PlantName || plant.plantname || 'Unknown');

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const handlePlantChange = (e) => {
//     setSelectedPlant(e.target.value);
//   };

//   const handleTruckSelect = async (truckNo) => {
//     setFormData(prev => ({ ...prev, truckNo }));
//     try {
//       const remarksRes = await axios.get(`${API_URL}/api/fetch-remarks`, {
//         params: { plantName: selectedPlant, truckNo }
//       });
//       const quantityRes = await axios.get(`${API_URL}/api/truck-plant-quantities?truckNo=${truckNo}`);
//       const sorted = [...quantityRes.data].sort((a, b) => a.priority - b.priority);
//       setQuantityPanels(sorted);
//       setFormData(prev => ({ ...prev, remarks: remarksRes.data.remarks || 'No remarks available.' }));

//       const currentIndex = sorted.findIndex(p => p.plantname === selectedPlant);
//       setFromPlant(currentIndex > 0 ? sorted[currentIndex - 1]?.plantname : '—');
//       setNextPlant(currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1]?.plantname : '—');
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setFormData(prev => ({ ...prev, remarks: 'No remarks available or error fetching remarks.' }));
//     }
//   };

//   const handleCheckedInClick = (truckNo) => handleTruckSelect(truckNo);

//   const handleSubmit = async (type) => {
//     const { truckNo, dispatchDate, invoiceNo } = formData;
//     const role = localStorage.getItem('role');

//     if (!selectedPlant) return toast.warn('Please select a plant first.');
//     if (!truckNo) return toast.warn('🚛 Please select a truck number.');

//     try {
//       const priorityRes = await axios.get(`${API_URL}/api/check-priority-status`, {
//         params: { truckNo, plantName: selectedPlant }
//       });
//       const { hasPending, canProceed, nextPriority, nextPlant } = priorityRes.data;
//       if (hasPending && !canProceed) {
//         return toast.error(`🚫 Priority ${nextPriority} at ${nextPlant} must be completed first.`);
//       }
//     } catch (error) {
//       console.error('Priority check error:', error);
//       toast.error('❌ Error checking priority status');
//       return;
//     }

//     if (type === 'Check In' && checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
//       return toast.error('🚫 This truck is already checked in!');
//     }

//     try {
//       const response = await axios.post(`${API_URL}/api/update-truck-status`, {
//         truckNo,
//         plantName: selectedPlant,
//         type,
//         dispatchDate,
//         invoiceNo,
//         quantity: quantityPanels.reduce((acc, p) => acc + (p.quantity || 0), 0),
//       });

//       if (response.data.message?.includes('✅')) {
//         setTruckNumbers(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         if (type === 'Check Out') {
//           setCheckedInTrucks(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         } else {
//           setCheckedInTrucks(prev => [...prev, { TruckNo: truckNo }]);
//         }

//         toast.success(response.data.message);
//         setFormData(prev => ({ ...prev, truckNo: '' }));
//         setQuantityPanels([]);
//       } else {
//         toast.error(response.data.message || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       toast.error(err.response?.data?.message || 'Something went wrong.');
//     }
//   };

//   const maxQty = Math.max(...quantityPanels.map(p => p.quantity || 0), 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6">
//       <CancelButton />
//       <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
//         {/* Left Panel */}
//         <div className="space-y-4">
//           <select value={selectedPlant} onChange={handlePlantChange} className="w-full border rounded px-4 py-2">
//             <option value="">Select Plant</option>
//             {plantList.map((plant, i) => (
//               <option key={i} value={getPlantName(plant)}>{getPlantName(plant)}</option>
//             ))}
//           </select>

//           <div className="bg-blue-100 rounded p-4 h-64 overflow-y-auto">
//             <h3 className="font-bold text-blue-700">Truck List</h3>
//             {truckNumbers.length === 0 && <p className="text-gray-400 italic">No trucks available</p>}
//             <ul>
//               {truckNumbers.map((t, i) => (
//                 <li key={i} onClick={() => handleTruckSelect(getTruckNo(t))} className="cursor-pointer hover:text-blue-600">
//                   🚛 {getTruckNo(t)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Center Panel */}
//         <div className="space-y-4">
//           <div className="relative h-56 w-full bg-blue-200 rounded-lg overflow-hidden shadow-md">
//             <div className="absolute bottom-[51px] left-[50px] h-[75px] w-[calc(100%-170px)] max-w-[370px] flex items-end gap-[2px] z-10">
//               {quantityPanels.map((panel, index) => {
//                 const height = maxQty ? (panel.quantity / maxQty) * 100 : 0;
//                 const bgColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
//                 return (
//                   <div
//                     key={index}
//                     className={`flex flex-col items-center justify-end text-white text-[10px] ${bgColors[index % bgColors.length]} rounded-t-md transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer`}
//                     style={{ height: `${height}%`, width: `${100 / quantityPanels.length}%` }}
//                     title={`${panel.plantname}: ${panel.quantity}`}
//                   >
//                     <div className="flex items-center gap-[2px]">
//                       <span>📦</span>
//                       <span>{panel.quantity}</span>
//                     </div>
//                     <div className="whitespace-nowrap text-[8px]">{panel.plantname}</div>
//                   </div>
//                 );
//               })}
//             </div>
//             <img src={truckImage} alt="Truck" className="absolute bottom-0 left-0 w-full h-auto object-contain z-0" style={{ height: '65%' }} />
//           </div>

//           <div className="col-span-3 flex justify-center gap-6 font-semibold text-sm">
//             <div>From: <span className="text-blue-800">{fromPlant}</span></div>
//             <div>Next: <span className="text-green-800">{nextPlant}</span></div>
//           </div>

//           <input name="truckNo" value={formData.truckNo} onChange={handleChange} placeholder="Truck No" className="w-full border px-4 py-2 rounded" />
//           <input name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
//           <input name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} placeholder="Invoice No" className="w-full border px-4 py-2 rounded" />
//           <textarea name="remarks" readOnly value={formData.remarks} className="w-full border px-4 py-2 bg-gray-100 rounded" rows="3" />

//           <div className="flex gap-4">
//             <button onClick={() => handleSubmit('Check In')} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Check In</button>
//             <button onClick={() => handleSubmit('Check Out')} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">Check Out</button>
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="bg-green-100 rounded p-4 h-full overflow-y-auto">
//           <h3 className="font-bold text-green-700 mb-2">Checked In Trucks</h3>
//           {checkedInTrucks.length === 0 && <p className="text-gray-400 italic">No checked-in trucks</p>}
//           <ul>
//             {checkedInTrucks.map((t, i) => (
//               <li key={i} onClick={() => handleCheckedInClick(getTruckNo(t))} className="cursor-pointer hover:text-green-600">
//                 ✓ {getTruckNo(t)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
//     </div>
//   );
// }

// export default GateKeeper;///////////final codeeeeeeeeee

/////////////////////////////////////


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import truckImage from './assets/Truck.png.png';
// import { useNavigate } from 'react-router-dom';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// function GateKeeper() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     truckNo: '',
//     dispatchDate: new Date().toISOString().split('T')[0],
//     invoiceNo: '',
//     remarks: 'This is a system-generated remark.',
//   });

//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('');
//   const [truckNumbers, setTruckNumbers] = useState([]);
//   const [checkedInTrucks, setCheckedInTrucks] = useState([]);
//   const [quantityPanels, setQuantityPanels] = useState([]);
//   const [fromPlant, setFromPlant] = useState('—');
//   const [nextPlant, setNextPlant] = useState('—');

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     const role = localStorage.getItem('role');
//     const allowedPlantsRaw = localStorage.getItem('allowedPlants') || '';
//     const allowedPlants = allowedPlantsRaw.split(',').map(p => p.trim()).filter(Boolean);

//     axios.get(`${API_URL}/api/plants`, {
//       headers: { userid: userId, role }
//     })
//       .then(res => {
//         const filtered = res.data.filter(plant => {
//           const pid = String(plant.PlantID || plant.PlantId || plant.plantid || '');
//           return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
//         });
//         setPlantList(filtered);
//       })
//       .catch(err => {
//         console.error('❌ Error fetching plants:', err);
//         toast.error('Failed to fetch plant list');
//       });
//   }, []);

//   useEffect(() => {
//     if (!selectedPlant) return;

//     setFormData(prev => ({
//       ...prev,
//       truckNo: '',
//       dispatchDate: new Date().toISOString().split('T')[0],
//       invoiceNo: '',
//       remarks: 'This is a system-generated remark.'
//     }));
//     setCheckedInTrucks([]);
//     setQuantityPanels([]);

//     axios.get(`${API_URL}/api/trucks?plantName=${selectedPlant}`)
//       .then(res => setTruckNumbers(res.data))
//       .catch(err => console.error('Error fetching trucks:', err));

//     axios.get(`${API_URL}/api/checked-in-trucks?plantName=${selectedPlant}`)
//       .then(res => setCheckedInTrucks(res.data))
//       .catch(err => console.error('Error fetching checked-in trucks:', err));
//   }, [selectedPlant]);

//   const getTruckNo = truck => truck.TruckNo || truck.truckno || truck.truck_no || '';
//   const getPlantName = plant => typeof plant === 'string' ? plant : (plant.PlantName || plant.plantname || 'Unknown');

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const handlePlantChange = (e) => {
//     setSelectedPlant(e.target.value);
//   };

//   const handleTruckSelect = async (truckNo) => {
//     setFormData(prev => ({ ...prev, truckNo }));

//     try {
//       const remarksRes = await axios.get(`${API_URL}/api/fetch-remarks`, {
//         params: { plantName: selectedPlant, truckNo }
//       });
//       const quantityRes = await axios.get(`${API_URL}/api/truck-plant-quantities?truckNo=${truckNo}`);
//       const sorted = [...quantityRes.data].sort((a, b) => a.priority - b.priority);
//       setQuantityPanels(sorted);

//       setFormData(prev => ({
//         ...prev,
//         remarks: remarksRes.data.remarks || 'No remarks available.',
//       }));

//       const currentIndex = sorted.findIndex(p => p.plantname === selectedPlant);
//       setFromPlant(currentIndex > 0 ? sorted[currentIndex - 1]?.plantname : '—');
//       setNextPlant(currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1]?.plantname : '—');
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setFormData(prev => ({ ...prev, remarks: 'No remarks available or error fetching remarks.' }));
//     }
//   };

//   const handleCheckedInClick = (truckNo) => {
//     handleTruckSelect(truckNo);

//     const checkedInTruck = checkedInTrucks.find(t => getTruckNo(t) === truckNo);
    
//     if (checkedInTruck) {
//       setFormData(prev => ({
//         ...prev,
//         invoiceNo: checkedInTruck.invoiceNo || '',  // Set invoice number
//       }));
//     }
//   };

//   const handleSubmit = async (type) => {
//     const { truckNo, dispatchDate, invoiceNo } = formData;

//     if (!selectedPlant) return toast.warn('Please select a plant first.');
//     if (!truckNo) return toast.warn('🚛 Please select a truck number.');
//     if (type === 'Check Out' && !invoiceNo) return toast.warn('🚨 Please enter an invoice number before checking out.');

//     try {
//       const priorityRes = await axios.get(`${API_URL}/api/check-priority-status`, {
//         params: { truckNo, plantName: selectedPlant }
//       });
//       const { hasPending, canProceed, nextPriority, nextPlant } = priorityRes.data;

//       if (hasPending && !canProceed) {
//         return toast.error(`🚫 Priority ${nextPriority} at ${nextPlant} must be completed first.`);
//       }
//     } catch (error) {
//       console.error('Priority check error:', error);
//       toast.error('❌ Error checking priority status');
//       return;
//     }

//     if (type === 'Check In' && checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
//       return toast.error('🚫 This truck is already checked in!');
//     }

//     if (type === 'Check Out' && !checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
//       return toast.warn('🚛 Please check in the truck first before checking out.');
//     }

//     try {
//       const response = await axios.post(`${API_URL}/api/update-truck-status`, {
//         truckNo,
//         plantName: selectedPlant,
//         type,
//         dispatchDate,
//         invoicenumber: type === 'Check Out' ? invoiceNo : '',  
//         quantity: quantityPanels.reduce((acc, p) => acc + (p.quantity || 0), 0),
//       });

//       if (response.data.message?.includes('✅')) {
//         setTruckNumbers(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         if (type === 'Check Out') {
//           setCheckedInTrucks(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         } else {
//           setCheckedInTrucks(prev => [...prev, { TruckNo: truckNo, invoiceNo }]);
//         }

//         toast.success(response.data.message);
//         setFormData(prev => ({ ...prev, truckNo: '', invoiceNo: '' }));
//         setQuantityPanels([]);
//       } else {
//         toast.error(response.data.message || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       toast.error(err.response?.data?.message || 'Something went wrong.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6">
//       <CancelButton />
//       <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
//         {/* Left Panel */}
//         <div className="space-y-4">
//           <select value={selectedPlant} onChange={handlePlantChange} className="w-full border rounded px-4 py-2">
//             <option value="">Select Plant</option>
//             {plantList.map((plant, i) => (
//               <option key={i} value={getPlantName(plant)}>{getPlantName(plant)}</option>
//             ))}
//           </select>

//           <div className="bg-blue-100 rounded p-4 h-64 overflow-y-auto">
//             <h3 className="font-bold text-blue-700">Truck List</h3>
//             {truckNumbers.length === 0 && <p className="text-gray-400 italic">No trucks available</p>}
//             <ul>
//               {truckNumbers.map((t, i) => (
//                 <li key={i} onClick={() => handleTruckSelect(getTruckNo(t))} className="cursor-pointer hover:text-blue-600">
//                   🚛 {getTruckNo(t)}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         {/* Center Panel */}
//         <div className="space-y-4">
//           <div className="relative h-56 w-full bg-blue-200 rounded-lg overflow-hidden shadow-md">
//             <div className="absolute bottom-[51px] left-[50px] h-[75px] w-[calc(100%-170px)] max-w-[370px] flex items-end gap-[2px] z-10">
//               {quantityPanels.map((panel, index) => {
//                 const height = Math.max(...quantityPanels.map(p => p.quantity || 0), 0) ? (panel.quantity / Math.max(...quantityPanels.map(p => p.quantity || 0))) * 100 : 0;
//                 const bgColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
//                 return (
//                   <div
//                     key={index}
//                     className={`flex flex-col items-center justify-end text-white text-[10px] ${bgColors[index % bgColors.length]} rounded-t-md transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer`}
//                     style={{ height: `${height}%`, width: `${100 / quantityPanels.length}%` }}
//                     title={`${panel.plantname}: ${panel.quantity}`}
//                   >
//                     <div className="flex items-center gap-[2px]">
//                       <span>📦</span>
//                       <span>{panel.quantity}</span>
//                     </div>
//                     <div className="whitespace-nowrap text-[8px]">{panel.plantname}</div>
//                   </div>
//                 );
//               })}
//             </div>
//             <img src={truckImage} alt="Truck" className="absolute bottom-0 left-0 w-full h-auto object-contain z-0" style={{ height: '65%' }} />
//           </div>

//           <div className="col-span-3 flex justify-center gap-6 font-semibold text-sm">
//             <div>From: <span className="text-blue-800">{fromPlant}</span></div>
//             <div>Next: <span className="text-green-800">{nextPlant}</span></div>
//           </div>

//           <input name="truckNo" value={formData.truckNo} onChange={handleChange} placeholder="Truck No" className="w-full border px-4 py-2 rounded" />
//           <input name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleChange} className="w-full border px-4 py-2 rounded" />

//           {/* Invoice Number (conditionally displayed for Checkout) */}
//           {checkedInTrucks.some(t => getTruckNo(t) === formData.truckNo) && (
//             <input 
//               name="invoiceNo" 
//               value={formData.invoiceNo} 
//               onChange={handleChange} 
//               placeholder="Invoice No" 
//               className="w-full border px-4 py-2 rounded" 
//             />
//           )}

//           <textarea name="remarks" readOnly value={formData.remarks} className="w-full border px-4 py-2 bg-gray-100 rounded" rows="3" />

//           <div className="flex gap-4">
//             <button onClick={() => handleSubmit('Check In')} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Check In</button>
//             <button onClick={() => handleSubmit('Check Out')} className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700">Check Out</button>
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="bg-green-100 rounded p-4 h-full overflow-y-auto">
//           <h3 className="font-bold text-green-700 mb-2">Checked In Trucks</h3>
//           {checkedInTrucks.length === 0 && <p className="text-gray-400 italic">No checked-in trucks</p>}
//           <ul>
//             {checkedInTrucks.map((t, i) => (
//               <li key={i} onClick={() => handleCheckedInClick(getTruckNo(t))} className="cursor-pointer hover:text-green-600">
//                 ✓ {getTruckNo(t)}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//       <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
//     </div>
//   );
// }

// export default GateKeeper;/////fully woking codeeeee


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import truckImage from './assets/Truck.png.png'; // Ensure this path is correct
// import { useNavigate } from 'react-router-dom';
// import CancelButton from './CancelButton';

// const API_URL = import.meta.env.VITE_API_URL;

// function GateKeeper() {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     truckNo: '',
//     dispatchDate: new Date().toISOString().split('T')[0],
//     invoiceNo: '',
//     remarks: 'This is a system-generated remark.',
//   });

//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlant, setSelectedPlant] = useState('');
//   const [truckNumbers, setTruckNumbers] = useState([]);
//   const [checkedInTrucks, setCheckedInTrucks] = useState([]);
//   const [quantityPanels, setQuantityPanels] = useState([]);
//   const [fromPlant, setFromPlant] = useState('—');
//   const [nextPlant, setNextPlant] = useState('—');

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     const role = localStorage.getItem('role');
//     const allowedPlantsRaw = localStorage.getItem('allowedPlants') || '';
//     const allowedPlants = allowedPlantsRaw.split(',').map(p => p.trim()).filter(Boolean);

//     axios.get(`${API_URL}/api/plants`, {
//       headers: { userid: userId, role }
//     })
//       .then(res => {
//         const filtered = res.data.filter(plant => {
//           const pid = String(plant.PlantID || plant.PlantId || plant.plantid || '');
//           return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
//         });
//         setPlantList(filtered);
//       })
//       .catch(err => {
//         console.error('❌ Error fetching plants:', err);
//         toast.error('Failed to fetch plant list');
//       });
//   }, []);

//   useEffect(() => {
//     if (!selectedPlant) return;
//     setFormData(prev => ({
//       ...prev,
//       truckNo: '',
//       dispatchDate: new Date().toISOString().split('T')[0],
//       invoiceNo: '',
//       remarks: 'This is a system-generated remark.'
//     }));
//     setCheckedInTrucks([]);
//     setQuantityPanels([]);

//     axios.get(`${API_URL}/api/trucks?plantName=${selectedPlant}`)
//       .then(res => setTruckNumbers(res.data))
//       .catch(err => console.error('Error fetching trucks:', err));

//     axios.get(`${API_URL}/api/checked-in-trucks?plantName=${selectedPlant}`)
//       .then(res => setCheckedInTrucks(res.data))
//       .catch(err => console.error('Error fetching checked-in trucks:', err));
//   }, [selectedPlant]);

//   const getTruckNo = truck => truck.TruckNo || truck.truckno || truck.truck_no || '';
//   const getPlantName = plant => typeof plant === 'string' ? plant : (plant.PlantName || plant.plantname || 'Unknown');

//   const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

//   const handlePlantChange = (e) => {
//     setSelectedPlant(e.target.value);
//   };

//   const handleTruckSelect = async (truckNo) => {
//     setFormData(prev => ({ ...prev, truckNo }));
//     try {
//       const remarksRes = await axios.get(`${API_URL}/api/fetch-remarks`, {
//         params: { plantName: selectedPlant, truckNo }
//       });
//       const quantityRes = await axios.get(`${API_URL}/api/truck-plant-quantities?truckNo=${truckNo}`);
//       const sorted = [...quantityRes.data].sort((a, b) => a.priority - b.priority);
//       setQuantityPanels(sorted);
//       setFormData(prev => ({
//         ...prev,
//         remarks: remarksRes.data.remarks || 'No remarks available.',
//       }));
//       const currentIndex = sorted.findIndex(p => p.plantname === selectedPlant);
//       setFromPlant(currentIndex > 0 ? sorted[currentIndex - 1]?.plantname : '—');
//       setNextPlant(currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1]?.plantname : '—');
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setFormData(prev => ({ ...prev, remarks: 'No remarks available or error fetching remarks.' }));
//     }
//   };

//   const handleCheckedInClick = (truckNo) => {
//     handleTruckSelect(truckNo);
//     const checkedInTruck = checkedInTrucks.find(t => getTruckNo(t) === truckNo);
//     if (checkedInTruck) {
//       setFormData(prev => ({
//         ...prev,
//         invoiceNo: checkedInTruck.invoiceNo || '',  // Set invoice number
//       }));
//     }
//   };

//   const handleSubmit = async (type) => {
//     const { truckNo, dispatchDate, invoiceNo } = formData;
//     if (!selectedPlant) return toast.warn('Please select a plant first.');
//     if (!truckNo) return toast.warn('🚛 Please select a truck number.');
//     if (type === 'Check Out' && !invoiceNo) return toast.warn('🚨 Please enter an invoice number before checking out.');

//     try {
//       const priorityRes = await axios.get(`${API_URL}/api/check-priority-status`, {
//         params: { truckNo, plantName: selectedPlant }
//       });
//       const { hasPending, canProceed, nextPriority, nextPlant } = priorityRes.data;
//       if (hasPending && !canProceed) {
//         return toast.error(`🚫 Priority ${nextPriority} at ${nextPlant} must be completed first.`);
//       }
//     } catch (error) {
//       console.error('Priority check error:', error);
//       toast.error('❌ Error checking priority status');
//       return;
//     }

//     if (type === 'Check In' && checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
//       return toast.error('🚫 This truck is already checked in!');
//     }

//     if (type === 'Check Out' && !checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
//       return toast.warn('🚛 Please check in the truck first before checking out.');
//     }

//     try {
//       const response = await axios.post(`${API_URL}/api/update-truck-status`, {
//         truckNo,
//         plantName: selectedPlant,
//         type,
//         dispatchDate,
//         invoicenumber: type === 'Check Out' ? invoiceNo : '',
//         quantity: quantityPanels.reduce((acc, p) => acc + (p.quantity || 0), 0),
//       });

//       if (response.data.message?.includes('✅')) {
//         setTruckNumbers(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         if (type === 'Check Out') {
//           setCheckedInTrucks(prev => prev.filter(t => getTruckNo(t) !== truckNo));
//         } else {
//           setCheckedInTrucks(prev => [...prev, { TruckNo: truckNo, invoiceNo }]);
//         }
//         toast.success(response.data.message);
//         setFormData(prev => ({ ...prev, truckNo: '', invoiceNo: '' }));
//         setQuantityPanels([]);
//       } else {
//         toast.error(response.data.message || 'Failed to update status');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       toast.error(err.response?.data?.message || 'Something went wrong.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-6">
//       <CancelButton />
//       <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
//         {/* Left Panel */}
//         <div className="space-y-4">
//           <select value={selectedPlant} onChange={handlePlantChange} className="w-full border rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
//             <option value="">Select Plant</option>
//             {plantList.map((plant, i) => (
//               <option key={i} value={getPlantName(plant)}>{getPlantName(plant)}</option>
//             ))}
//           </select>

//           <div className="bg-blue-50 rounded-lg p-4 h-64 overflow-y-auto border border-blue-100">
//             <h3 className="font-bold text-blue-700 mb-2">🚚 Truck List</h3>
//             {truckNumbers.length === 0 && <p className="text-gray-400 italic">No trucks available</p>}
//             <ul className="space-y-2">
//               {truckNumbers.map((t, i) => {
//                 const truckNo = getTruckNo(t);
//                 return (
//                   <li key={i}>
//                     <button
//                       onClick={() => handleTruckSelect(truckNo)}
//                       className={`w-full text-left p-3 rounded-md border transition-all ${
//                         formData.truckNo === truckNo
//                           ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-200'
//                           : 'hover:bg-gray-100 border-gray-200'
//                       }`}
//                     >
//                       <span className="flex items-center gap-2 font-medium">
//                         🚛 {truckNo}
//                       </span>
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         </div>

//         {/* Center Panel */}
//         <div className="space-y-4">
//           <div className="relative h-56 w-full bg-blue-100 rounded-lg overflow-hidden shadow-md">
//             <div className="absolute bottom-[51px] left-[50px] h-[75px] w-[calc(100%-170px)] max-w-[370px] flex items-end gap-[2px] z-10">
//               {quantityPanels.map((panel, index) => {
//                 const maxHeight = Math.max(...quantityPanels.map(p => p.quantity || 0), 1);
//                 const heightPercent = (panel.quantity / maxHeight) * 100;
//                 const bgColors = ['bg-green-500', 'bg-blue-500', 'bg-yellow-500', 'bg-red-500'];
//                 return (
//                   <div
//                     key={index}
//                     className={`flex flex-col items-center justify-end text-white text-xs ${bgColors[index % bgColors.length]} rounded-t-md transition-transform transform hover:scale-110 hover:shadow-lg cursor-pointer`}
//                     style={{ height: `${heightPercent}%`, width: `${100 / quantityPanels.length}%` }}
//                     title={`${panel.plantname}: ${panel.quantity}`}
//                   >
//                     <div className="flex items-center gap-1">
//                       <span>📦</span>
//                       <span>{panel.quantity}</span>
//                     </div>
//                     <div className="whitespace-nowrap text-[9px]">{panel.plantname}</div>
//                   </div>
//                 );
//               })}
//             </div>
//             <img src={truckImage} alt="Truck" className="absolute bottom-0 left-0 w-full h-auto object-contain z-0" style={{ height: '65%' }} />
//           </div>

//           <div className="col-span-3 flex justify-center gap-6 font-semibold text-sm">
//             <div>From: <span className="text-blue-800">{fromPlant}</span></div>
//             <div>Next: <span className="text-green-800">{nextPlant}</span></div>
//           </div>

//           <input name="truckNo" value={formData.truckNo} onChange={handleChange} placeholder="Truck No" className="w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" readOnly />

//           <input name="dispatchDate" type="date" value={formData.dispatchDate} onChange={handleChange} className="w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400" />

//           {checkedInTrucks.some(t => getTruckNo(t) === formData.truckNo) && (
//             <input 
//               name="invoiceNo" 
//               value={formData.invoiceNo} 
//               onChange={handleChange} 
//               placeholder="Invoice No" 
//               className="w-full border px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />
//           )}

//           <textarea name="remarks" readOnly value={formData.remarks} className="w-full border px-4 py-2 bg-gray-100 rounded-md" rows="3" />

//           <div className="flex gap-4">
//             <button onClick={() => handleSubmit('Check In')} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-md shadow hover:shadow-md hover:from-green-600 hover:to-green-700 transition">Check In</button>
//             <button onClick={() => handleSubmit('Check Out')} className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-2 rounded-md shadow hover:shadow-md hover:from-red-600 hover:to-red-700 transition">Check Out</button>
//           </div>
//         </div>

//         {/* Right Panel */}
//         <div className="bg-green-50 rounded-lg p-4 h-full overflow-y-auto border border-green-100">
//           <h3 className="font-bold text-green-700 mb-2">✅ Checked In Trucks</h3>
//           {checkedInTrucks.length === 0 && <p className="text-gray-400 italic">No checked-in trucks</p>}
//           <ul className="space-y-2">
//             {checkedInTrucks.map((t, i) => {
//               const truckNo = getTruckNo(t);
//               return (
//                 <li key={i}>
//                   <button
//                     onClick={() => handleCheckedInClick(truckNo)}
//                     className={`w-full text-left p-3 rounded-md border transition-all ${
//                       formData.truckNo === truckNo
//                         ? 'bg-green-100 border-green-400 ring-2 ring-green-200'
//                         : 'hover:bg-gray-100 border-gray-200'
//                     }`}
//                   >
//                     <span className="flex items-center gap-2 font-medium">
//                       ✓ {truckNo}
//                     </span>
//                   </button>
//                 </li>
//               );
//             })}
//           </ul>
//         </div>
//       </div>
//       <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
//     </div>
//   );
// }

// export default GateKeeper; //////////bgg

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import truckImage from './assets/Truck.png.png';
import { useNavigate } from 'react-router-dom';
import CancelButton from './CancelButton';

const API_URL = import.meta.env.VITE_API_URL;

function GateKeeper() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    truckNo: '',
    dispatchDate: new Date().toISOString().split('T')[0],
    invoiceNo: '',
    remarks: 'This is a system-generated remark.',
  });

  const [plantList, setPlantList] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState('');
  const [truckNumbers, setTruckNumbers] = useState([]);
  const [checkedInTrucks, setCheckedInTrucks] = useState([]);
  const [quantityPanels, setQuantityPanels] = useState([]);
  const [fromPlant, setFromPlant] = useState('—');
  const [nextPlant, setNextPlant] = useState('—');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    const allowedPlantsRaw = localStorage.getItem('allowedPlants') || '';
    const allowedPlants = allowedPlantsRaw.split(',').map(p => p.trim()).filter(Boolean);

    setIsLoading(true);
    axios.get(`${API_URL}/api/plants`, {
      headers: { userid: userId, role }
    })
      .then(res => {
        const filtered = res.data.filter(plant => {
          const pid = String(plant.PlantID || plant.PlantId || plant.plantid || '');
          return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
        });
        setPlantList(filtered);
      })
      .catch(err => {
        console.error('❌ Error fetching plants:', err);
        toast.error('Failed to fetch plant list');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedPlant) return;
    
    setIsLoading(true);
    setFormData(prev => ({
      ...prev,
      truckNo: '',
      dispatchDate: new Date().toISOString().split('T')[0],
      invoiceNo: '',
      remarks: 'This is a system-generated remark.'
    }));
    setCheckedInTrucks([]);
    setQuantityPanels([]);

    Promise.all([
      axios.get(`${API_URL}/api/trucks?plantName=${selectedPlant}`),
      axios.get(`${API_URL}/api/checked-in-trucks?plantName=${selectedPlant}`)
    ])
      .then(([trucksRes, checkedInRes]) => {
        setTruckNumbers(trucksRes.data);
        setCheckedInTrucks(checkedInRes.data);
      })
      .catch(err => {
        console.error('Error fetching truck data:', err);
        toast.error('Failed to load truck data');
      })
      .finally(() => setIsLoading(false));
  }, [selectedPlant]);

  const getTruckNo = truck => truck.TruckNo || truck.truckno || truck.truck_no || '';
  const getPlantName = plant => typeof plant === 'string' ? plant : (plant.PlantName || plant.plantname || 'Unknown');

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePlantChange = (e) => {
    setSelectedPlant(e.target.value);
  };

  const handleTruckSelect = async (truckNo) => {
    setIsLoading(true);
    setFormData(prev => ({ ...prev, truckNo }));
    try {
      const [remarksRes, quantityRes] = await Promise.all([
        axios.get(`${API_URL}/api/fetch-remarks`, {
          params: { plantName: selectedPlant, truckNo }
        }),
        axios.get(`${API_URL}/api/truck-plant-quantities?truckNo=${truckNo}`)
      ]);
      
      const sorted = [...quantityRes.data].sort((a, b) => a.priority - b.priority);
      setQuantityPanels(sorted);
      setFormData(prev => ({
        ...prev,
        remarks: remarksRes.data.remarks || 'No remarks available.',
      }));
      
      const currentIndex = sorted.findIndex(p => p.plantname === selectedPlant);
      setFromPlant(currentIndex > 0 ? sorted[currentIndex - 1]?.plantname : '—');
      setNextPlant(currentIndex >= 0 && currentIndex < sorted.length - 1 ? sorted[currentIndex + 1]?.plantname : '—');
    } catch (err) {
      console.error('Error fetching data:', err);
      setFormData(prev => ({ ...prev, remarks: 'No remarks available or error fetching remarks.' }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckedInClick = (truckNo) => {
    handleTruckSelect(truckNo);
    const checkedInTruck = checkedInTrucks.find(t => getTruckNo(t) === truckNo);
    if (checkedInTruck) {
      setFormData(prev => ({
        ...prev,
        invoiceNo: checkedInTruck.invoiceNo || '',
      }));
    }
  };

  const handleSubmit = async (type) => {
    const { truckNo, dispatchDate, invoiceNo } = formData;
    if (!selectedPlant) return toast.warn('Please select a plant first.');
    if (!truckNo) return toast.warn('🚛 Please select a truck number.');
    if (type === 'Check Out' && !invoiceNo) return toast.warn('🚨 Please enter an invoice number before checking out.');

    setIsLoading(true);
    try {
      const priorityRes = await axios.get(`${API_URL}/api/check-priority-status`, {
        params: { truckNo, plantName: selectedPlant }
      });
      const { hasPending, canProceed, nextPriority, nextPlant } = priorityRes.data;
      if (hasPending && !canProceed) {
        toast.error(`🚫 Priority ${nextPriority} at ${nextPlant} must be completed first.`);
        return;
      }

      if (type === 'Check In' && checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
        toast.error('🚫 This truck is already checked in!');
        return;
      }

      if (type === 'Check Out' && !checkedInTrucks.some(t => getTruckNo(t) === truckNo)) {
        toast.warn('🚛 Please check in the truck first before checking out.');
        return;
      }

      const response = await axios.post(`${API_URL}/api/update-truck-status`, {
        truckNo,
        plantName: selectedPlant,
        type,
        dispatchDate,
        invoicenumber: type === 'Check Out' ? invoiceNo : '',
        quantity: quantityPanels.reduce((acc, p) => acc + (p.quantity || 0), 0),
      });

      if (response.data.message?.includes('✅')) {
        setTruckNumbers(prev => prev.filter(t => getTruckNo(t) !== truckNo));
        if (type === 'Check Out') {
          setCheckedInTrucks(prev => prev.filter(t => getTruckNo(t) !== truckNo));
        } else {
          setCheckedInTrucks(prev => [...prev, { TruckNo: truckNo, invoiceNo }]);
        }
        toast.success(response.data.message);
        setFormData(prev => ({ ...prev, truckNo: '', invoiceNo: '' }));
        setQuantityPanels([]);
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error:', err);
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 p-4 md:p-6">
      <CancelButton />
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="space-y-6">
          <div className="relative">
            <select 
              value={selectedPlant} 
              onChange={handlePlantChange} 
              className="w-full border-2 border-blue-200 rounded-xl px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              disabled={isLoading}
            >
              <option value="">Select Plant</option>
              {plantList.map((plant, i) => (
                <option key={i} value={getPlantName(plant)}>{getPlantName(plant)}</option>
              ))}
            </select>
            {isLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-xl">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-4 h-64 overflow-y-auto border-2 border-blue-200 shadow-inner">
            <h3 className="font-bold text-blue-800 mb-3 text-lg flex items-center gap-2">
              <span className="bg-blue-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1v-2a1 1 0 00-.293-.707l-3-3A1 1 0 0016 7h-1V5a1 1 0 00-1-1H3z" />
                </svg>
              </span>
              Available Trucks
            </h3>
            {truckNumbers.length === 0 ? (
              <div className="text-center py-8 text-gray-500 italic">
                {selectedPlant ? 'No trucks available' : 'Select a plant to view trucks'}
              </div>
            ) : (
              <ul className="space-y-2">
                {truckNumbers.map((t, i) => {
                  const truckNo = getTruckNo(t);
                  return (
                    <li key={i}>
                      <button
                        onClick={() => handleTruckSelect(truckNo)}
                        disabled={isLoading}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                          formData.truckNo === truckNo
                            ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-200 shadow-md'
                            : 'hover:bg-blue-50 border-blue-100 hover:border-blue-300'
                        } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        <span className="bg-blue-200 p-1 rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <span className="font-medium text-blue-900">Truck {truckNo}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Center Panel */}
        <div className="space-y-6">
          <div className="relative h-56 w-full bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl overflow-hidden shadow-lg border-2 border-blue-200">
            <div className="absolute bottom-[51px] left-[50px] h-[75px] w-[calc(100%-170px)] max-w-[370px] flex items-end gap-1 z-10">
              {quantityPanels.map((panel, index) => {
                const maxHeight = Math.max(...quantityPanels.map(p => p.quantity || 0), 1);
                const heightPercent = (panel.quantity / maxHeight) * 100;
                const bgColors = [
                  'bg-gradient-to-b from-green-400 to-green-600',
                  'bg-gradient-to-b from-blue-400 to-blue-600',
                  'bg-gradient-to-b from-yellow-400 to-yellow-600',
                  'bg-gradient-to-b from-red-400 to-red-600'
                ];
                return (
                  <div
                    key={index}
                    className={`flex flex-col items-center justify-end text-white text-xs ${bgColors[index % bgColors.length]} rounded-t-lg transition-all transform hover:scale-110 hover:shadow-xl cursor-pointer`}
                    style={{ 
                      height: `${heightPercent}%`, 
                      width: `${100 / quantityPanels.length}%`,
                      minWidth: '20px'
                    }}
                    title={`${panel.plantname}: ${panel.quantity} panels`}
                  >
                    <div className="flex flex-col items-center p-1">
                      <span className="font-bold">{panel.quantity}</span>
                      <span className="text-[8px] text-center leading-tight">{panel.plantname.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <img 
              src={truckImage} 
              alt="Truck" 
              className="absolute bottom-0 left-0 w-full h-auto object-contain z-0" 
              style={{ height: '65%' }} 
            />
            {quantityPanels.length > 0 && (
              <div className="absolute top-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded text-xs font-semibold text-blue-800">
                Total: {quantityPanels.reduce((acc, p) => acc + (p.quantity || 0), 0)} panels
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-xl border-2 border-blue-100">
              <div className="text-xs text-blue-600 font-medium mb-1">From Plant</div>
              <div className="text-blue-800 font-bold truncate">{fromPlant}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border-2 border-green-100">
              <div className="text-xs text-green-600 font-medium mb-1">Next Plant</div>
              <div className="text-green-800 font-bold truncate">{nextPlant}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Truck Number</label>
              <input 
                name="truckNo" 
                value={formData.truckNo} 
                onChange={handleChange} 
                placeholder="Truck No" 
                className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                readOnly 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Dispatch Date</label>
                <input 
                  name="dispatchDate" 
                  type="date" 
                  value={formData.dispatchDate} 
                  onChange={handleChange} 
                  className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all" 
                />
              </div>
              
              {checkedInTrucks.some(t => getTruckNo(t) === formData.truckNo) && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Invoice No</label>
                  <input 
                    name="invoiceNo" 
                    value={formData.invoiceNo} 
                    onChange={handleChange} 
                    placeholder="Invoice No" 
                    className="w-full border-2 border-gray-200 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                  />
                </div>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea 
                name="remarks" 
                readOnly 
                value={formData.remarks} 
                className="w-full border-2 border-gray-200 px-4 py-2 bg-gray-50 rounded-lg shadow-sm" 
                rows="3" 
              />
            </div>

            <div className="flex gap-4 pt-2">
              <button 
                onClick={() => handleSubmit('Check In')} 
                disabled={isLoading || !formData.truckNo}
                className={`flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 ${
                  isLoading || !formData.truckNo ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Check In
                  </>
                )}
              </button>
              <button 
                onClick={() => handleSubmit('Check Out')} 
                disabled={isLoading || !formData.truckNo}
                className={`flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-xl shadow-lg hover:shadow-xl hover:from-red-600 hover:to-red-700 transition-all flex items-center justify-center gap-2 ${
                  isLoading || !formData.truckNo ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Check Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-gradient-to-b from-green-50 to-green-100 rounded-xl p-4 h-full overflow-y-auto border-2 border-green-200 shadow-inner">
          <h3 className="font-bold text-green-800 mb-3 text-lg flex items-center gap-2">
            <span className="bg-green-100 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </span>
            Checked In Trucks
          </h3>
          {checkedInTrucks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 italic">
              {selectedPlant ? 'No checked-in trucks' : 'Select a plant to view checked-in trucks'}
            </div>
          ) : (
            <ul className="space-y-2">
              {checkedInTrucks.map((t, i) => {
                const truckNo = getTruckNo(t);
                return (
                  <li key={i}>
                    <button
                      onClick={() => handleCheckedInClick(truckNo)}
                      disabled={isLoading}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                        formData.truckNo === truckNo
                          ? 'bg-green-100 border-green-400 ring-2 ring-green-200 shadow-md'
                          : 'hover:bg-green-50 border-green-100 hover:border-green-300'
                      } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <span className="bg-green-200 p-1 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span className="font-medium text-green-900">Truck {truckNo}</span>
                      {t.invoiceNo && (
                        <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                          Inv: {t.invoiceNo}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
      <ToastContainer 
        position="top-center" 
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default GateKeeper;
