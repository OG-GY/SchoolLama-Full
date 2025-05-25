"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // For App Router
import Announcements from "@/components/Announcements";
import BigCalendar from "@/components/BigCalender";
import Performance from "@/components/Performance";
import Image from "next/image";
import Link from "next/link";

const SingleStudentPage = () => {
  const params = useParams();
  const studentId = params?.id;
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (studentId) {
      console.log("Student ID:", studentId); // ✅ Should print in browser console
      fetch(`/api/students/${studentId}`) // Update this to your correct API route
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched student data:", data); // ✅ Check in console
          setStudentData(data);
        })
        .catch((err) => console.error("Error fetching student data", err));
    }
  }, [studentId]);

  const dummy = {
    name: "Cameron Moran",
    email: "user@gmail.com",
    phone: "+1 234 567",
    bloodType: "A+",
    createdAt: "January 2025",
    image:
      "https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200",
  };

  const student = studentData || dummy;
  console.log("Student data:", student); // ✅ Check in console

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* USER INFO */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
            <div className="w-1/7">
              <Image
                // src="https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg"
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">{student.name}</h1>
              <p className="text-sm text-gray-500">
                `{student.name} has been an active student.`
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                <div className="flex items-center gap-2">
                  <Image src="/blood.png" alt="" width={14} height={14} />
                  <span>{student.bloodType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/date.png" alt="" width={14} height={14} />
                  <span>
                    {new Date(student.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/mail.png" alt="" width={14} height={14} />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src="/phone.png" alt="" width={14} height={14} />
                  <span>{student.phone}</span>
                </div>
              </div>
            </div>
          </div>
          {/* CARDS (keep static or dynamic later) */}
          {/* ... same as before ... */}
        </div>

        {/* Schedule Calendar */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Student&apos;s Lessons
            </Link>
            {/* ... other links ... */}
          </div>
        </div>
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
