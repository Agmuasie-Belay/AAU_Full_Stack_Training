import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Books from "./components/books/Books";
import BorrowReturn from "./components/borrowreturn/BorrowReturn";
import Genres from "./components/genres/Genres";
import Members from "./components/members/Members";
import Reports from "./components/reports/Reports";
import Staff from "./components/staffs/Staff";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/Profile";
import { Routes, Route, BrowserRouter } from "react-router-dom"; // ❌ remove BrowserRouter

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/profile" element={<Profile />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<Books />} />
          <Route path="borrow-return" element={<BorrowReturn />} />
          <Route path="members" element={<Members />} />
          <Route path="staff" element={<Staff />} />
          <Route path="reports" element={<Reports />} />
          <Route path="genres" element={<Genres />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
