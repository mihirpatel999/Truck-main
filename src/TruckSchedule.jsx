// import React, { useState } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const fetchData = async (selectedStatus) => {
//     if (!fromDate || !toDate) {
//       setError('Please select dates');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setStatus(selectedStatus);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: selectedStatus,
//         },
//       });
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 flex flex-col items-center">
//       <h1 className="text-3xl font-bold text-indigo-700 mb-6">🚚 Truck Schedule</h1>

//       <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-lg mb-6 w-full max-w-4xl">
//         <div>
//           <label className="block text-sm font-medium">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
//           />
//         </div>

//         <div className="flex gap-2 mt-6 sm:mt-0">
//           {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map((btn) => (
//             <button
//               key={btn}
//               onClick={() => fetchData(btn)}
//               className={`px-4 py-2 rounded-lg font-semibold ${
//                 status === btn ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
//               } hover:bg-indigo-200`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="relative bg-white shadow-xl rounded-2xl p-6 w-full max-w-5xl text-center">
//       <img src={truckImage} alt="Truck" className="mx-auto h-40 mb-4" />


//         {loading && <p className="text-indigo-600 font-medium">Loading...</p>}
//         {error && <p className="text-red-500 font-medium">{error}</p>}
//         {!loading && data.length === 0 && !error && (
//           <p className="text-gray-500">No trucks found for selected filters</p>
//         )}

//         {data.length > 0 && (
//           <table className="min-w-full mt-4 border border-gray-300 rounded-xl overflow-hidden text-left">
//             <thead className="bg-indigo-100 text-indigo-700">
//               <tr>
//                 <th className="px-4 py-2">Truck No.</th>
//                 <th className="px-4 py-2">Plant</th>
//                 <th className="px-4 py-2">Check-In Time</th>
//                 <th className="px-4 py-2">Check-Out Time</th>
//                 <th className="px-4 py-2">Loading Slip</th>
//                 <th className="px-4 py-2">Qty</th>
//                 <th className="px-4 py-2">Freight</th>
//                 <th className="px-4 py-2">Priority</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, i) => (
//                 <tr key={i} className="odd:bg-gray-50">
//                   <td className="px-4 py-2">{item.truckNo || '—'}</td>
//                   <td className="px-4 py-2">{item.plantName || '—'}</td>
//                   <td className="px-4 py-2">
//                     {item.checkInTime ? new Date(item.checkInTime).toLocaleString() : '—'}
//                   </td>
//                   <td className="px-4 py-2">
//                     {item.checkOutTime ? new Date(item.checkOutTime).toLocaleString() : '—'}
//                   </td>
//                   <td className="px-4 py-2">{item.loadingSlipNo || '—'}</td>
//                   <td className="px-4 py-2">{item.qty ?? '—'}</td>
//                   <td className="px-4 py-2">{item.freight ?? '—'}</td>
//                   <td className="px-4 py-2">{item.priority ?? '—'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

/////////////////////////



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [plantList, setPlantList] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     axios.get(`${API_URL}/api/plants`).then((res) => {
//       setPlantList(res.data);
//       setSelectedPlants(res.data.map((p) => p.name)); // Default select all
//     });
//   }, []);

//   const handleSelectAll = () => {
//     setSelectedPlants(plantList.map((p) => p.name));
//   };

//   const handleDeselectAll = () => {
//     setSelectedPlants([]);
//   };

//   const handleCheckboxChange = (plantName) => {
//     setSelectedPlants((prev) =>
//       prev.includes(plantName)
//         ? prev.filter((p) => p !== plantName)
//         : [...prev, plantName]
//     );
//   };

//   const fetchData = async (selectedStatus) => {
//     if (!fromDate || !toDate) {
//       setError('Please select dates');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setStatus(selectedStatus);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: selectedStatus,
//           plants: selectedPlants.join(',')
//         },
//       });
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 flex flex-col items-center">
//       <h1 className="text-3xl font-bold text-indigo-700 mb-6">🚚 Truck Schedule</h1>

//       <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-lg mb-4 w-full max-w-5xl">
//         <div>
//           <label className="block text-sm font-medium">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="border rounded-lg px-3 py-2"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="border rounded-lg px-3 py-2"
//           />
//         </div>
//         <div className="flex gap-2 mt-6 sm:mt-0">
//           {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map((btn) => (
//             <button
//               key={btn}
//               onClick={() => fetchData(btn)}
//               className={`px-4 py-2 rounded-lg font-semibold ${
//                 status === btn ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
//               }`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-5xl mb-4">
//         <h2 className="text-lg font-semibold mb-2">Select Plants</h2>
//         <div className="flex gap-4 mb-2">
//           <button onClick={handleSelectAll} className="bg-green-500 text-white px-4 py-2 rounded-lg">Select All</button>
//           <button onClick={handleDeselectAll} className="bg-red-500 text-white px-4 py-2 rounded-lg">Deselect</button>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
//           {plantList.map((plant, i) => (
//             <label key={i} className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={selectedPlants.includes(plant.name)}
//                 onChange={() => handleCheckboxChange(plant.name)}
//               />
//               {plant.name}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="relative bg-white shadow-xl rounded-2xl p-6 w-full max-w-5xl text-center">
//         <img src={truckImage} alt="Truck" className="mx-auto h-40 mb-4" />

//         {loading && <p className="text-indigo-600 font-medium">Loading...</p>}
//         {error && <p className="text-red-500 font-medium">{error}</p>}
//         {!loading && data.length === 0 && !error && (
//           <p className="text-gray-500">No trucks found for selected filters</p>
//         )}

//         {data.length > 0 && (
//           <table className="min-w-full mt-4 border border-gray-300 rounded-xl overflow-hidden text-left">
//             <thead className="bg-indigo-100 text-indigo-700">
//               <tr>
//                 <th className="px-4 py-2">Truck No.</th>
//                 <th className="px-4 py-2">Plant</th>
//                 <th className="px-4 py-2">Check-In Time</th>
//                 <th className="px-4 py-2">Check-Out Time</th>
//                 <th className="px-4 py-2">Loading Slip</th>
//                 <th className="px-4 py-2">Qty</th>
//                 <th className="px-4 py-2">Freight</th>
//                 <th className="px-4 py-2">Priority</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, i) => (
//                 <tr key={i} className="odd:bg-gray-50">
//                   <td className="px-4 py-2">{item.truckNo || '—'}</td>
//                   <td className="px-4 py-2">{item.plantName || '—'}</td>
//                   <td className="px-4 py-2">{item.checkInTime ? new Date(item.checkInTime).toLocaleString() : '—'}</td>
//                   <td className="px-4 py-2">{item.checkOutTime ? new Date(item.checkOutTime).toLocaleString() : '—'}</td>
//                   <td className="px-4 py-2">{item.loadingSlipNo || '—'}</td>
//                   <td className="px-4 py-2">{item.qty ?? '—'}</td>
//                   <td className="px-4 py-2">{item.freight ?? '—'}</td>
//                   <td className="px-4 py-2">{item.priority ?? '—'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

///////////////


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [plantList, setPlantList] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     axios.get(`${API_URL}/api/plants`, {
//       headers: {
//         userid: localStorage.getItem('userId'),
//         role: localStorage.getItem('role'),
//       },
//     }).then((res) => {
//       setPlantList(res.data);
//       setSelectedPlants(res.data.map((p) => p.plantid.toString())); // ✅ default all IDs
//     });
//   }, []);

//   const handleSelectAll = () => {
//     setSelectedPlants(plantList.map((p) => p.plantid.toString()));
//   };

//   const handleDeselectAll = () => {
//     setSelectedPlants([]);
//   };

//   const handleCheckboxChange = (plantId) => {
//     setSelectedPlants((prev) =>
//       prev.includes(plantId)
//         ? prev.filter((id) => id !== plantId)
//         : [...prev, plantId]
//     );
//   };

//   const fetchData = async (selectedStatus) => {
//     if (!fromDate || !toDate || selectedPlants.length === 0) {
//       setError('Please select all filters');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setStatus(selectedStatus);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: selectedStatus,
//           plant: JSON.stringify(selectedPlants),
//         },
//       });
//       setData(res.data);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 p-4 flex flex-col items-center">
//       <h1 className="text-3xl font-bold text-indigo-700 mb-6">🚚 Truck Schedule</h1>

//       <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-xl shadow-lg mb-4 w-full max-w-5xl">
//         <div>
//           <label className="block text-sm font-medium">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={(e) => setFromDate(e.target.value)}
//             className="border rounded-lg px-3 py-2"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={(e) => setToDate(e.target.value)}
//             className="border rounded-lg px-3 py-2"
//           />
//         </div>
//         <div className="flex gap-2 mt-6 sm:mt-0">
//           {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map((btn) => (
//             <button
//               key={btn}
//               onClick={() => fetchData(btn)}
//               className={`px-4 py-2 rounded-lg font-semibold ${
//                 status === btn ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
//               }`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-5xl mb-4">
//         <h2 className="text-lg font-semibold mb-2">Select Plants</h2>
//         <div className="flex gap-4 mb-2">
//           <button onClick={handleSelectAll} className="bg-green-500 text-white px-4 py-2 rounded-lg">Select All</button>
//           <button onClick={handleDeselectAll} className="bg-red-500 text-white px-4 py-2 rounded-lg">Deselect</button>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
//           {plantList.map((plant, i) => (
//             <label key={i} className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={selectedPlants.includes(plant.plantid.toString())}
//                 onChange={() => handleCheckboxChange(plant.plantid.toString())}
//               />
//               {plant.plantname}
//             </label>
//           ))}
//         </div>
//       </div>

//       <div className="relative bg-white shadow-xl rounded-2xl p-6 w-full max-w-5xl text-center">
//         <img src={truckImage} alt="Truck" className="mx-auto h-40 mb-4" />

//         {loading && <p className="text-indigo-600 font-medium">Loading...</p>}
//         {error && <p className="text-red-500 font-medium">{error}</p>}
//         {!loading && data.length === 0 && !error && (
//           <p className="text-gray-500">No trucks found for selected filters</p>
//         )}

//         {data.length > 0 && (
//           <table className="min-w-full mt-4 border border-gray-300 rounded-xl overflow-hidden text-left">
//             <thead className="bg-indigo-100 text-indigo-700">
//               <tr>
//                 <th className="px-4 py-2">Truck No.</th>
//                 <th className="px-4 py-2">Plant</th>
//                 <th className="px-4 py-2">Check-In Time</th>
//                 <th className="px-4 py-2">Check-Out Time</th>
//                 <th className="px-4 py-2">Loading Slip</th>
//                 <th className="px-4 py-2">Qty</th>
//                 <th className="px-4 py-2">Freight</th>
//                 <th className="px-4 py-2">Priority</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((item, i) => (
//                 <tr key={i} className="odd:bg-gray-50">
//                   <td className="px-4 py-2">{item.truckNo || '—'}</td>
//                   <td className="px-4 py-2">{item.plantName || '—'}</td>
//                   <td className="px-4 py-2">{item.checkInTime ? new Date(item.checkInTime).toLocaleString() : '—'}</td>
//                   <td className="px-4 py-2">{item.checkOutTime ? new Date(item.checkOutTime).toLocaleString() : '—'}</td>
//                   <td className="px-4 py-2">{item.loadingSlipNo || '—'}</td>
//                   <td className="px-4 py-2">{item.qty ?? '—'}</td>
//                   <td className="px-4 py-2">{item.freight ?? '—'}</td>
//                   <td className="px-4 py-2">{item.priority ?? '—'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }
///////////////////////////////////////////final working code today 


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png'; // अपनी इमेज पथ के अनुसार बदलें

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [truckSearch, setTruckSearch] = useState('');
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     axios.get(`${API_URL}/api/plants`, {
//       headers: {
//         userid: localStorage.getItem('userId'),
//         role: localStorage.getItem('role'),
//       },
//     })
//     .then(res => {
//       setPlantList(res.data);
//       setSelectedPlants(res.data.map(p => p.plantid.toString())); // default all select
//     })
//     .catch(() => setError('प्लांट लोड करने में त्रुटि'));
//   }, []);

//   const togglePlant = id =>
//     setSelectedPlants(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );
//   const selectAll = () =>
//     setSelectedPlants(plantList.map(p => p.plantid.toString()));
//   const deselectAll = () => setSelectedPlants([]);

//   const fetchData = async (st, tr = '') => {
//     if (!fromDate || !toDate || selectedPlants.length === 0) {
//       setError('कृपया सभी फिल्टर चुनें');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setStatus(st);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: st,
//           plant: JSON.stringify(selectedPlants),
//           truckNo: tr || undefined,
//         },
//       });

//       let fetched = res.data;
//       if (tr) {
//         fetched = fetched.filter(item =>
//           item.truckNo?.toLowerCase().includes(tr.toLowerCase())
//         ); // frontend fallback filter :contentReference[oaicite:1]{index=1}
//       }
//       setData(fetched);
//     } catch {
//       setError('डेटा लाने में समस्या');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen flex flex-col items-center">
//       <h1 className="text-3xl font-bold text-indigo-700 mb-6">🚚 ट्रक अनुसूची</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow w-full max-w-5xl mb-4">
//         <div>
//           <label className="block">From</label>
//           <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
//                  className="border rounded px-3 py-2"/>
//         </div>
//         <div>
//           <label className="block">To</label>
//           <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
//                  className="border rounded px-3 py-2"/>
//         </div>
//         <div className="flex gap-2">
//           {['Dispatched','InTransit','CheckedOut','All'].map(btn => (
//             <button key={btn}
//               onClick={() => fetchData(btn, truckSearch)}
//               className={`px-4 py-2 rounded font-semibold ${
//                 status === btn ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
//               }`}>
//               {btn}
//             </button>
//           ))}
//         </div>
//         <input type="text" placeholder="Truck No."
//                value={truckSearch} onChange={e => setTruckSearch(e.target.value)}
//                className="border rounded px-3 py-2 w-32"/>
//         <button onClick={() => fetchData(status, truckSearch)}
//                 className="px-4 py-2 bg-indigo-500 text-white rounded">
//           Search
//         </button>
//       </div>

//       {/* Plant selector */}
//       <div className="bg-white p-4 rounded-lg shadow w-full max-w-5xl mb-4">
//         <h2 className="text-lg font-semibold mb-2">Select Plants</h2>
//         <div className="flex gap-2 mb-2">
//           <button onClick={selectAll} className="bg-green-500 text-white px-4 py-2 rounded">
//             सब चुनें
//           </button>
//           <button onClick={deselectAll} className="bg-red-500 text-white px-4 py-2 rounded">
//             रद्द करें
//           </button>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
//           {plantList.map(p => (
//             <label key={p.plantid} className="flex items-center gap-2">
//               <input type="checkbox"
//                      checked={selectedPlants.includes(p.plantid.toString())}
//                      onChange={() => togglePlant(p.plantid.toString())}/>
//               {p.plantname}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Data display */}
//       <div className="bg-white p-6 shadow rounded-2xl w-full max-w-5xl overflow-x-auto">
//         <img src={truckImage} alt="Truck" className="mx-auto h-40 mb-4"/>

//         {loading && <p className="text-indigo-600">लोड हो रहा है…</p>}
//         {error && <p className="text-red-500">{error}</p>}
//         {!loading && !error && data.length === 0 && (
//           <p className="text-gray-500">कोई ट्रक नहीं मिला</p>
//         )}

//         {data.length > 0 && (
//           <table className="min-w-full table-auto border-collapse block md:table">
//             <thead className="bg-indigo-100 hidden md:table-header-group">
//               <tr className="table-row">
//                 {['Truck No','Plant','Check‑In','Check‑Out','Slip','Qty','Freight','Priority'].map(h => (
//                   <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="block md:table-row-group">
//               {data.map((it,i) => (
//                 <tr key={i} className="bg-white md:bg-transparent md:table-row block mb-4 md:mb-0 rounded md:rounded-none">
//                   {['truckNo','plantName','checkInTime','checkOutTime','loadingSlipNo','qty','freight','priority'].map((k,idx) => {
//                     const val = k.includes('Time') && it[k] ? new Date(it[k]).toLocaleString() : it[k] ?? '—';
//                     const label = ['Truck No','Plant','Check‑In','Check‑Out','Slip','Qty','Freight','Priority'][idx];
//                     return (
//                       <td key={k} className="px-4 py-2 block md:table-cell whitespace-normal lg:whitespace-nowrap">
//                         <span className="font-semibold md:hidden">{label}: </span>{val}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

//////////////////////


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png'; // update path if needed

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [truckSearch, setTruckSearch] = useState('');
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     axios.get(`${API_URL}/api/plants`, {
//       headers: {
//         userid: localStorage.getItem('userId'),
//         role: localStorage.getItem('role'),
//       }
//     })
//     .then(res => {
//       setPlantList(res.data);
//       setSelectedPlants(res.data.map(p => p.plantid.toString())); // default select all
//     })
//     .catch(() => setError('Failed to load plants'));
//   }, []);

//   const togglePlant = id =>
//     setSelectedPlants(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );
//   const selectAll = () =>
//     setSelectedPlants(plantList.map(p => p.plantid.toString()));
//   const deselectAll = () => setSelectedPlants([]);

//   const fetchData = async (st, tr = '') => {
//     if (!fromDate || !toDate || selectedPlants.length === 0) {
//       setError('Please select all filters');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setStatus(st);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: st,
//           plant: JSON.stringify(selectedPlants),
//           truckNo: tr || undefined,
//         },
//       });
//       let fetched = res.data;
//       if (tr) {
//         fetched = fetched.filter(item =>
//           item.truckNo?.toLowerCase().includes(tr.toLowerCase())
//         );
//       }
//       setData(fetched);
//     } catch {
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen flex flex-col items-center">
//       <h1 className="text-3xl font-bold text-indigo-700 mb-6">🚚 Truck Schedule</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-4 items-end bg-white p-4 rounded-lg shadow w-full max-w-5xl mb-4">
//         <div>
//           <label className="block">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={e => setFromDate(e.target.value)}
//             className="border rounded px-3 py-2"
//           />
//         </div>
//         <div>
//           <label className="block">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={e => setToDate(e.target.value)}
//             className="border rounded px-3 py-2"
//           />
//         </div>
//         <div className="flex gap-2">
//           {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map(btn => (
//             <button
//               key={btn}
//               onClick={() => fetchData(btn, truckSearch)}
//               className={`px-4 py-2 rounded font-semibold ${
//                 status === btn
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-indigo-100 text-indigo-700'
//               }`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Truck No."
//           value={truckSearch}
//           onChange={e => setTruckSearch(e.target.value)}
//           className="border rounded px-3 py-2 w-32"
//         />
//         <button
//           onClick={() => fetchData(status, truckSearch)}
//           className="px-4 py-2 bg-indigo-500 text-white rounded"
//         >
//           Search
//         </button>
//       </div>

//       {/* Plant selector */}
//       <div className="bg-white p-4 rounded-lg shadow w-full max-w-5xl mb-4">
//         <h2 className="text-lg font-semibold mb-2">Select Plants</h2>
//         <div className="flex gap-2 mb-2">
//           <button
//             onClick={selectAll}
//             className="bg-green-500 text-white px-4 py-2 rounded"
//           >
//             Select All
//           </button>
//           <button
//             onClick={deselectAll}
//             className="bg-red-500 text-white px-4 py-2 rounded"
//           >
//             Deselect
//           </button>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
//           {plantList.map(p => (
//             <label key={p.plantid} className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={selectedPlants.includes(p.plantid.toString())}
//                 onChange={() => togglePlant(p.plantid.toString())}
//               />
//               {p.plantname}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Table / cards display */}
//       <div className="bg-white p-6 shadow rounded-2xl w-full max-w-5xl overflow-x-auto">
//         <img src={truckImage} alt="Truck" className="mx-auto h-40 mb-4" />

//         {loading && <p className="text-indigo-600">Loading...</p>}
//         {error && <p className="text-red-500">{error}</p>}
//         {!loading && !error && data.length === 0 && (
//           <p className="text-gray-500">No trucks found</p>
//         )}

//         {data.length > 0 && (
//           <table className="min-w-full table-auto border-collapse block md:table">
//             <thead className="bg-indigo-100 hidden md:table-header-group">
//               <tr className="table-row">
//                 {[
//                   'Truck No',
//                   'Plant',
//                   'Check‑In',
//                   'Check‑Out',
//                   'Slip',
//                   'Qty',
//                   'Freight',
//                   'Priority'
//                 ].map(h => (
//                   <th
//                     key={h}
//                     className="px-4 py-2 text-left font-medium"
//                   >
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="block md:table-row-group">
//               {data.map((item, idx) => (
//                 <tr
//                   key={idx}
//                   className="bg-white md:bg-transparent md:table-row block mb-4 md:mb-0 rounded md:rounded-none"
//                 >
//                   {[
//                     'truckNo',
//                     'plantName',
//                     'checkInTime',
//                     'checkOutTime',
//                     'loadingSlipNo',
//                     'qty',
//                     'freight',
//                     'priority'
//                   ].map((key, i) => {
//                     const raw = item[key];
//                     const value =
//                       key.includes('Time') && raw
//                         ? new Date(raw).toLocaleString()
//                         : raw ?? '—';
//                     const label = [
//                       'Truck No',
//                       'Plant',
//                       'Check‑In',
//                       'Check‑Out',
//                       'Slip',
//                       'Qty',
//                       'Freight',
//                       'Priority'
//                     ][i];
//                     return (
//                       <td
//                         key={key}
//                         className="px-4 py-2 block md:table-cell whitespace-normal lg:whitespace-nowrap"
//                       >
//                         <span className="font-semibold md:hidden">
//                           {label}:{' '}
//                         </span>
//                         {value}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

///////////////////working code


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png'; // Update path if needed

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [truckSearch, setTruckSearch] = useState('');
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     axios.get(`${API_URL}/api/plants`, {
//       headers: {
//         userid: localStorage.getItem('userId'),
//         role: localStorage.getItem('role'),
//       }
//     })
//     .then(res => {
//       setPlantList(res.data);
//       setSelectedPlants(res.data.map(p => p.plantid.toString()));
//     })
//     .catch(() => setError('Failed to load plants'));
//   }, []);

//   const togglePlant = id =>
//     setSelectedPlants(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );

//   const selectAll = () =>
//     setSelectedPlants(plantList.map(p => p.plantid.toString()));

//   const deselectAll = () => setSelectedPlants([]);

//   const fetchData = async (st, tr = '') => {
//     if (!fromDate || !toDate || selectedPlants.length === 0) {
//       setError('Please select all filters');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setStatus(st);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: st,
//           plant: JSON.stringify(selectedPlants),
//           truckNo: tr || undefined,
//         },
//       });
//       let fetched = res.data;
//       if (tr) {
//         fetched = fetched.filter(item =>
//           item.truckNo?.toLowerCase().includes(tr.toLowerCase())
//         );
//       }
//       setData(fetched);
//     } catch {
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen flex flex-col items-center w-full">
//       <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 text-center">🚚 Truck Schedule</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 justify-center items-end bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <div className="flex flex-col">
//           <label className="text-sm">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={e => setFromDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={e => setToDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex gap-1 flex-wrap">
//           {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map(btn => (
//             <button
//               key={btn}
//               onClick={() => fetchData(btn, truckSearch)}
//               className={`px-3 py-1 rounded font-semibold text-xs ${
//                 status === btn
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-indigo-100 text-indigo-700'
//               }`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Truck No."
//           value={truckSearch}
//           onChange={e => setTruckSearch(e.target.value)}
//           className="border rounded px-2 py-1 text-sm w-24"
//         />
//         <button
//           onClick={() => fetchData(status, truckSearch)}
//           className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
//         >
//           Search
//         </button>
//       </div>

//       {/* Plant selector */}
//       <div className="bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <h2 className="text-base font-semibold mb-2">Select Plants</h2>
//         <div className="flex gap-2 mb-2 flex-wrap">
//           <button
//             onClick={selectAll}
//             className="bg-green-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Select All
//           </button>
//           <button
//             onClick={deselectAll}
//             className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Deselect
//           </button>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
//           {plantList.map(p => (
//             <label key={p.plantid} className="flex items-center gap-1 text-sm">
//               <input
//                 type="checkbox"
//                 checked={selectedPlants.includes(p.plantid.toString())}
//                 onChange={() => togglePlant(p.plantid.toString())}
//               />
//               {p.plantname}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Table / cards display */}
//       <div className="bg-white p-3 shadow rounded-2xl w-full max-w-5xl overflow-x-auto">
//         <img src={truckImage} alt="Truck" className="mx-auto h-24 sm:h-40 mb-3" />

//         {loading && <p className="text-indigo-600 text-center">Loading...</p>}
//         {error && <p className="text-red-500 text-center">{error}</p>}
//         {!loading && !error && data.length === 0 && (
//           <p className="text-gray-500 text-center">No trucks found</p>
//         )}

//         {data.length > 0 && (
//           <table className="min-w-[600px] table-auto border-collapse block md:table text-sm">
//             <thead className="bg-indigo-100 hidden md:table-header-group">
//               <tr className="table-row">
//                 {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map(h => (
//                   <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="block md:table-row-group">
//               {data.map((item, idx) => (
//                 <tr key={idx} className="bg-white md:bg-transparent md:table-row block mb-3 md:mb-0 rounded md:rounded-none shadow md:shadow-none p-2 md:p-0">
//                   {['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'].map((key, i) => {
//                     const raw = item[key];
//                     const value = key.includes('Time') && raw
//                       ? new Date(raw).toLocaleString()
//                       : raw ?? '—';
//                     const label = ['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'][i];
//                     return (
//                       <td key={key} className="px-3 py-2 block md:table-cell break-words">
//                         <span className="font-semibold md:hidden">{label}: </span>
//                         {value}
//                       </td>
//                     );
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png'; 


// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [truckSearch, setTruckSearch] = useState('');
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     axios.get(`${API_URL}/api/plants`, {
//       headers: {
//         userid: localStorage.getItem('userId'),
//         role: localStorage.getItem('role'),
//       }
//     })
//     .then(res => {
//       setPlantList(res.data);
//       setSelectedPlants(res.data.map(p => p.plantid.toString()));
//     })
//     .catch(() => setError('Failed to load plants'));
//   }, []);

//   const togglePlant = id =>
//     setSelectedPlants(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );

//   const selectAll = () =>
//     setSelectedPlants(plantList.map(p => p.plantid.toString()));

//   const deselectAll = () => setSelectedPlants([]);

//   const fetchData = async (st, tr = '') => {
//     if (!fromDate || !toDate || selectedPlants.length === 0) {
//       setError('Please select all filters');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setStatus(st);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: st,
//           plant: JSON.stringify(selectedPlants),
//           truckNo: tr || undefined,
//         },
//       });
//       let fetched = res.data;
//       if (tr) {
//         fetched = fetched.filter(item =>
//           item.truckNo?.toLowerCase().includes(tr.toLowerCase())
//         );
//       }
//       setData(fetched);
//     } catch {
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen flex flex-col items-center w-full">
   
//       <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 text-center">🚚 Truck Schedule</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 justify-center items-end bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <div className="flex flex-col">
//           <label className="text-sm">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={e => setFromDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={e => setToDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex gap-1 flex-wrap">
//           {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map(btn => (
//             <button
//               key={btn}
//               onClick={() => fetchData(btn, truckSearch)}
//               className={`px-3 py-1 rounded font-semibold text-xs ${
//                 status === btn
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-indigo-100 text-indigo-700'
//               }`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Truck No."
//           value={truckSearch}
//           onChange={e => setTruckSearch(e.target.value)}
//           className="border rounded px-2 py-1 text-sm w-24"
//         />
//         <button
//           onClick={() => fetchData(status, truckSearch)}
//           className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
//         >
//           Search
//         </button>
//       </div>

//       {/* Plant selector */}
//       <div className="bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <h2 className="text-base font-semibold mb-2">Select Plants</h2>
//         <div className="flex gap-2 mb-2 flex-wrap">
//           <button
//             onClick={selectAll}
//             className="bg-green-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Select All
//           </button>
//           <button
//             onClick={deselectAll}
//             className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Deselect
//           </button>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
//           {plantList.map(p => (
//             <label key={p.plantid} className="flex items-center gap-1 text-sm">
//               <input
//                 type="checkbox"
//                 checked={selectedPlants.includes(p.plantid.toString())}
//                 onChange={() => togglePlant(p.plantid.toString())}
//               />
//               {p.plantname}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Table / cards display */}
//       <div className="bg-white p-3 shadow rounded-2xl w-full max-w-5xl overflow-x-auto">
//         <img src={truckImage} alt="Truck" className="mx-auto h-24 sm:h-40 mb-3" />

//         {loading && <p className="text-indigo-600 text-center">Loading...</p>}
//         {error && <p className="text-red-500 text-center">{error}</p>}
//         {!loading && !error && data.length === 0 && (
//           <p className="text-gray-500 text-center">No trucks found</p>
//         )}

//         {/* Desktop Table */}
//         {data.length > 0 && (
//           <div className="hidden md:block">
//             <table className="w-full table-auto border border-gray-300 text-sm">
//               <thead className="bg-indigo-100">
//                 <tr>
//                   {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map(h => (
//                     <th key={h} className="px-3 py-2 border border-gray-300 text-left">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     {['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'].map((key) => {
//                       const raw = item[key];
//                       const value = key.includes('Time') && raw
//                         ? new Date(raw).toLocaleString()
//                         : raw ?? '—';
//                       return (
//                         <td key={key} className="px-3 py-2 border border-gray-300">{value}</td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Mobile Card View */}
//         {data.length > 0 && (
//           <div className="block md:hidden space-y-3">
//             {data.map((item, idx) => (
//               <div key={idx} className="border border-gray-300 rounded p-2 shadow-sm bg-white">
//                 {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map((label, i) => {
//                   const key = ['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'][i];
//                   const raw = item[key];
//                   const value = key.includes('Time') && raw
//                     ? new Date(raw).toLocaleString()
//                     : raw ?? '—';
//                   return (
//                     <p key={key} className="text-sm">
//                       <span className="font-semibold">{label}:</span> {value}
//                     </p>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [truckSearch, setTruckSearch] = useState('');
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     axios.get(`${API_URL}/api/plants`, {
//       headers: {
//         userid: localStorage.getItem('userId'),   // UserId bhej rahe
//         role: localStorage.getItem('role')
//       }
//     })
//     .then(res => {
//       setPlantList(res.data);
//       setSelectedPlants(res.data.map(p => p.plantid.toString()));
//     })
//     .catch(() => setError('Failed to load plants'));
//   }, []);

//   const togglePlant = id =>
//     setSelectedPlants(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );

//   const selectAll = () =>
//     setSelectedPlants(plantList.map(p => p.plantid.toString()));

//   const deselectAll = () => setSelectedPlants([]);

//   const fetchData = async (st, tr = '') => {
//     if (!fromDate || !toDate || selectedPlants.length === 0) {
//       setError('Please select all filters');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setStatus(st);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: st,
//           plant: JSON.stringify(selectedPlants),
//           truckNo: tr || undefined,
//         },
//       });
//       let fetched = res.data;
//       if (tr) {
//         fetched = fetched.filter(item =>
//           item.truckNo?.toLowerCase().includes(tr.toLowerCase())
//         );
//       }
//       setData(fetched);
//     } catch {
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen flex flex-col items-center w-full">
   
//       <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 text-center">🚚 Truck Schedule</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 justify-center items-end bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <div className="flex flex-col">
//           <label className="text-sm">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={e => setFromDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={e => setToDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex gap-1 flex-wrap">
//           {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map(btn => (
//             <button
//               key={btn}
//               onClick={() => fetchData(btn, truckSearch)}
//               className={`px-3 py-1 rounded font-semibold text-xs ${
//                 status === btn
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-indigo-100 text-indigo-700'
//               }`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Truck No."
//           value={truckSearch}
//           onChange={e => setTruckSearch(e.target.value)}
//           className="border rounded px-2 py-1 text-sm w-24"
//         />
//         <button
//           onClick={() => fetchData(status, truckSearch)}
//           className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
//         >
//           Search
//         </button>
//       </div>

//       {/* Plant selector */}
//       <div className="bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <h2 className="text-base font-semibold mb-2">Select Plants</h2>
//         <div className="flex gap-2 mb-2 flex-wrap">
//           <button
//             onClick={selectAll}
//             className="bg-green-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Select All
//           </button>
//           <button
//             onClick={deselectAll}
//             className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Deselect
//           </button>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
//           {plantList.map(p => (
//             <label key={p.plantid} className="flex items-center gap-1 text-sm">
//               <input
//                 type="checkbox"
//                 checked={selectedPlants.includes(p.plantid.toString())}
//                 onChange={() => togglePlant(p.plantid.toString())}
//               />
//               {p.plantname}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Table / cards display */}
//       <div className="bg-white p-3 shadow rounded-2xl w-full max-w-5xl overflow-x-auto">
//         <img src={truckImage} alt="Truck" className="mx-auto h-24 sm:h-40 mb-3" />

//         {loading && <p className="text-indigo-600 text-center">Loading...</p>}
//         {error && <p className="text-red-500 text-center">{error}</p>}
//         {!loading && !error && data.length === 0 && (
//           <p className="text-gray-500 text-center">No trucks found</p>
//         )}

//         {/* Desktop Table */}
//         {data.length > 0 && (
//           <div className="hidden md:block">
//             <table className="w-full table-auto border border-gray-300 text-sm">
//               <thead className="bg-indigo-100">
//                 <tr>
//                   {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map(h => (
//                     <th key={h} className="px-3 py-2 border border-gray-300 text-left">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     {['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'].map((key) => {
//                       const raw = item[key];
//                       const value = key.includes('Time') && raw
//                         ? new Date(raw).toLocaleString()
//                         : raw ?? '—';
//                       return (
//                         <td key={key} className="px-3 py-2 border border-gray-300">{value}</td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Mobile Card View */}
//         {data.length > 0 && (
//           <div className="block md:hidden space-y-3">
//             {data.map((item, idx) => (
//               <div key={idx} className="border border-gray-300 rounded p-2 shadow-sm bg-white">
//                 {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map((label, i) => {
//                   const key = ['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'][i];
//                   const raw = item[key];
//                   const value = key.includes('Time') && raw
//                     ? new Date(raw).toLocaleString()
//                     : raw ?? '—';
//                   return (
//                     <p key={key} className="text-sm">
//                       <span className="font-semibold">{label}:</span> {value}
//                     </p>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }////////////////////////



// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [truckSearch, setTruckSearch] = useState('');
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const userId = localStorage.getItem('userId');
//     const role = localStorage.getItem('role') || 'admin';
//     const allowedPlantsRaw = localStorage.getItem('allowedPlants') || '';
//     const allowedPlants = allowedPlantsRaw.split(',').map(p => p.trim()).filter(Boolean);

//     axios.get(`${API_URL}/api/plants`, {
//       headers: { userid: userId, role }
//     })
//       .then(res => {
//         const filtered = res.data.filter(plant => {
//           const pid = String(plant.PlantID || plant.PlantId || plant.plantid || '');
//           return allowedPlants.includes(pid) || role.toLowerCase() === 'admin';
//         });
//         setPlantList(filtered);
//         setSelectedPlants(filtered.map(p => String(p.plantid)));
//       })
//       .catch(() => setError('Failed to load plants'));
//   }, []);

//   const togglePlant = id =>
//     setSelectedPlants(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );

//   const selectAll = () =>
//     setSelectedPlants(plantList.map(p => String(p.plantid)));

//   const deselectAll = () => setSelectedPlants([]);

//   const fetchData = async (st, tr = '') => {
//     if (!fromDate || !toDate || selectedPlants.length === 0) {
//       setError('Please select all filters');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setStatus(st);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: st,
//           plant: JSON.stringify(selectedPlants),
//           truckNo: tr || undefined,
//         },
//       });
//       let fetched = res.data;
//       if (tr) {
//         fetched = fetched.filter(item =>
//           item.truckNo?.toLowerCase().includes(tr.toLowerCase())
//         );
//       }
//       setData(fetched);
//     } catch {
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen flex flex-col items-center w-full">
//       <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 text-center">🚚 Truck Schedule</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 justify-center items-end bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <div className="flex flex-col">
//           <label className="text-sm">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={e => setFromDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={e => setToDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex gap-1 flex-wrap">
//           {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map(btn => (
//             <button
//               key={btn}
//               onClick={() => fetchData(btn, truckSearch)}
//               className={`px-3 py-1 rounded font-semibold text-xs ${
//                 status === btn ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-700'
//               }`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Truck No."
//           value={truckSearch}
//           onChange={e => setTruckSearch(e.target.value)}
//           className="border rounded px-2 py-1 text-sm w-24"
//         />
//         <button
//           onClick={() => fetchData(status, truckSearch)}
//           className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
//         >
//           Search
//         </button>
//       </div>

//       {/* Plant selector */}
//       <div className="bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <h2 className="text-base font-semibold mb-2">Select Plants</h2>
//         <div className="flex gap-2 mb-2 flex-wrap">
//           <button
//             onClick={selectAll}
//             className="bg-green-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Select All
//           </button>
//           <button
//             onClick={deselectAll}
//             className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Deselect
//           </button>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
//           {plantList.map(p => (
//             <label key={p.plantid} className="flex items-center gap-1 text-sm">
//               <input
//                 type="checkbox"
//                 checked={selectedPlants.includes(String(p.plantid))}
//                 onChange={() => togglePlant(String(p.plantid))}
//               />
//               {p.plantname}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Table / cards display */}
//       <div className="bg-white p-3 shadow rounded-2xl w-full max-w-5xl overflow-x-auto">
//         <img src={truckImage} alt="Truck" className="mx-auto h-24 sm:h-40 mb-3" />

//         {loading && <p className="text-indigo-600 text-center">Loading...</p>}
//         {error && <p className="text-red-500 text-center">{error}</p>}
//         {!loading && !error && data.length === 0 && (
//           <p className="text-gray-500 text-center">No trucks found</p>
//         )}

//         {/* Desktop Table */}
//         {data.length > 0 && (
//           <div className="hidden md:block">
//             <table className="w-full table-auto border border-gray-300 text-sm">
//               <thead className="bg-indigo-100">
//                 <tr>
//                   {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map(h => (
//                     <th key={h} className="px-3 py-2 border border-gray-300 text-left">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     {['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'].map((key) => {
//                       const raw = item[key];
//                       const value = key.includes('Time') && raw
//                         ? new Date(raw).toLocaleString()
//                         : raw ?? '—';
//                       return (
//                         <td key={key} className="px-3 py-2 border border-gray-300">{value}</td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Mobile Card View */}
//         {data.length > 0 && (
//           <div className="block md:hidden space-y-3">
//             {data.map((item, idx) => (
//               <div key={idx} className="border border-gray-300 rounded p-2 shadow-sm bg-white">
//                 {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map((label, i) => {
//                   const key = ['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'][i];
//                   const raw = item[key];
//                   const value = key.includes('Time') && raw
//                     ? new Date(raw).toLocaleString()
//                     : raw ?? '—';
//                   return (
//                     <p key={key} className="text-sm">
//                       <span className="font-semibold">{label}:</span> {value}
//                     </p>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [truckSearch, setTruckSearch] = useState('');
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

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
//         const pid = String(plant.plantid || '');
//         return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
//       });
//       setPlantList(filtered);
//       setSelectedPlants(filtered.map(p => p.plantid.toString()));
//     })
//     .catch(() => setError('Failed to load plants'));
//   }, []);

//   const togglePlant = id =>
//     setSelectedPlants(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );

//   const selectAll = () =>
//     setSelectedPlants(plantList.map(p => p.plantid.toString()));

//   const deselectAll = () => setSelectedPlants([]);

//   const fetchData = async (st, tr = '') => {
//     if (!fromDate || !toDate || selectedPlants.length === 0) {
//       setError('Please select all filters');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setStatus(st);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: st,
//           plant: JSON.stringify(selectedPlants),
//           truckNo: tr || undefined,
//         },
//       });
//       let fetched = res.data;
//       if (tr) {
//         fetched = fetched.filter(item =>
//           item.truckNo?.toLowerCase().includes(tr.toLowerCase())
//         );
//       }
//       setData(fetched);
//     } catch {
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen flex flex-col items-center w-full">
//       <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 text-center">🚚 Truck Schedule</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 justify-center items-end bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <div className="flex flex-col">
//           <label className="text-sm">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={e => setFromDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={e => setToDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex gap-1 flex-wrap">
//           {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map(btn => (
//             <button
//               key={btn}
//               onClick={() => fetchData(btn, truckSearch)}
//               className={`px-3 py-1 rounded font-semibold text-xs ${
//                 status === btn
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-indigo-100 text-indigo-700'
//               }`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Truck No."
//           value={truckSearch}
//           onChange={e => setTruckSearch(e.target.value)}
//           className="border rounded px-2 py-1 text-sm w-24"
//         />
//         <button
//           onClick={() => fetchData(status, truckSearch)}
//           className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
//         >
//           Search
//         </button>
//       </div>

//       {/* Plant selector */}
//       <div className="bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <h2 className="text-base font-semibold mb-2">Select Plants</h2>
//         <div className="flex gap-2 mb-2 flex-wrap">
//           <button
//             onClick={selectAll}
//             className="bg-green-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Select All
//           </button>
//           <button
//             onClick={deselectAll}
//             className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Deselect
//           </button>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
//           {plantList.map(p => (
//             <label key={p.plantid} className="flex items-center gap-1 text-sm">
//               <input
//                 type="checkbox"
//                 checked={selectedPlants.includes(p.plantid.toString())}
//                 onChange={() => togglePlant(p.plantid.toString())}
//               />
//               {p.plantname}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Table / cards display */}
//       <div className="bg-white p-3 shadow rounded-2xl w-full max-w-5xl overflow-x-auto">
//         <img src={truckImage} alt="Truck" className="mx-auto h-24 sm:h-40 mb-3" />

//         {loading && <p className="text-indigo-600 text-center">Loading...</p>}
//         {error && <p className="text-red-500 text-center">{error}</p>}
//         {!loading && !error && data.length === 0 && (
//           <p className="text-gray-500 text-center">No trucks found</p>
//         )}

//         {/* Desktop Table */}
//         {data.length > 0 && (
//           <div className="hidden md:block">
//             <table className="w-full table-auto border border-gray-300 text-sm">
//               <thead className="bg-indigo-100">
//                 <tr>
//                   {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map(h => (
//                     <th key={h} className="px-3 py-2 border border-gray-300 text-left">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     {['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'].map((key) => {
//                       const raw = item[key];
//                       const value = key.includes('Time') && raw
//                         ? new Date(raw).toLocaleString()
//                         : raw ?? '—';
//                       return (
//                         <td key={key} className="px-3 py-2 border border-gray-300">{value}</td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Mobile Card View */}
//         {data.length > 0 && (
//           <div className="block md:hidden space-y-3">
//             {data.map((item, idx) => (
//               <div key={idx} className="border border-gray-300 rounded p-2 shadow-sm bg-white">
//                 {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map((label, i) => {
//                   const key = ['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'][i];
//                   const raw = item[key];
//                   const value = key.includes('Time') && raw
//                     ? new Date(raw).toLocaleString()
//                     : raw ?? '—';
//                   return (
//                     <p key={key} className="text-sm">
//                       <span className="font-semibold">{label}:</span> {value}
//                     </p>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }////////////////////////// final working hai date issuu


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import truckImage from './assets/Truck.png.png';

// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [truckSearch, setTruckSearch] = useState('');
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

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
//         const pid = String(plant.plantid || '');
//         return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
//       });
//       setPlantList(filtered);
//       setSelectedPlants(filtered.map(p => p.plantid.toString()));
//     })
//     .catch(() => setError('Failed to load plants'));
//   }, []);

//   const togglePlant = id =>
//     setSelectedPlants(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );

//   const selectAll = () =>
//     setSelectedPlants(plantList.map(p => p.plantid.toString()));

//   const deselectAll = () => setSelectedPlants([]);

//   const fetchData = async (st, tr = '') => {
//     if (!fromDate || !toDate || selectedPlants.length === 0) {
//       setError('Please select all filters');
//       return;
//     }
//     setLoading(true);
//     setError('');
//     setStatus(st);

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: st,
//           plant: JSON.stringify(selectedPlants),
//           truckNo: tr || undefined,
//         },
//       });
//       let fetched = res.data;
//       if (tr) {
//         fetched = fetched.filter(item =>
//           item.truckNo?.toLowerCase().includes(tr.toLowerCase())
//         );
//       }
//       setData(fetched);
//     } catch {
//       setError('Failed to fetch data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-gradient-to-br from-gray-100 to-blue-100 min-h-screen flex flex-col items-center w-full">
//       <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-4 text-center">🚚 Truck Schedule</h1>

//       {/* Filters */}
//       <div className="flex flex-wrap gap-3 justify-center items-end bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <div className="flex flex-col">
//           <label className="text-sm">From</label>
//           <input
//             type="date"
//             value={fromDate}
//             onChange={e => setFromDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex flex-col">
//           <label className="text-sm">To</label>
//           <input
//             type="date"
//             value={toDate}
//             onChange={e => setToDate(e.target.value)}
//             className="border rounded px-2 py-1 text-sm"
//           />
//         </div>
//         <div className="flex gap-1 flex-wrap">
//           {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map(btn => (
//             <button
//               key={btn}
//               onClick={() => fetchData(btn, truckSearch)}
//               className={`px-3 py-1 rounded font-semibold text-xs ${
//                 status === btn
//                   ? 'bg-indigo-600 text-white'
//                   : 'bg-indigo-100 text-indigo-700'
//               }`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//         <input
//           type="text"
//           placeholder="Truck No."
//           value={truckSearch}
//           onChange={e => setTruckSearch(e.target.value)}
//           className="border rounded px-2 py-1 text-sm w-24"
//         />
//         <button
//           onClick={() => fetchData(status, truckSearch)}
//           className="px-3 py-1 bg-indigo-500 text-white rounded text-sm"
//         >
//           Search
//         </button>
//       </div>

//       {/* Plant selector */}
//       <div className="bg-white p-3 rounded-lg shadow w-full max-w-5xl mb-4">
//         <h2 className="text-base font-semibold mb-2">Select Plants</h2>
//         <div className="flex gap-2 mb-2 flex-wrap">
//           <button
//             onClick={selectAll}
//             className="bg-green-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Select All
//           </button>
//           <button
//             onClick={deselectAll}
//             className="bg-red-500 text-white px-3 py-1 rounded text-sm"
//           >
//             Deselect
//           </button>
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
//           {plantList.map(p => (
//             <label key={p.plantid} className="flex items-center gap-1 text-sm">
//               <input
//                 type="checkbox"
//                 checked={selectedPlants.includes(p.plantid.toString())}
//                 onChange={() => togglePlant(p.plantid.toString())}
//               />
//               {p.plantname}
//             </label>
//           ))}
//         </div>
//       </div>

//       {/* Table / cards display */}
//       <div className="bg-white p-3 shadow rounded-2xl w-full max-w-5xl overflow-x-auto">
//         <img src={truckImage} alt="Truck" className="mx-auto h-24 sm:h-40 mb-3" />

//         {loading && <p className="text-indigo-600 text-center">Loading...</p>}
//         {error && <p className="text-red-500 text-center">{error}</p>}
//         {!loading && !error && data.length === 0 && (
//           <p className="text-gray-500 text-center">No trucks found</p>
//         )}

//         {/* Desktop Table */}
//         {data.length > 0 && (
//           <div className="hidden md:block">
//             <table className="w-full table-auto border border-gray-300 text-sm">
//               <thead className="bg-indigo-100">
//                 <tr>
//                   {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map(h => (
//                     <th key={h} className="px-3 py-2 border border-gray-300 text-left">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     {['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'].map((key) => {
//                       const raw = item[key];
//                       const value = key.includes('Time') && raw
//                         ? raw
//                         : raw ?? '—';
//                       return (
//                         <td key={key} className="px-3 py-2 border border-gray-300">{value}</td>
//                       );
//                     })}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* Mobile Card View */}
//         {data.length > 0 && (
//           <div className="block md:hidden space-y-3">
//             {data.map((item, idx) => (
//               <div key={idx} className="border border-gray-300 rounded p-2 shadow-sm bg-white">
//                 {['Truck No', 'Plant', 'Check‑In', 'Check‑Out', 'Slip', 'Qty', 'Freight', 'Priority'].map((label, i) => {
//                   const key = ['truckNo', 'plantName', 'checkInTime', 'checkOutTime', 'loadingSlipNo', 'qty', 'freight', 'priority'][i];
//                   const raw = item[key];
//                   const value = key.includes('Time') && raw
//                     ? raw
//                     : raw ?? '—';
//                   return (
//                     <p key={key} className="text-sm">
//                       <span className="font-semibold">{label}:</span> {value}
//                     </p>
//                   );
//                 })}
//               </div>
//             ))}
//           </div>
//         )}

//       </div>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { FiTruck, FiCalendar, FiFilter, FiSearch, FiCheckCircle, FiXCircle, FiRefreshCw } from 'react-icons/fi';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import CancelButton from './CancelButton';



// const API_URL = import.meta.env.VITE_API_URL;

// export default function TruckSchedule() {
//   const [fromDate, setFromDate] = useState('');
//   const [toDate, setToDate] = useState('');
//   const [status, setStatus] = useState('All');
//   const [truckSearch, setTruckSearch] = useState('');
//   const [plantList, setPlantList] = useState([]);
//   const [selectedPlants, setSelectedPlants] = useState([]);
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPlantFilter, setShowPlantFilter] = useState(false);

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
//         const pid = String(plant.plantid || '');
//         return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
//       });
//       setPlantList(filtered);
//       setSelectedPlants(filtered.map(p => p.plantid.toString()));
//       toast.success('Plants loaded successfully', {
//         position: "top-right",
//         autoClose: 2000,
//         hideProgressBar: false,
//       });
//     })
//     .catch(() => {
//       setError('Failed to load plants');
//       toast.error('Failed to load plants', {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     });
//   }, []);

//   const togglePlant = (id) => {
//     setSelectedPlants(prev =>
//       prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
//     );
//     toast.info('Plant selection updated', {
//       position: "top-right",
//       autoClose: 1500,
//     });
//   };

//   const selectAll = () => {
//     setSelectedPlants(plantList.map(p => p.plantid.toString()));
//     toast.success('All plants selected', {
//       position: "top-right",
//       autoClose: 1500,
//     });
//   };

//   const deselectAll = () => {
//     setSelectedPlants([]);
//     toast.info('All plants deselected', {
//       position: "top-right",
//       autoClose: 1500,
//     });
//   };

//   const fetchData = async (st, tr = '') => {
//     if (!fromDate || !toDate || selectedPlants.length === 0) {
//       setError('Please select all filters');
//       toast.error('Please select all filters', {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }
    
//     setLoading(true);
//     setError('');
//     setStatus(st);
//     toast.info('Fetching truck data...', {
//       position: "top-right",
//       autoClose: 1000,
//     });

//     try {
//       const res = await axios.get(`${API_URL}/api/truck-schedule`, {
//         params: {
//           fromDate,
//           toDate,
//           status: st,
//           plant: JSON.stringify(selectedPlants),
//           truckNo: tr || undefined,
//         },
//       });
//       let fetched = res.data;
//       if (tr) {
//         fetched = fetched.filter(item =>
//           item.truckNo?.toLowerCase().includes(tr.toLowerCase())
//         );
//       }
//       setData(fetched);
//       toast.success(`Loaded ${fetched.length} trucks`, {
//         position: "top-right",
//         autoClose: 2000,
//       });
//     } catch {
//       setError('Failed to fetch data');
//       toast.error('Failed to fetch truck data', {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDateTime = (dateTimeStr) => {
//     if (!dateTimeStr) return '—';
//     const date = new Date(dateTimeStr);
//     return date.toLocaleString();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 md:p-6">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
      
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <FiTruck className="text-blue-600" />
//               Truck Schedule Dashboard
//             </h1>
          
//             <p className="text-gray-600">Track and manage your fleet vehicles</p>
//           </div>
//         </div>
//               <CancelButton />

//         {/* Filters Card */}
//         <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 border border-gray-100 backdrop-blur-sm bg-opacity-90">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
//             <div className="space-y-1">
//               <label className="block text-sm font-medium text-gray-700">From Date</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiCalendar className="text-gray-400" />
//                 </div>
//                 <input
//                   type="date"
//                   value={fromDate}
//                   onChange={e => setFromDate(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
            
//             <div className="space-y-1">
//               <label className="block text-sm font-medium text-gray-700">To Date</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiCalendar className="text-gray-400" />
//                 </div>
//                 <input
//                   type="date"
//                   value={toDate}
//                   onChange={e => setToDate(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
            
//             <div className="space-y-1">
//               <label className="block text-sm font-medium text-gray-700">Truck Number</label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <FiSearch className="text-gray-400" />
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search truck..."
//                   value={truckSearch}
//                   onChange={e => setTruckSearch(e.target.value)}
//                   className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>
            
//             <div className="flex items-end">
//               <button
//                 onClick={() => fetchData(status, truckSearch)}
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
//               >
//                 {loading ? (
//                   <>
//                     <FiRefreshCw className="animate-spin" />
//                     Searching...
//                   </>
//                 ) : (
//                   <>
//                     <FiSearch />
//                     Search Trucks
//                   </>
//                 )}
//               </button>
//             </div>
//           </div>
          
//           {/* Status Filters */}
//           <div className="flex flex-wrap gap-2 mb-4">
//             {['Dispatched', 'InTransit', 'CheckedOut', 'All'].map(btn => (
//               <button
//                 key={btn}
//                 onClick={() => fetchData(btn, truckSearch)}
//                 className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1 transition-all duration-200 ${
//                   status === btn
//                     ? 'bg-blue-600 text-white shadow-md'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {status === btn ? <FiCheckCircle className="text-white" /> : <FiCheckCircle className="text-gray-500" />}
//                 {btn}
//               </button>
//             ))}
//           </div>
          
//           {/* Plant Filter Toggle */}
//           <div className="flex justify-between items-center mb-2">
//             <h3 className="text-sm font-medium text-gray-700">Plant Filters</h3>
//             <button
//               onClick={() => setShowPlantFilter(!showPlantFilter)}
//               className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
//             >
//               <FiFilter />
//               {showPlantFilter ? 'Hide Plants' : 'Show Plants'}
//             </button>
//           </div>
          
//           {/* Plant Selection (Collapsible) */}
//           {showPlantFilter && (
//             <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//               <div className="flex gap-2 mb-3">
//                 <button
//                   onClick={selectAll}
//                   className="px-3 py-1 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors"
//                 >
//                   Select All
//                 </button>
//                 <button
//                   onClick={deselectAll}
//                   className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
//                 >
//                   Deselect All
//                 </button>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1">
//                 {plantList.map(p => (
//                   <label key={p.plantid} className="flex items-center gap-2 text-sm p-2 hover:bg-blue-50 rounded transition-colors">
//                     <input
//                       type="checkbox"
//                       checked={selectedPlants.includes(p.plantid.toString())}
//                       onChange={() => togglePlant(p.plantid.toString())}
//                       className="rounded text-blue-600 focus:ring-blue-500"
//                     />
//                     <span className="truncate">{p.plantname}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Results Section */}
//         <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 backdrop-blur-sm bg-opacity-90">
//           {/* Loading/Error States */}
//           {loading && (
//             <div className="p-8 flex flex-col items-center justify-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
//               <p className="text-gray-700 font-medium">Loading truck data...</p>
//             </div>
//           )}
          
//           {error && (
//             <div className="p-6 text-center">
//               <div className="inline-flex items-center justify-center bg-red-100 rounded-full p-3 mb-3">
//                 <FiXCircle className="text-red-500 text-2xl" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-1">{error}</h3>
//               <p className="text-gray-600">Please try again or check your filters</p>
//               <button
//                 onClick={() => fetchData(status, truckSearch)}
//                 className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Retry
//               </button>
//             </div>
//           )}
          
//           {!loading && !error && data.length === 0 && (
//             <div className="p-8 text-center">
//               <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-4 mb-4">
//                 <FiTruck className="text-blue-500 text-3xl" />
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-1">No trucks found</h3>
//               <p className="text-gray-600">Adjust your search criteria and try again</p>
//             </div>
//           )}

//           {/* Desktop Table */}
//           {!loading && !error && data.length > 0 && (
//             <div className="hidden md:block overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     {['Truck No', 'Plant', 'Check-In', 'Check-Out', 'Slip', 'Qty', 'Freight', 'Priority'].map((header) => (
//                       <th
//                         key={header}
//                         scope="col"
//                         className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                       >
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {data.map((item, idx) => (
//                     <tr key={idx} className="hover:bg-blue-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 uppercase">
//                         {item.truckNo || '—'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.plantName || '—'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDateTime(item.checkInTime)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {formatDateTime(item.checkOutTime)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.loadingSlipNo || '—'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.qty || '—'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.freight || '—'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {item.priority || '—'}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}

//           {/* Mobile Cards */}
//           {!loading && !error && data.length > 0 && (
//             <div className="block md:hidden space-y-4 p-4">
//               {data.map((item, idx) => (
//                 <div key={idx} className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
//                   <div className="p-4 space-y-2">
//                     <div className="flex justify-between items-start">
//                       <h3 className="text-lg font-bold text-blue-600 uppercase">{item.truckNo || '—'}</h3>
//                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                         {item.priority || 'Standard'}
//                       </span>
//                     </div>
                    
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <p className="text-xs text-gray-500">Plant</p>
//                         <p className="text-sm font-medium">{item.plantName || '—'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Slip No</p>
//                         <p className="text-sm font-medium">{item.loadingSlipNo || '—'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Check-In</p>
//                         <p className="text-sm">{formatDateTime(item.checkInTime)}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Check-Out</p>
//                         <p className="text-sm">{formatDateTime(item.checkOutTime)}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Quantity</p>
//                         <p className="text-sm font-medium">{item.qty || '—'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Freight</p>
//                         <p className="text-sm font-medium">{item.freight || '—'}</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }//////////////// /////////////////////////////// /////////////////// / / / /



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CancelButton from './CancelButton';

const API_URL = import.meta.env.VITE_API_URL;

export default function Report() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedPlants, setSelectedPlants] = useState([]);
  const [plants, setPlants] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('All');
  const [showPlantFilter, setShowPlantFilter] = useState(false);

  useEffect(() => {
    const fetchPlants = async () => {
      const userId = localStorage.getItem('userId');
      const role = localStorage.getItem('role');
      const allowedPlantsRaw = localStorage.getItem('allowedPlants') || '';
      const allowedPlants = allowedPlantsRaw.split(',').map(p => p.trim()).filter(Boolean);

      try {
        const { data } = await axios.get(`${API_URL}/api/plants`, {
          headers: { userid: userId, role }
        });
        const filtered = data.filter(plant => {
          const pid = String(plant.plantid || '');
          return allowedPlants.includes(pid) || role?.toLowerCase() === 'admin';
        });
        setPlants(filtered);
        setSelectedPlants(filtered.map(p => String(p.plantid)));
      } catch {
        toast.error('Failed to load plant data', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored"
        });
      }
    };

    fetchPlants();
  }, []);

  const togglePlant = id =>
    setSelectedPlants(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const selectAll = () => setSelectedPlants(plants.map(p => String(p.plantid)));
  const deselectAll = () => setSelectedPlants([]);

  const fetchReport = async () => {
    if (!fromDate || !toDate) {
      toast.warn('Please select both date ranges', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      return;
    }
    if (selectedPlants.length === 0) {
      toast.warn('Please select at least one plant', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/api/truck-report`, {
        params: { 
          fromDate, 
          toDate, 
          plant: JSON.stringify(selectedPlants),
          status: status !== 'All' ? status : undefined,
          truckNo: searchTerm || undefined
        }
      });
      setReportData(data);
      if (data.length === 0) {
        toast.info('No records found for selected filters', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored"
        });
      }
    } catch {
      toast.error('Failed to generate report', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = dateStr => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredData = reportData.filter(row => 
    row.truckNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.plantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.loadingSlipNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored" />
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Truck Movement Analytics
              </h1>
              <p className="text-blue-100 text-lg">Comprehensive fleet tracking and reporting</p>
            </div>
            <div className="mt-6 md:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
                <div className="text-sm font-medium mb-1">Records Found</div>
                <div className="text-2xl font-bold">{reportData.length}</div>
              </div>
            </div>
          </div>
        </div>
        <CancelButton />

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <svg className="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Parameters
            </h2>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search truck number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {['All', 'Dispatched', 'InTransit', 'CheckedOut'].map(btn => (
              <button
                key={btn}
                onClick={() => setStatus(btn)}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-1 transition-all duration-200 ${
                  status === btn
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === btn ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {btn}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Date Filters */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Plant Selection */}
            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Plant Locations</label>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setShowPlantFilter(!showPlantFilter)}
                    className="text-xs px-3 py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-all shadow-sm flex items-center"
                  >
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {showPlantFilter ? 'Hide Plants' : 'Show Plants'}
                  </button>
                  {showPlantFilter && (
                    <>
                      <button 
                        onClick={selectAll}
                        className="text-xs px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-sm flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Select All
                      </button>
                      <button 
                        onClick={deselectAll}
                        className="text-xs px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm flex items-center"
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear All
                      </button>
                    </>
                  )}
                </div>
              </div>
              {showPlantFilter && (
                <div className="max-h-60 overflow-y-auto p-3 border border-gray-300 rounded-xl bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {plants.map(p => (
                      <div 
                        key={p.plantid}
                        onClick={() => togglePlant(String(p.plantid))}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${selectedPlants.includes(String(p.plantid)) ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-100'}`}
                      >
                        <div className={`flex items-center justify-center w-5 h-5 rounded border-2 mr-3 transition-all ${selectedPlants.includes(String(p.plantid)) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                          {selectedPlants.includes(String(p.plantid)) && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm text-gray-700">{p.plantname}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={fetchReport}
              disabled={loading}
              className={`px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all transform ${loading ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-95'} focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Report...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate Analytics Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {filteredData.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center mb-2 md:mb-0">
                <svg className="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Movement Records
                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {filteredData.length} entries
                </span>
              </h3>
              <div className="text-sm text-gray-500">
                Showing results for: {formatDateTime(fromDate)} to {formatDateTime(toDate)}
                {status !== 'All' && ` | Status: ${status}`}
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Truck</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date/Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Plant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Timings</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((row, index) => (
                    <tr key={index} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900 uppercase">{row.truckNo || '—'}</div>
                        <div className="text-xs text-gray-500">Priority: {row.priority}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDateTime(row.transactionDate)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{row.plantName || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="text-xs text-gray-500">Check-In</div>
                            <div className="text-sm font-medium">{row.checkInTime || '—'}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Check-Out</div>
                            <div className="text-sm font-medium">{row.checkOutTime || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">Slip: {row.loadingSlipNo}</div>
                        <div className="text-sm text-gray-900">Qty: {row.qty}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">Remarks: {row.remarks || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          row.freight === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {row.freight}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredData.map((row, index) => (
                <div key={index} className="p-4 hover:bg-blue-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 uppercase">{row.truckNo || '—'}</h4>
                      <p className="text-sm text-gray-500">{formatDateTime(row.transactionDate)}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      row.freight === 'Paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {row.freight}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Plant</p>
                      <p className="text-sm">{row.plantName || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Priority</p>
                      <p className="text-sm">{row.priority}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Check-In</p>
                      <p className="text-sm font-medium">{row.checkInTime || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Check-Out</p>
                      <p className="text-sm font-medium">{row.checkOutTime || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Loading Slip</p>
                      <p className="text-sm">{row.loadingSlipNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <p className="text-sm">{row.qty}</p>
                    </div>
                  </div>
                  
                  {row.remarks && (
                    <div className="mt-3">
                      <p className="text-xs text-gray-500">Remarks</p>
                      <p className="text-sm text-gray-700">{row.remarks}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && reportData.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="mx-auto h-40 w-40 text-indigo-100">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No movement records found</h3>
            <p className="mt-2 text-gray-500">Adjust your filters and generate a new report to view data</p>
            <button
              onClick={fetchReport}
              className="mt-6 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-medium rounded-lg shadow hover:shadow-md transition-all hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Generate Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}