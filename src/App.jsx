
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Maincontainer from "./components/Maincontainer";

function App() {
  

  return (
    <>
    <BrowserRouter basename="/">
    <Routes>
      <Route path="/" element={<Maincontainer/>}>
      <Route path="/login" element={<div>login</div>}/>
      </Route>
    
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
