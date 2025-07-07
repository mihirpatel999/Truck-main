// // src/CancelButton.jsx
// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function CancelButton() {
//   const navigate = useNavigate();

//   return (
//     <div className="flex justify-end mb-4">
//       <button
//         onClick={() => navigate('/home')}
//         className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg shadow"
//       >
//         Cancel
//       </button>
//     </div>
//   );
// }

// src/CancelButton.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CancelButton() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={() => navigate('/home')}
        className="text-white bg-red-600 hover:bg-red-700 rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold shadow"
        title="Cancel"
      >
        &times;
      </button>
    </div>
  );
}

