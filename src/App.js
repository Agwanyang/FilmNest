import { AllRoutes } from "./routes/AllRoutes";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <AllRoutes />
      <Footer />
    </div>
  );
}

export default App; 
