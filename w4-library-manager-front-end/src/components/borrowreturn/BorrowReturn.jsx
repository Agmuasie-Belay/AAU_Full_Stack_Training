import React, { useEffect, useState } from "react";
import axios from "axios";
import BorrowReturnCard from "./BorrowReturnCard";
import { ArrowRightLeftIcon, X } from "lucide-react";

export default function BorrowReturn() {
  const [borrows, setBorrows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [selectedBorrowId, setSelectedBorrowId] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    fetchBorrowRecords();
  }, []);

  const fetchBorrowRecords = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.get("http://localhost:3000/borrow-records", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const enhanced = res.data.map((b) => {
        const today = new Date();
        const due = new Date(b.due_date);
        const returned = b.return_date !== null;

        let status = "ACTIVE";
        if (returned) status = "RETURNED";
        else if (due < today) status = "OVERDUE";

        return {
          id: b.id,
          book_id: b.book?.id,
          book_title: b.book?.title || "Unknown Title",
          member_name: b.member?.name || "Unknown Member",
          borrow_date: b.borrow_date,
          due_date: b.due_date,
          returned_date: b.return_date,
          status,
        };
      });

      setBorrows(enhanced);
    } catch (err) {
      console.error("Failed to fetch borrow records:", err);
    }
  };

  const openBorrowModal = async () => {
    setShowModal(true);
    const token = localStorage.getItem("accessToken");

    try {
      const [bookRes, memberRes] = await Promise.all([
        axios.get("http://localhost:3000/books", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:3000/members", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setBooks(bookRes.data);
      setMembers(memberRes.data);
    } catch (error) {
      console.error("Error fetching books or members:", error);
    }
  };

  const handleBorrow = async () => {
    const book = books.find((b) => b.id === Number(selectedBookId));
    if (!book || book.available_copies < 1) {
      alert("No copies available for the selected book.");
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        "http://localhost:3000/borrow-records/borrow",
        {
          book_id: Number(selectedBookId),
          member_id: Number(selectedMemberId),
          due_date: dueDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowModal(false);
      setSelectedBookId("");
      setSelectedMemberId("");
      fetchBorrowRecords();
    } catch (error) {
      console.error("Failed to borrow book:", error);
    }
  };

  const handleReturn = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      await axios.post(
        `http://localhost:3000/borrow-records/return`,
        {
          borrow_record_id: Number(selectedBorrowId),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowReturnModal(false);
      setSelectedBorrowId("");
      fetchBorrowRecords();
    } catch (error) {
      console.error("Failed to return book:", error);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-row justify-between m-6">
        <div className="flex flex-col text-left">
          <span className="text-2xl font-bold mt-4">Borrow & Return</span>
          <span className="text-gray-600">
            Manage book borrowing and return operations
          </span>
        </div>
        <div>
          <button
            onClick={openBorrowModal}
            className="bg-black h-fit text-white p-2 pl-4 pr-4 mt-6 rounded-md hover:bg-gray-700"
          >
            <div className="flex flex-row min-w-30">
              <ArrowRightLeftIcon /> <span>Borrow Book</span>
            </div>
          </button>
          <button
            onClick={() => setShowReturnModal(true)}
            className="bg-white ml-2 h-fit p-2 pl-4 pr-4 mt-6 rounded-md hover:bg-gray-200 border border-gray-200"
          >
            <div className="flex flex-row min-w-30">
              <ArrowRightLeftIcon /> <span>Return Book</span>
            </div>
          </button>
        </div>
      </div>

      {/* Borrow Cards */}
      <div className="p-6 w-full grid grid-cols-1 gap-6">
        {borrows.map((borrow) => (
          <BorrowReturnCard
            key={borrow.id}
            borrow={borrow}
            onReturn={() => setShowReturnModal(true)}
          />
        ))}
      </div>

      {/* Borrow Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Borrow Book</h2>
              <button onClick={() => setShowModal(false)}>
                <X />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Select a book and member to create a new borrow record.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">Select Book</label>
                <select
                  value={selectedBookId}
                  onChange={(e) => setSelectedBookId(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Choose a book to borrow</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.available_copies} copies)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Select Member
                </label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Choose a member</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <div>
                  Borrow Date: <strong>{today}</strong>
                </div>
                <div>
                  Due Date: <strong>{dueDate}</strong>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleBorrow}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Borrow Book
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Return Book</h2>
              <button onClick={() => setShowReturnModal(false)}>
                <X />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">
              Select a borrowed book to mark as returned.
            </p>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium">
                  Select Book to Return
                </label>
                <select
                  value={selectedBorrowId}
                  onChange={(e) => setSelectedBorrowId(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Choose a book to return</option>
                  {borrows
                    .filter(
                      (b) => b.status === "ACTIVE" || b.status === "OVERDUE"
                    )
                    .map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.book_title} (Borrowed by: {b.member_name})
                      </option>
                    ))}
                </select>
              </div>

              <div className="text-sm text-gray-600 mt-2">
                Return Date: <strong>{today}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleReturn}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Return Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
