import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Analyzer from "./pages/Analyzer";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Analyzer />} />
        <Route path="/history" element={<History />} />
        <Route path="/analyzer/:id" element={<Analyzer />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;