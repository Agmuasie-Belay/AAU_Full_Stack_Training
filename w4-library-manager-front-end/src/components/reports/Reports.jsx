import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertCircle,
  BarChart2,
  Calendar,
  Clock,
  TrendingUp,
  Book,
  User,
  ArrowRightLeftIcon,
  AlertTriangleIcon,
  LineChart
} from "lucide-react";

export default function Reports() {
  const [overdueBooks, setOverdueBooks] = useState([]);
  const [popularGenres, setPopularGenres] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState({
    overdue: true,
    genres: true,
    summary: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const [overdueRes, genresRes, summaryRes] = await Promise.all([
        axios.get("http://localhost:3000/borrow-records/reports/overdue", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(
          "http://localhost:3000/borrow-records/reports/popular-genres",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        ),
        axios.get("http://localhost:3000/borrow-records/reports/summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setOverdueBooks(overdueRes.data);
      setPopularGenres(genresRes.data);
      setSummary(summaryRes.data);
      setLoading({ overdue: false, genres: false, summary: false });
    } catch (err) {
      console.error("Failed to fetch report data:", err);
      setError(err.message);
    }
  };

  console.log(summary)

  const getDaysOverdue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = today - due;
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="flex flex-col w-full p-6 space-y-8">

      <div className="flex flex-col text-left space-y-2">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-600">Library analytics and reports</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle className="mr-2" size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="border-gray-200 bg-white rounded-lg shadow shadow-gray-200 p-6">
          <div className="flex items-center ">
            <AlertTriangleIcon className="text-red-500 mr-2" size={20} />
            <h2 className="text-xl font-semibold">Overdue Books</h2>
          </div>
          <p className="text-gray-500 text-left mb-4">
            Books that are past their due date
          </p>

          {loading.summary ? (
            <div className="animate-pulse h-24 bg-gray-200 rounded" />
          ) : overdueBooks.length > 0 ? (
            <div className="space-y-4">
              {overdueBooks.map((book) => (
                <div
                  key={book.id}
                  className="flex justify-between bg-red-50 rounded-md p-4 last:border-b-0"
                >
                  <div>
                    <div className="text-left font-medium">{book.book.title}</div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <User className="mr-1" size={14} />
                      <span>Member: {book.member.name}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <Calendar className="mr-1" size={14} />
                      <span>
                        Due: {new Date(book.due_date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className=" bg-red-800 h-fit px-2 rounded-2xl text-white text-sm mt-1">
                    {getDaysOverdue(book.due_date)} days overdue
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No overdue books</div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BarChart2 className="text-blue-500 mr-2" size={20} />
            <h2 className="text-xl font-semibold">Popular Genres</h2>
          </div>
          <p className="text-gray-500 text-left mb-4">Most borrowed book genres</p>

          {loading.summary ? (
            <div className="animate-pulse h-24 bg-gray-200 rounded" />
          ) : popularGenres.length > 0 ? (
            <div className="space-y-3">
              {popularGenres.map((genre, index) => (
                <div
                  key={genre.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-2">#{index + 1}</span>
                    <span className="capitalize">{genre.genre_name}</span>
                  </div>
                  <span className="text-gray-600">{genre?.borrow_count} borrows</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No genre data available</div>
          )}
        </div>
      </div>
      {/* ---BOTTOM ROW--- */}
      <div className="grid grid-cols-1 gap-x-6 md:grid-cols-3 ">
        {/* Total Borrows */}
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between mb-4">
            
            <h2 className="text-md font-semibold">Total Borrows This Month</h2>
         <LineChart className=" mr-2" size={20} />
          </div>

          {loading.summary ? (
            <div className="animate-pulse h-24 bg-gray-200 rounded" />
          ) : summary ? (
            <>
              <div className="text-2xl text-left font-bold mb-2">
                {summary.totalBorrowsThisMonth}
              </div>
              <div className="flex items-center ">
                <TrendingUp className="mr-1" size={16} />
                <span>
                  +{summary.borrows_change_percentage}% from last month
                </span>
              </div>
            </>
          ) : (
            <div className="text-gray-500">No data available</div>
          )}
        </div>

      
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-md font-semibold">Average Borrow Duration</h2>
          <LineChart className=" mr-2" size={20} />
            
          </div>

          { summary ? (
            <>
              <div className="text-2xl text-left font-bold mb-2">
                {summary.averageBorrowDuration} days
              </div>
              <div className="flex items-center ">
                <TrendingUp className="mr-1 transform rotate-180" size={16} />
                <span>
                  {summary.averageBorrowDuration} days from last month
                </span>
              </div>
            </>
          ) : (
            <div className="text-gray-500">No data available</div>
          )}
        </div>

        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between mb-4">
            <h2 className="text-md font-semibold">Return Rate</h2>
          <LineChart className=" mr-2" size={20} />
            
          </div>

          { summary ? (
            <>
              <div className="text-2xl text-left font-bold mb-2">
                {summary.returnRate}%
              </div>
              <div className="flex items-center ">
                <TrendingUp className="mr-1" size={16} />
                <span>
                  +{summary.return_rate_change_percentage}% from last month
                </span>
              </div>
            </>
          ) : (
            <div className="text-gray-500">No data available</div>
          )}
        </div>
      </div>
    </div>
  );
}
