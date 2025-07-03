import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from './pages/Home';
import { Builder } from './pages/Builder';
import { parseXml } from './steps'; // parser for incoming xml, used elsewhere

// Just a sample notification function – not used right now but might be useful later
const notifyUser = (msg) => {
  console.log(`[NOTIFY]: ${msg}`);
};

function App() {
  const [appReady, setAppReady] = useState(false);

  // simulate some async setup on mount
  useEffect(() => {
    // fake delay to simulate config loading
    const timer = setTimeout(() => {
      setAppReady(true);
      // notifyUser("App is ready"); // Might use this later
    }, 300);

    // cleanup if component unmounts
    return () => clearTimeout(timer);
  }, []);

  // just for testing route changes later
  const usePageViews = () => {
    const location = useLocation();
    useEffect(() => {
      // console.log("Current path:", location.pathname);
    }, [location]);
  };

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

// extracted for clarity, easier testing if we want to add auth later
function AppRoutes() {
  // maybe add usePageViews() here in future
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/builder" element={<Builder />} />
      {/* other routes might come here later */}
    </Routes>
  );
}

export default App;
