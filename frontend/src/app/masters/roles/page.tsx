"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { MdDelete, MdEdit } from "react-icons/md";
import Button from "@mui/material/Button";
import { PlusSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import PopupMenu from "../../component/popups/PopupMenu";
import AddButton from "@/app/component/buttons/AddButton";
import PageHeader from "@/app/component/labels/PageHeader";
import MasterProtectedRoute from "@/app/component/MasterProtectedRoutes";

interface RoleType {
  _id?: string;
  Role: string;
  Slug: string;
  Status: string;
}

interface DeleteDialogData {
  id: string;
  role: string;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteDialogData, setDeleteDialogData] = useState<DeleteDialogData | null>(null);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const rowsPerTablePage = 10;
  const router = useRouter();

  // Fetch roles from API (placeholder)
  const fetchRoles = async () => {
    const data = [
      { Role: "Admin", Slug: "admin", Status: "Active" },
      { Role: "Seller", Slug: "seller", Status: "Inactive" },
    ];
    setRoles(data);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Pagination logic
  const totalTablePages = Math.ceil(roles.length / rowsPerTablePage);
  const indexOfLastRow = currentTablePage * rowsPerTablePage;
  const indexOfFirstRow = indexOfLastRow - rowsPerTablePage;
  const currentRows = useMemo(
    () => roles.slice(indexOfFirstRow, indexOfLastRow),
    [roles, indexOfFirstRow, indexOfLastRow]
  );

  const nexttablePage = () => {
    if (currentTablePage !== totalTablePages) setCurrentTablePage(currentTablePage + 1);
  };

  const prevtablePage = () => {
    if (currentTablePage !== 1) setCurrentTablePage(currentTablePage - 1);
  };

  // Delete role
  const handleDelete = async (data: DeleteDialogData | null) => {
    if (!data) return;
    toast.success(`Deleted role: ${data.role}`);
    setIsDeleteDialogOpen(false);
    setDeleteDialogData(null);
  };

  // Edit role
  const handleEdit = (id?: string) => {
    router.push(`/roles/edit?id=${id}`);
  };

  return (
    <MasterProtectedRoute>
      <Toaster position="top-right" />
      <div className="min-h-[calc(100vh-56px)] overflow-auto max-md:py-10">
        

        {/* DELETE POPUP */}
        {isDeleteDialogOpen && deleteDialogData && (
          <PopupMenu onClose={() => { setIsDeleteDialogOpen(false); setDeleteDialogData(null); }}>
            <div className="flex flex-col gap-10 m-2">
              <h2 className="font-bold">Are you sure you want to delete this role?</h2>
              <p>
                Role: <span className="text-gray-600">{deleteDialogData.role}</span>
              </p>
              <div className="flex justify-between items-center">
                <button
                  className="text-[#C62828] bg-[#FDECEA] hover:bg-[#F9D0C4] rounded-md px-4 py-2"
                  onClick={() => handleDelete(deleteDialogData)}
                >
                  Yes, delete
                </button>
                <button
                  className="text-blue-800 hover:bg-gray-200 rounded-md px-4 py-2"
                  onClick={() => { setIsDeleteDialogOpen(false); setDeleteDialogData(null); }}
                >
                  No
                </button>
              </div>
            </div>
          </PopupMenu>
        )}

        {/* Card Container */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 relative">
          <PageHeader title="Dashboard" subtitles={["Roles"]} />
          {/* Add Button */}
          
          <AddButton
               url="/masters/roles/add"
               text="Add"
               icon={<PlusSquare size={18} />}
             />

          {/* Table */}
          <div className="overflow-auto mt-16">
            <table className="table-auto w-full border-collapse text-sm border border-gray-200">
              <thead className="bg-[var(--color-primary)] text-white">
                <tr className="flex justify-between items-center w-full">
                  {/* Left section (S.No + Role + Slug) */}
                  <th className="flex items-center gap-10 px-8 py-3 border border-[var(--color-secondary-dark)] text-left w-1/2">
                    <p className="w-[60px] text-left">S.No.</p>
                    <p className="w-[150px] text-left">Role</p>
                    <p className="w-[150px] text-left">Slug</p>
                  </th>

                  {/* Right section (Status + Action) */}
                  <th className="flex items-center gap-10 px-8 py-3 border border-[var(--color-secondary-dark)] text-left w-1/2 justify-end">
                    <p className="w-[120px] text-left">Status</p>
                    <p className="w-[120px] text-left">Action</p>
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((r, i) => (
                    <tr
                      key={r._id || i}
                      className="border-t flex justify-between items-center w-full hover:bg-[#f7f6f3] transition-all duration-200"
                    >
                      {/* Left section (S.No + Role + Slug) */}
                      <td className="flex items-center gap-10 px-8 py-3 w-1/2">
                        <p className="w-[60px]">{i + 1}</p>
                        <p className="w-[150px] font-semibold">{r.Role}</p>
                        <p className="w-[150px] text-gray-600">{r.Slug}</p>
                      </td>

                      {/* Right section (Status + Action) */}
                      <td className="flex items-center gap-10 px-8 py-3 w-1/2 justify-end">
                        <div className="w-[120px]">
                          <span
                            className={`px-3 py-1 rounded-[2px] text-xs font-semibold ${
                              r.Status === "Active"
                                ? "bg-[#C8E6C9] text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {r.Status}
                          </span>
                        </div>

                        <div className="w-[120px] flex gap-2 items-center justify-start">
                          <Button
                            sx={{
                              backgroundColor: "#C8E6C9",
                              color: "var(--color-primary)",
                              minWidth: "32px",
                              height: "32px",
                              borderRadius: "8px",
                            }}
                            onClick={() => handleEdit(r._id || String(i))}
                          >
                            <MdEdit />
                          </Button>

                          <Button
                            sx={{
                              backgroundColor: "#F9D0C4",
                              color: "#C62828",
                              minWidth: "32px",
                              height: "32px",
                              borderRadius: "8px",
                            }}
                            onClick={() => {
                              setIsDeleteDialogOpen(true);
                              setDeleteDialogData({
                                id: r._id || String(i),
                                role: r.Role,
                              });
                            }}
                          >
                            <MdDelete />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4 text-gray-500">
                      No roles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-3 py-3 px-5">
              <p className="text-sm">Page {currentTablePage} of {totalTablePages}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={prevtablePage}
                  disabled={currentTablePage === 1}
                  className="px-3 py-1 bg-gray-200 border border-gray-300 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={nexttablePage}
                  disabled={(currentTablePage === totalTablePages) || (currentRows.length <= 0)}
                  className="px-3 py-1 bg-gray-200 border border-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MasterProtectedRoute>
  );
}
