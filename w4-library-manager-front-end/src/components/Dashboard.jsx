import {
  ArrowRightLeft,
  Shield,
  BookOpen,
  ArrowLeftRightIcon,
  Users,
  UserIcon,
  Plus,
  Settings,
  LineChartIcon,
  AlertTriangleIcon,
  ShieldIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalBorrows, setTotalBorrows] = useState(0);
  const [overdueBooks, setOverdueBooks] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        if (["admin", "librarian"].includes(role)) {
          const [booksRes, membersRes, overdueRes, borrowRes] = await Promise.all([
            axios.get("http://localhost:3000/books", { headers }),
            axios.get("http://localhost:3000/members", { headers }),
            axios.get("http://localhost:3000/borrow-records/reports/overdue/", { headers }),
            axios.get("http://localhost:3000/borrow-records", { headers }),
          ]);

          setTotalBooks(booksRes.data.length);
          setTotalMembers(membersRes.data.length);
          setOverdueBooks(overdueRes.data.length);
          setTotalBorrows(borrowRes.data.length);

          const recent = borrowRes.data
            .sort((a, b) => {
              const aDate = new Date(a.return_date || a.borrow_date);
              const bDate = new Date(b.return_date || b.borrow_date);
              return bDate - aDate;
            })
            .slice(0, 5);

          setRecentActivities(recent);
        }

        // Example: basic user sees only borrowed records
        else if (role === "member") {
          const response = await axios.get("http://localhost:3000/borrow-records", { headers });

          setTotalBorrows(response.data.length);

          const recent = response.data
            .sort((a, b) => {
              const aDate = new Date(a.return_date || a.borrow_date);
              const bDate = new Date(b.return_date || b.borrow_date);
              return bDate - aDate;
            })
            .slice(0, 5);

          setRecentActivities(recent);
        }

        // You can expand more role-specific logic as needed
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      }
    };

    if (token && role) {
      fetchData();
    }
  }, [token, role]);

  return (
    <div className="flex flex-col flex-1 bg-gray-50 min-w-[calc(100%-16rem)] h-full  p-6">
      {/*---HEADER--- */}
      {role === "admin" && (
        <div>
          <div className="flex gap-x-2">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <span className="flex bg-red-600 h-fit rounded-2xl text-white text-[12px] px-2 py-0.5  mt-1 font-bold">
              <span className="flex">
                <Shield className="w-4 h-4" />
              </span>
              <span> ADMINISTRATOR</span>
            </span>
          </div>
          <p className="text-left  text-[16px] text-gray-500">
            Full system access - Manage all library operations
          </p>

          <div className="flex flex-row text-left my-6 border border-red-200 bg-red-50 p-6 rounded-[8px]">
            <div className="my-auto mr-4">
              <ShieldIcon className="flex w-8 h-8 text-red-800" />
            </div>
            <div>
              <h2 className="font-bold text-[18px] text-red-900">
                Administrator Access
              </h2>
              <p className="text-red-700">
                You have full system privileges including delete operations,
                genre management, and staff administration.
              </p>
            </div>
          </div>
        </div>
      )}
      {role === "librarian" && (
        <>
          <div className="flex gap-x-2">
            <h1 className="text-3xl font-bold">Librarian Dashboard</h1>
            <span className="flex bg-green-600 h-fit rounded-2xl text-white text-[12px] px-2 py-0.5  mt-1 font-bold">
              <span className="flex">
                <UserIcon className="w-4 h-4" />
              </span>
              <span> LIBRARIAN</span>
            </span>
          </div>
          <p className="text-left  text-[16px] text-gray-500">
            Standard library operations - Books, members, and borrowing
          </p>

          <div className="flex flex-row text-left my-6 border border-green-200 bg-green-50 p-6 rounded-[8px]">
            <div className="my-auto mr-4">
              <UserIcon className="flex w-8 h-8 text-green-800" />
            </div>
            <div>
              <h2 className="font-bold text-[18px] text-green-900">
                Librarian Access
              </h2>
              <p className="text-green-700">
                You can manage books and members, handle borrowing operations,
                and view reports. Contact admin for advanced operations.
              </p>
            </div>
          </div>
        </>
      )}

      {/*---STATS--*/}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
        <div className="rounded-lg border border-gray-200 bg-white text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="font-semibold">Total Books</span>
            <span className="text=right">
              <BookOpen className="w-4 h-4 " />
            </span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-gray-500">All books in system</p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="font-semibold">Total Members</span>
            <span className="text=right">
              <Users className="w-4 h-4 " />
            </span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalMembers}</div>
            <p className="text-xs text-gray-500"></p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="font-semibold">Active Borrows</span>
            <span className="text=right">
              <ArrowLeftRightIcon className="w-4 h-4 " />
            </span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{totalBorrows}</div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <span className="font-semibold">Overdue Books</span>
            <span className="text=right">
              <AlertTriangleIcon className="w-4 h-4 text-red-700" />
            </span>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold text-red-700">
              {overdueBooks}
            </div>
          </div>
        </div>
      </div>

      {/*---QUICK ACTIONS--*/}

      <div className="flex flex-col bg-white rounded-lg shadow-md shadow-gray-200 mt-6 p-6 border border-gray-200">
        <span className="text-left text-2xl font-semibold">Quick Actions</span>
        <span className="text-left text-gray-600 mb-4">
          Administrative and library operations
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/borrow-return">
            <div className="p-4 border bg-black hover:bg-gray-800 text-white  rounded-md cursor-pointer">
              <span className="flex justify-around">
                <ArrowRightLeft className="w-5" />
              </span>
              <span className="font-semibold">Borrow Book</span>
            </div>
          </Link>
          <Link to="/borrow-return">
            <div className="p-4 border border-gray-200  hover:bg-gray-50   rounded-md cursor-pointer">
              <span className="flex justify-around">
                <ArrowRightLeft className="w-5" />
              </span>
              <span className="font-semibold">Return Book</span>
            </div>
          </Link>
          <Link to="/members">
            <div className="p-4 border border-gray-200  hover:bg-gray-50  rounded-md cursor-pointer">
              <span className="flex justify-around">
                <Plus className="w-5" />
              </span>
              <span className="font-semibold">Add Member</span>
            </div>
          </Link>
          <Link to="/books">
            <div className="p-4 border border-gray-200  hover:bg-gray-50 rounded-md cursor-pointer">
              <span className="flex justify-around">
                <Plus className="w-5" />
              </span>
              <span className="font-semibold">Add Book</span>
            </div>
          </Link>
          {role === "admin" && (
            <>
              <Link to="/genres">
                <div className="p-4 border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 rounded-md cursor-pointer">
                  <span className="flex justify-around">
                    <Settings className="w-5" />
                  </span>
                  <span className="font-semibold">Manage Genres</span>
                </div>
              </Link>
              <Link to="/reports">
                <div className="p-4 border border-red-200 bg-red-50 hover:bg-red-100 text-red-800 rounded-md cursor-pointer">
                  <span className="flex justify-around">
                    <LineChartIcon className="w-5" />
                  </span>
                  <span className="font-semibold">Admin Reports</span>
                </div>
              </Link>
            </>
          )}
        </div>
      </div>

      {/*---RECENT ACTIVITY---*/}

      <div className="flex flex-col bg-white rounded-lg shadow-md shadow-gray-200 mt-6 p-6 border border-gray-200">
        <span className="text-left text-2xl font-semibold">
          Recent Activity
        </span>
        <span className="text-left text-gray-600 mb-4">
          System-wide borrow and return operations
        </span>

        <div className="flex flex-col gap-6">
          {recentActivities.map((record) => {
            const isReturn = !!record.return_date;
            const actionLabel = isReturn ? "Returned" : "Borrowed";
            const iconColor = isReturn
              ? "bg-green-100 text-green-600"
              : "bg-blue-100 text-blue-600";
            const activityDate = record.return_date || record.borrow_date;

            return (
              <div
                key={record.id}
                className="flex text-left items-center gap-4 bg-gray-50 p-2 rounded-md "
              >
                <div className={`p-2 rounded-full ${iconColor}`}>
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">
                    {actionLabel}: {record.book?.title || "Unknown Book"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Member: {record.member?.name || "Unknown"} •{" "}
                    {new Date(activityDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
