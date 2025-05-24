"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import Image from "next/image";

const schema = z.object({
  username: z.string().min(3).max(20),
  surname: z.string().min(3).optional(),
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  bloodType: z.string().min(1),
  birthday: z.string().min(1),
  sex: z.enum(["male", "female"]),
  img: z
    .union([
      z.any().refine(
        (file) => {
          if (!file || file.length === 0) return true;
          return file[0]?.size <= 5 * 1024 * 1024;
        },
        { message: "Image size should be less than 5MB" }
      ),
      z.string(), // allow existing string path
    ])
    .optional(),
});

type Inputs = z.infer<typeof schema>;

// Helper: convert file to base64 string
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const StudentForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: data?.username || "",
      surname: data?.surname || "",
      email: data?.email || "",
      password: "", // do NOT preload password for security
      name: data?.firstName || "",
      phone: data?.phone || "",
      address: data?.address || "",
      bloodType: data?.bloodType || "",
      birthday: data?.birthday ? data.birthday.split("T")[0] : "",
      sex: data?.sex || "male",
    },
  });

  // Watch img input for preview or processing
  const imgFile = watch("img");

  const onSubmit = async (formData: Inputs) => {
    let imgBase64 = "";

    if (formData.img && formData.img.length > 0 && formData.img[0] instanceof File) {
      // Convert image file to base64 string
      imgBase64 = await fileToBase64(formData.img[0]);
    } else if (type === "update" && data?.photo) {
      // Keep existing photo string
      imgBase64 = data.photo;
    } else {
      // Default image path or base64 string fallback
      imgBase64 = "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg";
    }

    const payload = {
      username: formData.username,
      surname: formData.surname || "",
      email: formData.email,
      password: formData.password,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      bloodType: formData.bloodType,
      birthday: formData.birthday,
      sex: formData.sex.toUpperCase(),
      img: imgBase64,
      classId:1,
      parentId:1,
      gradeId:1
    };

    const url = type === "create" ? "/api/students" : `/api/students/${data.id}`;
    const method = type === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/list/students");
    } else {
      const errorData = await res.json();
      alert("Error: " + (errorData.message || "Something went wrong"));
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Add New Student" : "Update Student"}
      </h1>
      <div className="flex gap-4 flex-wrap">
        <InputField label="Username" name="username" register={register} error={errors.username} />
        <InputField label="Surname" name="surname" register={register} error={errors.surname} />
        <InputField label="Email" name="email" register={register} error={errors.email} />
        <InputField
          label="Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
        />
        <InputField label="Name" name="name" register={register} error={errors.name} />
        <InputField label="Phone" name="phone" register={register} error={errors.phone} />
        <InputField label="Address" name="address" register={register} error={errors.address} />
        <InputField label="Blood Type" name="bloodType" register={register} error={errors.bloodType} />
        <InputField label="Birthday" name="birthday" type="date" register={register} error={errors.birthday} />
        <div>
          <label>Sex</label>
          <select {...register("sex")} className="border p-2 rounded">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex && <p className="text-red-400 text-xs">{errors.sex.message}</p>}
        </div>
        <div>
          <label htmlFor="img" className="flex gap-2 items-center cursor-pointer text-sm">
            <Image src="/upload.png" width={24} height={24} alt="upload" />
            Upload Photo
          </label>
          <input type="file" id="img" {...register("img")} className="hidden" accept="image/*" />
          {/* {errors.img && <p className="text-red-400 text-xs">{errors.img.message}</p>} */}
        </div>
      </div>
      <button className="bg-blue-500 text-white p-2 rounded" type="submit">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default StudentForm;
