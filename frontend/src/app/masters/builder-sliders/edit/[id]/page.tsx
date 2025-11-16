'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getBuilderslidersById, updateBuildersliders } from "@/store/masters/buildersliders/buildersliders";
import { builderslidersGetDataInterface } from "@/store/masters/buildersliders/buildersliders.interface";
import SingleSelect from "@/app/component/SingleSelect";
import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import MasterProtectedRoute from "@/app/component/MasterProtectedRoutes";

interface ErrorInterface {
  [key: string]: string;
}

export default function BuilderSliderEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [sliderData, setSliderData] = useState<builderslidersGetDataInterface>({
    _id: "",
    Image: "",
    Status: "",
  });

  const [newImage, setNewImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const [errors, setErrors] = useState<ErrorInterface>({});
  const [loading, setLoading] = useState(true);

  // 🟩 Fetch builder slider by ID
  useEffect(() => {
    const fetchSlider = async () => {
      try {
        const data = await getBuilderslidersById(id as string);
        if (data) {
          setSliderData(data);
          setImagePreview(data.Image); // existing image URL
        } else {
          toast.error("Builder Slider not found");
        }
      } catch (error) {
        toast.error("Error fetching slider details");
        console.error("Fetch Slider Error:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSlider();
  }, [id]);

  // 🟩 Handle dropdown change
  const handleSelectChange = useCallback((label: string, selected: string) => {
    setSliderData((prev) => ({ ...prev, [label]: selected }));
    setErrors((prev) => ({ ...prev, [label]: "" }));
  }, []);

  // 🟩 Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // 🟩 Remove selected new image
  const handleRemoveImage = () => {
    setNewImage(null);
    setImagePreview(sliderData.Image); // revert to original image
  };

  // 🟩 Validate form
  const validateForm = () => {
    const newErrors: ErrorInterface = {};
    if (!sliderData.Status.trim()) newErrors.Status = "Status is required";
    return newErrors;
  };

  // 🟩 Submit update
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Status", sliderData.Status);
      if (newImage) formData.append("Image", newImage);

      const result = await updateBuildersliders(id as string, formData);
      if (result) {
        toast.success("Builder Slider updated successfully!");
        router.push("/masters/builder-sliders");
      } else {
        toast.error("Failed to update builder slider");
      }
    } catch (error) {
      toast.error("Error updating builder slider");
      console.error("Update Slider Error:", error);
    }
  };

  const statusOptions = ["Active", "Inactive"];

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading slider details...
      </div>
    );

  return (
    <MasterProtectedRoute>
    <div className=" min-h-screen flex justify-center">
      <Toaster position="top-right" />
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <div className="flex justify-end mb-4">
          
          <BackButton
            url="/masters/builder-sliders"
            text="Back"
            icon={<ArrowLeft size={18} />}
          />
        </div>

        {/* Form Card */}
        <div className="bg-white/90 backdrop-blur-lg p-10 w-full rounded-3xl shadow-2xl">
          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <div className="mb-8 text-left border-b pb-4 border-gray-200">
              <h1 className="text-3xl font-extrabold text-[var(--color-secondary-darker)] leading-tight tracking-tight">
                Edit <span className="text-[var(--color-primary)]">Builder Slider</span>
              </h1>
            </div>

            <div className="flex flex-col space-y-6">
              {/* Status */}
              <SingleSelect
                options={statusOptions}
                label="Status"
                value={sliderData.Status}
                onChange={(v) => handleSelectChange("Status", v)}
              />

              {/* Image Upload & Preview */}
              <div className="flex flex-col">
                <label className="font-semibold text-gray-700 mb-2">Slider Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="border border-gray-300 rounded-md p-2"
                />
                {imagePreview && (
                  <div className="relative mt-3 w-48 h-48">
                    <img
                      src={imagePreview}
                      alt="preview"
                      className="w-full h-full object-cover rounded-md border"
                    />
                    {newImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-[-8px] right-[-8px] bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Update Button */}
              <div className="flex justify-end mt-4">
                
                <SaveButton text="Update" onClick={handleSubmit} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    </MasterProtectedRoute>
  );
}
