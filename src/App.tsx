import {
  Header,
  Footer,
  FiveGSpectraPage,
  Side,
  NFSiteListPage,
  LocationPage,
} from "./components";
import { Routes, Route } from "react-router-dom";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Header />
      <div className="pages">
        <Routes>
          <Route path="/home" element={<Side />} />
          <Route path="/nf-configuration" element={<FiveGSpectraPage />} />
          <Route path="/nf-registration" element={<NFSiteListPage />} />
          <Route path="/site-registration" element={<LocationPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
