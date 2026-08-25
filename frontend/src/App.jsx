import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Analyzer from "./pages/Analyzer";
import History from "./pages/History";
import Problems from "./pages/Problems";
import ProblemDetails from "./pages/ProblemDetails";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Analyzer />} />

        <Route path="/analyzer" element={<Analyzer />} />

        <Route path="/history" element={<History />} />

        <Route path="/analyzer/:id" element={<Analyzer />} />

        <Route path="/problems" element={<Problems />} />

        <Route
          path="/problems/:id"
          element={<ProblemDetails />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;