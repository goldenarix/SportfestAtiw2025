// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';

// // Animation variants to match your app's style
// const pageVariants = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
//   exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
// };

// const TestPage = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         // Change the URL to match your backend server address
//         const response = await fetch('http://localhost:3001/api/test');
        
//         if (!response.ok) {
//           throw new Error(`HTTP error: ${response.status}`);
//         }
        
//         const result = await response.json();
//         setData(result.data || []);
//         setError(null);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <motion.div 
//       className="p-6"
//       initial="initial"
//       animate="animate"
//       exit="exit"
//       variants={pageVariants}
//     >
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Database Test</h1>
//         <p className="text-slate-600 dark:text-slate-300">
//           Testing connection to Oracle database
//         </p>
//       </div>
      
//       {loading && (
//         <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
//           <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-slate-500 dark:border-slate-400 animate-spin"></div>
//           <span>Loading data from database...</span>
//         </div>
//       )}
      
//       {error && (
//         <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded mb-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700 dark:text-red-400">Error connecting to database: {error}</p>
//               <p className="text-sm text-red-600 dark:text-red-300 mt-1">
//                 Make sure your backend server is running and properly configured.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {!loading && !error && data.length === 0 && (
//         <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-yellow-700 dark:text-yellow-400">No data found in the database.</p>
//               <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
//                 The query executed successfully but returned no results.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {!loading && !error && data.length > 0 && (
//         <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
//           <div className="px-4 py-5 sm:px-6 border-b border-slate-200 dark:border-slate-700">
//             <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
//               Database Results
//             </h3>
//             <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
//               Showing {data.length} rows from your Oracle database
//             </p>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
//               <thead className="bg-slate-50 dark:bg-slate-700/50">
//                 <tr>
//                   {Object.keys(data[0]).map((key) => (
//                     <th key={key} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
//                       {key}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
//                 {data.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
//                     {Object.keys(item).map((key) => (
//                       <td key={`${idx}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
//                         {item[key] !== null ? String(item[key]) : 
//                           <span className="text-slate-400 dark:text-slate-500 italic">null</span>}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default TestPage;




// // src/pages/TestPage.jsx - Display all tables
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';

// // Animation variants
// const pageVariants = {
//   initial: { opacity: 0, y: 20 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
//   exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
// };

// const cardVariants = {
//   initial: { opacity: 0, y: 10 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
// };

// const TestPage = () => {
//   const [backendStatus, setBackendStatus] = useState('checking');
//   const [tableData, setTableData] = useState({
//     betreuer: { data: [], loading: true, error: null },
//     teams: { data: [], loading: true, error: null },
//     disziplins: { data: [], loading: true, error: null },
//     ergebnisse: { data: [], loading: true, error: null }
//   });

//   // First check if backend is available
//   useEffect(() => {
//     const checkBackend = async () => {
//       try {
//         // Try direct connection to backend
//         const response = await fetch('http://localhost:3001/api', {
//           method: 'GET',
//           headers: {
//             'Accept': 'application/json',
//           },
//         });
        
//         if (response.ok) {
//           setBackendStatus('available');
//           console.log('Backend is available on http://localhost:3001/api');
//         } else {
//           setBackendStatus('error');
//           console.error('Backend returned error:', response.status);
//         }
//       } catch (err) {
//         console.error('Error connecting to backend:', err);
//         setBackendStatus('unavailable');
//       }
//     };
    
//     checkBackend();
//   }, []);

//   // Then fetch data from all tables if backend is available
//   useEffect(() => {
//     if (backendStatus !== 'available') return;
    
//     const fetchAllData = async () => {
//       // List of tables to fetch
//       const tables = [
//         { name: 'betreuer', endpoint: '/api/betreuer' },
//         { name: 'teams', endpoint: '/api/teams' },
//         { name: 'disziplins', endpoint: '/api/disziplins' },
//         { name: 'ergebnisse', endpoint: '/api/ergebnisse' }
//       ];
      
//       // Fetch data for each table
//       for (const table of tables) {
//         try {
//           console.log(`Fetching data from ${table.name}...`);
          
//           // Update loading state
//           setTableData(prev => ({
//             ...prev,
//             [table.name]: {
//               ...prev[table.name],
//               loading: true,
//               error: null
//             }
//           }));
          
//           // Fetch data
//           const response = await fetch(`http://localhost:3001${table.endpoint}`, {
//             method: 'GET',
//             headers: {
//               'Accept': 'application/json',
//               'Content-Type': 'application/json'
//             },
//           });
          
//           console.log(`${table.name} response status:`, response.status);
          
//           if (!response.ok) {
//             throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
//           }
          
//           // Check content type
//           const contentType = response.headers.get('content-type');
//           if (!contentType || !contentType.includes('application/json')) {
//             const text = await response.text();
//             console.error(`Received non-JSON response for ${table.name}:`, text.substring(0, 100) + '...');
//             throw new Error('Received non-JSON response from server');
//           }
          
//           // Parse JSON
//           const result = await response.json();
//           console.log(`${table.name} data received:`, result);
          
//           // Update state
//           if (result.success) {
//             setTableData(prev => ({
//               ...prev,
//               [table.name]: {
//                 data: result.data || [],
//                 loading: false,
//                 error: null
//               }
//             }));
//           } else {
//             throw new Error(result.error || 'Unknown error');
//           }
//         } catch (err) {
//           console.error(`Error fetching ${table.name} data:`, err);
//           setTableData(prev => ({
//             ...prev,
//             [table.name]: {
//               ...prev[table.name],
//               loading: false,
//               error: err.message
//             }
//           }));
//         }
//       }
//     };

//     fetchAllData();
//   }, [backendStatus]);

//   // Render a table component
//   const renderTable = (tableName, title) => {
//     const { data, loading, error } = tableData[tableName];
    
//     return (
//       <motion.div 
//         className="mb-10"
//         variants={cardVariants}
//         initial="initial"
//         animate="animate"
//       >
//         <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{title}</h2>
        
//         {loading && (
//           <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
//             <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-slate-500 dark:border-slate-400 animate-spin"></div>
//             <span>Loading data from {title}...</span>
//           </div>
//         )}
        
//         {error && (
//           <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded mb-4">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700 dark:text-red-400">Error retrieving {title}: {error}</p>
//                 <p className="text-sm text-red-600 dark:text-red-300 mt-1">
//                   Backend is running, but there was an error fetching the data.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {!loading && !error && data.length === 0 && (
//           <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-yellow-700 dark:text-yellow-400">No data found in the {title} table.</p>
//                 <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
//                   The table exists but may be empty.
//                 </p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {!loading && !error && data.length > 0 && (
//           <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
//             <div className="px-4 py-5 sm:px-6 border-b border-slate-200 dark:border-slate-700">
//               <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
//                 {title} Data
//               </h3>
//               <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
//                 Showing {data.length} rows from the {title} table
//               </p>
//             </div>
            
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
//                 <thead className="bg-slate-50 dark:bg-slate-700/50">
//                   <tr>
//                     {Object.keys(data[0]).map((key) => (
//                       <th key={key} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
//                         {key}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
//                   {data.map((item, idx) => (
//                     <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
//                       {Object.keys(item).map((key) => (
//                         <td key={`${idx}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
//                           {item[key] !== null ? String(item[key]) : 
//                             <span className="text-slate-400 dark:text-slate-500 italic">null</span>}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </motion.div>
//     );
//   };

//   return (
//     <motion.div 
//       className="p-6"
//       initial="initial"
//       animate="animate"
//       exit="exit"
//       variants={pageVariants}
//     >
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Database Test Page</h1>
//         <p className="text-slate-600 dark:text-slate-300">
//           Displaying data from all tables in your Oracle database
//         </p>
//       </div>
      
//       {backendStatus === 'checking' && (
//         <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
//           <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-slate-500 dark:border-slate-400 animate-spin"></div>
//           <span>Checking backend connection...</span>
//         </div>
//       )}
      
//       {backendStatus === 'unavailable' && (
//         <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded mb-4">
//           <div className="flex">
//             <div className="flex-shrink-0">
//               <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//               </svg>
//             </div>
//             <div className="ml-3">
//               <p className="text-sm text-red-700 dark:text-red-400">Backend server is not available at http://localhost:3001/api</p>
//               <p className="text-sm text-red-600 dark:text-red-300 mt-1">
//                 Make sure your backend server is running with: <code>node server.js</code>
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
      
//       {backendStatus === 'available' && (
//         <div className="space-y-6">
//           {renderTable('betreuer', 'Betreuer')}
//           {renderTable('teams', 'Teams')}
//           {renderTable('disziplins', 'Disziplinen')}
//           {renderTable('ergebnisse', 'Ergebnisse')}
//         </div>
//       )}
//     </motion.div>
//   );
// };

// export default TestPage;

















// src/pages/TestPageOptimized.jsx - Optimized version using all-tables endpoint
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const cardVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
};

const TestPageOptimized = () => {
  const [backendStatus, setBackendStatus] = useState('checking');
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('betreuer');

  // Check backend and fetch all data at once
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setBackendStatus('checking');
        setLoading(true);
        
        console.log('Fetching data from all tables...');
        const response = await fetch('http://localhost:3001/api/all', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          setBackendStatus('error');
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        
        // Check content type
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Received non-JSON response:', text.substring(0, 100) + '...');
          throw new Error('Received non-JSON response from server');
        }
        
        // Parse JSON
        const result = await response.json();
        console.log('Data received:', result);
        
        if (result.success) {
          setAllData(result.data);
          setBackendStatus('available');
          setError(null);
        } else {
          throw new Error(result.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
        setBackendStatus('unavailable');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Render a table component
  const renderTable = (tableName, data) => {
    if (!data || data.length === 0) {
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">No data found in the {tableName} table.</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-300 mt-1">
                The table exists but may be empty.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-medium leading-6 text-slate-900 dark:text-white">
            {tableName} Data
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Showing {data.length} rows from the {tableName} table
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                {Object.keys(data[0]).map((key) => (
                  <th key={key} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  {Object.keys(item).map((key) => (
                    <td key={`${idx}-${key}`} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">
                      {item[key] !== null ? String(item[key]) : 
                        <span className="text-slate-400 dark:text-slate-500 italic">null</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className="p-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Database Test Page</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Displaying data from all tables in your Oracle database
        </p>
      </div>
      
      {backendStatus === 'checking' && loading && (
        <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400">
          <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-slate-500 dark:border-slate-400 animate-spin"></div>
          <span>Loading data from database...</span>
        </div>
      )}
      
      {backendStatus === 'unavailable' && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-400">Backend server is not available: {error}</p>
              <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                Make sure your backend server is running with: <code>node server.js</code>
              </p>
            </div>
          </div>
        </div>
      )}
      
      {backendStatus === 'available' && allData && (
        <div className="space-y-6">
          {/* Tab navigation */}
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('betreuer')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'betreuer'
                    ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                Betreuer
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'teams'
                    ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                Teams
              </button>
              <button
                onClick={() => setActiveTab('disziplins')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'disziplins'
                    ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                Disziplinen
              </button>
              <button
                onClick={() => setActiveTab('ergebnisse')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ergebnisse'
                    ? 'border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-300'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                Ergebnisse
              </button>
            </nav>
          </div>
          
          {/* Table content based on active tab */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'betreuer' && renderTable('Betreuer', allData.betreuer)}
            {activeTab === 'teams' && renderTable('Teams', allData.teams)}
            {activeTab === 'disziplins' && renderTable('Disziplinen', allData.disziplins)}
            {activeTab === 'ergebnisse' && renderTable('Ergebnisse', allData.ergebnisse)}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default TestPageOptimized;