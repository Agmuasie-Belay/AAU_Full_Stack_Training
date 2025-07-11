import React from "react";
import { useState, useRef, useEffect } from "react";
import { Eye, EditIcon, Delete, X } from "lucide-react";
import EditMemberModal from "./EditMemberModal";
//import DeleteBook from ".components/books/DeleteBook";
export default function MemberCard({
  id,
   name,
          email,
          phone, 
          join_date,
 borrows
}) {
  const hasBorrows = borrows > 0;
  const statusText = hasBorrows ? `${borrows} Active`  : `${borrows} Active`;
  const statusClass = hasBorrows
    ? "bg-black text-white"
    : "bg-gray-200 text-white";

  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deletdCaller, setDeleteCaller] = useState(false);
  const modalRef = useRef(null);
  const modalRefEdit = useRef(null);
  const handleShowDetails = () => setShowDetails(true);
  const handleClose = () => {
    setShowDetails(false);
    setDeleteCaller(false);
    setShowEdit(false);
  };

  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = () => setShowEdit(true);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (modalRef.current && !modalRef.current.contains(event.target)) ||
        (modalRefEdit.current && !modalRefEdit.current.contains(event.target))
      ) {
        setShowDetails(false);
        setShowEdit(false);
      }
    };

    if (showDetails || showEdit) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDetails || showEdit]);

  return (
    <div>
      <div className="grid grid-cols-1  rounded-md overflow-auto border border-gray-200 bg-white p-4 hover:shadow-gray-200 hover:shadow-md">
        <div className="flex justify-between">
          <h3 className="font-bold text-lg text-left truncate" name={name}>
            {name}
          </h3>
          <p
            className={`bg-black text-white px-4 rounded-2xl text-[12px] py-0 h-fit font-bold ${statusClass}`}
          >
            {statusText}
          </p>
        </div>
        <p
          className="text-gray-700 text-[14px] text-left truncate"
          title={email}
        >
          {email || "Unknown email"}
        </p>
        <p className="text-gray-600 mt-4 text-left text-sm">
          <span className="font-semibold">Phone </span> {phone}
        </p>
        <p className="text-gray-600 mt-2 text-left text-sm">
          <span className="font-semibold">Joined</span>{" "}
          {join_date}
        </p>
        <p className="text-gray-600 mt-2 text-left text-sm">
          <span className="font-semibold">Active Borrows:</span>{" "}
          {borrows}
        </p>

        <div className="mt-4 text-right flex flex-row justify-end gap-6">
          <span>
            <button onClick={handleShowDetails}>
              <Eye />
            </button>
          </span>
          <span>
            <button onClick={() => setShowEditModal(true)}>
              <EditIcon />
            </button>
          </span>
          <span>
            <button onClick={() => setDeleteCaller(true)}>
              <Delete />
            </button>
          </span>
        </div>
      </div>

      {/* {deletdCaller && (
        <div className="fixed w-full inset-0 flex items-center justify-center bg-gray-400/75 z-50">
          <div className="mt-2 p-4 flex flex-col gap-2 w-100 rounded-md bg-white">
            <h1 className="font-semibold">Delete Book </h1>
            <div>Are you sure you want to delete {title}? This
            action cannot be undone.</div>
            <div className="w-40 flex mr-20 ">
               <DeleteBook bookId={id} onSuccess={onDelete}  
            /> <button
            onClick={handleClose}
            className="text-gray-500 ml-4 bg-gray-200 px-4 rounded-sm hover:text-gray-700 z-50"
          >
            Cancel
          </button>
            </div>
            
          </div>
          
        </div>
      )} */}

      {showDetails && (
        <div className="fixed w-full inset-0 flex items-center justify-center bg-gray-400/75 z-50">
          <div
            ref={modalRef}
            className="bg-white p-6 px-4 rounded-md shadow-lg w-full max-w-md z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col ">
                <h2 className="text-lg text-left font-semibold">{name}</h2>
                <p className="text-gray-600 text-left">Details</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <X />
              </button>
            </div>
            <div className="text-left flex flex-col gap-4">
              <div>
                <strong>Name</strong>{" "} {name}
              </div>
              <div>
                <strong>Email</strong> {" "} {email}
              </div>
              <div>
                <strong>Phone</strong>{" "}  {phone}
              </div>
              <div>
                <strong>Joined</strong> {" "} {join_date}
              </div>
              <div>
                <strong>Active borrows:</strong> {borrows}
              </div>
              <div>
                <strong>Status:</strong> {borrows}
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <EditMemberModal
          memberId={id}
          onClose={() => setShowEditModal(false)}
          //onUpdateSuccess={refreshBooksList} // optional callback to refresh list
        />
      )}
    </div>
  );
}
