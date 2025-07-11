import React from "react";

export default function Profile() {
  const user = JSON.parse(localStorage.getItem("userInfo")) || {};
  const {
    username = "N/A",
    email = "N/A",
    role = "N/A",
    phone = "(555) 123-4567",
    created_at = "January 2024",
  } = user;

  const roleLabel = role.toUpperCase();

  return (
    <>
      {role === "admin" && (
        <div className="w-full text-left p-6  bg-gray-100 ">
          <h2 className="text-3xl font-bold mb-2">Profile</h2>
          <p className="text-gray-600 mb-4">
            View your account information and permissions
          </p>

          <div className="w-full md:w-2/3">
            <div className="flex flex-col p-4 bg-white rounded-2xl shadow-sm">
              <div className="mb-6 ">
                <h3 className="text-xl font-semibold mb-2">{username}</h3>
                <p className="uppercase text-sm text-gray-500">{roleLabel}</p>
              </div>

              <div className="mb-6">
                <h4 className="text-[16pt] font-semibold mb-2">
                  Basic Information
                </h4>
                <div className="text-sm text-gray-700 space-y-6">
                  <div className="flex flex-col p-4 bg-gray-100 rounded-md">
                    <p>Username:</p> <p>{username}</p>
                  </div>
                  <div className="flex flex-col p-4 bg-gray-100 rounded-md">
                    <p>Email Address:</p>
                    <p> {email}</p>
                  </div>
                  <div className="flex flex-col p-4 bg-gray-100 rounded-md">
                    <p>Phone Number:</p>
                    <p> {phone}</p>
                  </div>
                  <div className="flex flex-col p-4 bg-gray-100 rounded-md">
                    <p>Role:</p>
                    <p>{roleLabel}</p>
                  </div>
                  <div className="flex flex-col p-4 bg-gray-100 rounded-md">
                    <p>Member Since:</p>
                    <p> {created_at}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col  p-4 bg-white rounded-2xl shadow-sm mt-6">
              <h4 className="text-md font-semibold mb-2">
                Permissions & Access
              </h4>
              <ul className="text-sm text-gray-700 list-disc pl-5 space-y-3">
                <li>Full system administration access</li>
                <li>Manage all books, members, and genres</li>
                <li>Delete records and manage staff</li>
                <li>Access all reports and analytics</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {role === "librarian" && (
        <div className="w-full text-left p-6 bg-gray-100">
          <h2 className="text-3xl font-bold mb-2">Profile</h2>
          <p className="text-gray-600 mb-4">
            View your account information and permissions
          </p>

          <div className="w-full md:w-2/3">
            <div className="flex flex-col p-4 bg-white rounded-2xl shadow-sm">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{username}</h3>
                <p className="uppercase text-sm text-gray-500">LIBRARIAN</p>
              </div>

              <div className="mb-6">
                <h4 className="text-[16pt] font-semibold mb-2">
                  Basic Information
                </h4>
                <div className="text-sm text-gray-700 space-y-6">
                  <div className="flex flex-col p-4 bg-gray-100 rounded-md">
                    <p>Username:</p> <p>{username}</p>
                  </div>
                  <div className="flex flex-col p-4 bg-gray-100 rounded-md">
                    <p>Email Address:</p>
                    <p>{email}</p>
                  </div>
                  <div className="flex flex-col p-4 bg-gray-100 rounded-md">
                    <p>Phone Number:</p>
                    <p>{phone}</p>
                  </div>
                  <div className="flex flex-col p-4 bg-gray-100 rounded-md">
                    <p>Role:</p>
                    <p>{roleLabel}</p>
                  </div>
                  <div className="flex flex-col p-4 bg-gray-100 rounded-md">
                    <p>Member Since:</p>
                    <p>{created_at}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col p-4 bg-white rounded-2xl shadow-sm mt-6">
              <h4 className="text-md font-semibold mb-2">
                Permissions & Access
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Your current role permissions
              </p>
              <ul className="text-sm text-gray-700 list-disc pl-5 space-y-3">
                <li>Manage books and members</li>
                <li>Handle borrow/return operations</li>
                <li>View basic reports</li>
                <li>Cannot delete records or manage genres</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
