"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Props = {
  data?: any;
  type: "create" | "update";
};

const StudentForm = ({ data, type }: Props) => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    bloodType: "",
    birthday: "",
    sex: "",
  });

  const [imgBase64, setImgBase64] = useState("");

  useEffect(() => {
    if (type === "update" && data) {
      setFormData({
        username: data.username || "",
        password: "",
        name: data.name || "",
        surname: data.surname || "",
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || "",
        bloodType: data.bloodType || "",
        birthday: data.birthday ? data.birthday.split("T")[0] : "",
        sex: data.sex || "",
      });
    }
  }, [type, data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target;

    if (type === "create" && name === "img" && files && files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgBase64(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload: any = {
      username: formData.username,
      surname: formData.surname,
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      bloodType: formData.bloodType,
      birthday: formData.birthday,
      sex: formData.sex.toUpperCase(),
      classId: 1,
      parentId: 1,
      gradeId: 1,
    };

    if (type === "create") {
      payload.img = imgBase64;
      payload.password = formData.password;
    }

    const url =
      type === "create" ? "/api/students" : `/api/students/${data.id}`;
    const method = type === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(
        type === "create" ? "Student created!" : "Student updated!"
      );
      router.push("/list/students");
    } else {
      const error = await res.json();
      toast.error("Failed: " + error.error);
    }
  };

  const inputClass =
    "peer w-full p-3 border rounded-lg bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all";

  const labelClass =
    "absolute left-3 top-3 text-gray-500 text-sm transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary bg-white px-1";

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center">
        {type === "create" ? "Create" : "Update"} Student
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Floating Label Input */}
        {[
          { name: "username", type: "text", label: "Username", required: true },
          { name: "name", type: "text", label: "First Name", required: true },
          { name: "surname", type: "text", label: "Surname" },
          { name: "email", type: "email", label: "Email", required: true },
          { name: "phone", type: "tel", label: "Phone" },
          { name: "address", type: "text", label: "Address" },
          { name: "bloodType", type: "text", label: "Blood Type" },
          { name: "birthday", type: "date", label: "Birthday" },
        ].map((field) => (
          <div key={field.name} className="relative">
            <input
              type={field.type}
              name={field.name}
              placeholder=" "
              value={(formData as any)[field.name]}
              onChange={handleChange}
              className={inputClass}
              required={field.required}
            />
            <label htmlFor={field.name} className={labelClass}>
              {field.label}
            </label>
          </div>
        ))}

        {type === "create" && (
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              required
            />
            <label htmlFor="password" className={labelClass}>
              Password
            </label>
          </div>
        )}

        <div className="relative">
          <select
            name="sex"
            value={formData.sex}
            onChange={handleChange}
            className={inputClass + " appearance-none"}
            required
          >
            <option value="">Select Gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <label htmlFor="sex" className={labelClass}>
            Gender
          </label>
        </div>

        {type === "create" && (
          <div className="relative">
            <input
              type="file"
              name="img"
              onChange={handleChange}
              accept="image/*"
              className="file-input w-full"
            />
            <label className="text-sm text-gray-600 block mt-1">
              Upload Image
            </label>
          </div>
        )}
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-primary-dark transition-all"
      >
        {type === "create" ? "Create Student" : "Update Student"}
      </button>
    </form>
  );
};

export default StudentForm;
