import { CalendarDays, User2, BookOpen } from "lucide-react";

export default function BorrowCard({ borrow, onReturn }) {
  const {
    book_title,
    member_name,
    borrow_date,
    due_date,
    returned_date,
    status // 'ACTIVE', 'RETURNED', 'OVERDUE'
  } = borrow;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US");

  // Apply status class manually
  let statusClass = "text-xs font-semibold px-3 py-1 rounded-full";
  if (status === "ACTIVE") {
    statusClass += " bg-black text-white";
  } else if (status === "RETURNED") {
    statusClass += " bg-gray-100 text-gray-800";
  } else if (status === "OVERDUE") {
    statusClass += " bg-red-500 text-white";
  }

  return (
    <div className="p-4 border border-gray-200 rounded shadow-sm bg-white flex justify-between items-center">
      <div>
        <div className="flex items-center gap-2 mb-1 font-bold text-lg">
          <BookOpen size={18} />
          {book_title}
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User2 size={16} /> {member_name}
        </div>

        <div className="mt-2 flex gap-6 text-sm text-gray-700">
          <div className="flex items-center gap-1">
            <CalendarDays size={16} />
            <span>Borrowed: {formatDate(borrow_date)}</span>
          </div>

          <div className="flex items-center gap-1">
            <CalendarDays size={16} />
            <span>Due: {formatDate(due_date)}</span>
          </div>

          {returned_date && (
            <div className="flex items-center gap-1">
              <CalendarDays size={16} />
              <span>Returned: {formatDate(returned_date)}</span>
            </div>
          )}
        </div>

        {status === "ACTIVE" && (
          <button
            onClick={onReturn}
            className="mt-4 px-4 py-1 bg-black text-white rounded"
          >
            Mark as Returned
          </button>
        )}
      </div>

      <div>
        <span className={statusClass}>
          {status}
        </span>
      </div>
    </div>
  );
}
