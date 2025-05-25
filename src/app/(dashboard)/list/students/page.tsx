"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import { role } from "@/lib/data";

type Student = {
  id: number;
  studentId: string;
  name: string;
  email?: string;
  photo: string;
  phone?: string;
  grade: number;
  class: string;
  address: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Student ID", accessor: "studentId", className: "hidden md:table-cell" },
  { header: "Grade", accessor: "grade", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const StudentListPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/students")
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((err) => console.error("Failed to fetch students", err));
  }, []);

  useEffect(() => {
    const handleStudentDeleted = (e: CustomEvent) => {
      setStudents((prev) => prev.filter((s) => s.id !== e.detail));
    };
    window.addEventListener("studentDeleted", handleStudentDeleted as EventListener);
    return () => window.removeEventListener("studentDeleted", handleStudentDeleted as EventListener);
  }, []);

  const renderRow = (item: Student) => {
    const idFromRow = item.studentId;

    const handleViewClick = () => {
      router.push(`/list/students/${idFromRow}`);
    };

    return (
      <tr
        key={item.id}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">
          <Image
            src={item.photo || "/default-avatar.png"}
            alt={`${item.name}'s photo`}
            width={40}
            height={40}
            className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-xs text-gray-500">{item.class}</p>
          </div>
        </td>
        <td className="hidden md:table-cell">{item.studentId}</td>
        <td className="hidden md:table-cell">{item.grade}</td>
        <td className="hidden lg:table-cell">{item.phone}</td>
        <td className="hidden lg:table-cell">{item.address}</td>
        <td>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleViewClick}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky"
              aria-label={`View ${item.name}`}
            >
              <Image src="/view.png" alt="View" width={16} height={16} />
            </button>
            {role === "admin" && (
              <FormModal table="student" type="delete" id={parseInt(idFromRow)} />
            )}
            {role === "admin" && (
              <FormModal table="student" type="update" id={parseInt(idFromRow)} />
            )}
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">All Students</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
              aria-label="Filter"
            >
              <Image src="/filter.png" alt="Filter" width={14} height={14} />
            </button>
            <button
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow"
              aria-label="Sort"
            >
              <Image src="/sort.png" alt="Sort" width={14} height={14} />
            </button>
            {role === "admin" && <FormModal table="student" type="create" />}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <Table columns={columns} renderRow={renderRow} data={students} />

      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default StudentListPage;
