import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <AppRoutes />
    </Router>
  );
}

export default App;
