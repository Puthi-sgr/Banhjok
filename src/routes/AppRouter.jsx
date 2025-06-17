import { Route, Routes } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";

const AppRouter = () => {
  return (
    <>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}



        {/* Client Routes */}


      </Routes>
    </>
  );
};

export default AppRouter;
