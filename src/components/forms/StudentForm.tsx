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
        password: "", // Don't preload password
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      {type === "create" && (
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        />
      )}
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      <input
        type="text"
        name="surname"
        placeholder="Surname"
        value={formData.surname}
        onChange={handleChange}
        className="input input-bordered w-full"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />
      <input
        type="tel"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="input input-bordered w-full"
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        className="input input-bordered w-full"
      />
      <input
        type="text"
        name="bloodType"
        placeholder="Blood Type"
        value={formData.bloodType}
        onChange={handleChange}
        className="input input-bordered w-full"
      />
      <input
        type="date"
        name="birthday"
        value={formData.birthday}
        onChange={handleChange}
        className="input input-bordered w-full"
      />
      <select
        name="sex"
        value={formData.sex}
        onChange={handleChange}
        className="select select-bordered w-full"
        required
      >
        <option value="">Select Gender</option>
        <option value="MALE">Male</option>
        <option value="FEMALE">Female</option>
      </select>
      {type === "create" && (
        <input
          type="file"
          name="img"
          onChange={handleChange}
          accept="image/*"
          className="file-input file-input-bordered w-full"
        />
      )}
      <button type="submit" className="btn btn-primary w-full">
        {type === "create" ? "Create Student" : "Update Student"}
      </button>
    </form>
  );
};

export default StudentForm;
