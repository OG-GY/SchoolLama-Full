"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect } from "react";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
};

type FormModalProps = {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  id?: number;
};

const FormModal = ({ table, type, data: initialData, id }: FormModalProps) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // State for fetched data if update & no data provided
  const [data, setData] = useState(initialData);

  useEffect(() => {
    if (type === "update" && table === "student" && id && !initialData) {
      setLoading(true);
      fetch(`/api/students/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch student data");
          return res.json();
        })
        .then((json) => {
          setData(json);
        })
        .catch((err) => {
          console.error("Error loading student data:", err);
          alert("Failed to load student data");
          setOpen(false);
        })
        .finally(() => setLoading(false));
    }
  }, [type, table, id, initialData]);

  const handleDelete = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        window.dispatchEvent(new CustomEvent("studentDeleted", { detail: id }));
        setOpen(false);
      } else {
        console.error("Failed to delete student");
      }
    } catch (err) {
      console.error("Error deleting student:", err);
    } finally {
      setLoading(false);
    }
  };

  const Form = () => {
    if (type === "delete" && id && table === "student") {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDelete();
          }}
          className="p-4 flex flex-col gap-4"
        >
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this student?
          </span>
          <button
            disabled={loading}
            type="submit"
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </form>
      );
    }

    if (type === "create") {
      return forms[table]?.(type, data) ?? <>Form not found!</>;
    }

    if (type === "update") {
      if (loading) return <p>Loading student data...</p>;
      if (!data) return <p>Failed to load data.</p>;
      return forms[table]?.(type, data) ?? <>Form not found!</>;
    }

    return <>Form not found!</>;
  };

  return (
    <>
      <button
        aria-label={`${type} ${table}`}
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
        type="button"
      >
        <Image src={`/${type}.png`} alt={`${type} icon`} width={16} height={16} />
      </button>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-md relative w-full max-w-3xl max-h-[90vh] overflow-auto">
            <Form />
            <button
              aria-label="Close modal"
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4"
              type="button"
            >
              <Image src="/close.png" alt="close" width={14} height={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
