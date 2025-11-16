'use client';

import { useState, useCallback } from "react";
import Link from "next/link";
import SingleSelect from "@/app/component/SingleSelect";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { whatsappAllDataInterface } from "@/store/masters/whatsapp/whatsapp.interface";
import { addWhatsapp } from "@/store/masters/whatsapp/whatsapp";
import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import MasterProtectedRoute from "@/app/component/MasterProtectedRoutes";

interface ErrorInterface {
  [key: string]: string;
}

export default function WhatsappAdd() {
  const [whatsappData, setWhatsappData] = useState<whatsappAllDataInterface>(() => ({
    name: "",
    body: "",
    status: "",
  }));

  const [errors, setErrors] = useState<ErrorInterface>({});
  const router = useRouter();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setWhatsappData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  const handleSelectChange = useCallback((label: string, selected: string) => {
    setWhatsappData((prev) => ({ ...prev, [label]: selected }));
    setErrors((prev) => ({ ...prev, [label]: "" }));
  }, []);

  const validateForm = () => {
    const newErrors: ErrorInterface = {};
    if (!whatsappData.name.trim()) newErrors.name = "Template name is required";
    if (!whatsappData.body.trim()) newErrors.body = "Body is required";
    if (!whatsappData.status.trim()) newErrors.status = "Status is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const result = await addWhatsapp(whatsappData);
      if (result) {
        toast.success("WhatsApp Template added successfully!");
        router.push("/masters/whatsapp-templates");
      }
    } catch (error) {
      toast.error("Failed to add WhatsApp template");
      console.error("Add Whatsapp Error:", error);
    }
  };

  const statusOptions = ["Active", "Inactive"];

  return (
    <MasterProtectedRoute>
      <div className=" min-h-screen  flex justify-center">
        <Toaster position="top-right" />
        <div className="w-full">
          <div className="flex justify-end mb-4">

            <BackButton
              url="/masters/whatsapp-templates"
              text="Back"
              icon={<ArrowLeft size={18} />}
            />
          </div>

          <div className="bg-white/90 backdrop-blur-lg p-10 w-full rounded-3xl shadow-2xl">
            <form onSubmit={(e) => e.preventDefault()} className="w-full">
              <div className="mb-8 text-left border-b pb-4 border-gray-200">
                <h1 className="text-3xl font-extrabold text-[var(--color-secondary-darker)] leading-tight tracking-tight">
                  Add <span className="text-[var(--color-primary)]">WhatsApp Template</span>
                </h1>
              </div>

              <div className="flex flex-col space-y-6">
                <div className="grid grid-cols-2 gap-6 max-lg:grid-cols-1">
                  <InputField
                    label="Template Name"
                    name="name"
                    value={whatsappData.name}
                    onChange={handleInputChange}
                    error={errors.name}
                  />

                  <SingleSelect
                    options={statusOptions}
                    label="status"
                    value={whatsappData.status}
                    onChange={(v) => handleSelectChange("status", v)}
                  />
                </div>

                <TextAreaField
                  label="Body"
                  name="body"
                  value={whatsappData.body}
                  onChange={handleInputChange}
                  error={errors.body}
                />

                <div className="flex justify-end mt-4">

                  <SaveButton text="Save" onClick={handleSubmit} />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </MasterProtectedRoute>
  );
}

// 🟩 Reusable Input Field
const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, value, onChange, error }) => (
  <label className="relative block w-full">
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      className={`peer w-full border rounded-sm bg-transparent py-3 px-4 outline-none 
        ${error ? "border-red-500" : "border-gray-400 focus:border-blue-500"}`}
    />
    <p
      className={`absolute left-2 bg-white px-1 text-gray-500 text-sm transition-all duration-300
      ${value || error
          ? "-top-2 text-xs text-[var(--color-primary)]"
          : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[var(--color-primary)]"
        }`}
    >
      {label}
    </p>
    {error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
  </label>
);

// 🟩 Reusable Textarea Field
const TextAreaField: React.FC<{
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}> = ({ label, name, value, onChange, error }) => (
  <label className="relative block w-full">
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      rows={5}
      className={`peer w-full border rounded-sm bg-transparent py-3 px-4 outline-none resize-none 
        ${error ? "border-red-500" : "border-gray-400 focus:border-blue-500"}`}
    />
    <p
      className={`absolute left-2 bg-white px-1 text-gray-500 text-sm transition-all duration-300
      ${value || error
          ? "-top-2 text-xs text-[var(--color-primary)]"
          : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-[var(--color-primary)]"
        }`}
    >
      {label}
    </p>
    {error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
  </label>
);
