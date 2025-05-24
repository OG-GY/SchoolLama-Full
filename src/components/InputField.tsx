import { FieldError, UseFormRegister } from "react-hook-form";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

type InputFieldProps = {
  label: string;
  name: string;
  register: UseFormRegister<any>;
  type?: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: InputHTMLAttributes<HTMLInputElement> &
    TextareaHTMLAttributes<HTMLTextAreaElement>;
  isTextarea?: boolean;
};

const InputField = ({
  label,
  name,
  register,
  type = "text",
  defaultValue,
  error,
  inputProps = {},
  isTextarea = false,
}: InputFieldProps) => {
  const commonProps = {
    ...register(name),
    className:
      "ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500",
    defaultValue,
    id: name,
    ...inputProps,
  };

  return (
    <div className="flex flex-col gap-2 w-full md:w-1/4">
      <label htmlFor={name} className="text-xs text-gray-500">
        {label}
      </label>

      {isTextarea ? (
        <textarea rows={4} {...commonProps} />
      ) : (
        <input type={type} {...commonProps} />
      )}

      {error?.message && (
        <p className="text-xs text-red-500">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
