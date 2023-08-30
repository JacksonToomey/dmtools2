import { Route, Routes } from "react-router-dom";
import OwlBearProvider from "./components/OwlbearProvider";
import Main from "./routes/main";

function App() {
  return (
    <OwlBearProvider>
      <div className="p-2">
        <Routes>
          <Route index element={<Main />} />
        </Routes>
      </div>
    </OwlBearProvider>
  );
}

export default App;
