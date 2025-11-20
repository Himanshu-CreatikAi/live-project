'use client'

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import SingleSelect from "@/app/component/SingleSelect";
import DateSelector from "@/app/component/DateSelector";
import toast, { Toaster } from "react-hot-toast";
import { ArrowLeft, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { addCustomer } from "@/store/customer";
import { customerAllDataInterface } from "@/store/customer.interface";
import { getCampaign } from "@/store/masters/campaign/campaign";
import { getTypes, getTypesByCampaign } from "@/store/masters/types/types";
import { getCity } from "@/store/masters/city/city";
import { getLocation } from "@/store/masters/location/location";
import { handleFieldOptions } from "@/app/utils/handleFieldOptions";
import { getSubtype, getSubtypeByCampaignAndType } from "@/store/masters/subtype/subtype";
import { getFacilities } from "@/store/masters/facilities/facilities";
import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import { handleFieldOptionsObject } from "@/app/utils/handleFieldOptionsObject";
import ObjectSelect from "@/app/component/ObjectSelect";
import CustomerSubtypeAdd from "@/app/masters/customer-subtype/add/page";

interface ErrorInterface {
  [key: string]: string;
}

export default function CustomerAdd() {
  const [customerData, setCustomerData] = useState<customerAllDataInterface>({
    Campaign: { id: "", name: "" },
    CustomerType: { id: "", name: "" },
    customerName: "",
    CustomerSubtype: {id:"",name:""},
    ContactNumber: "",
    City: "",
    Location: "",
    Area: "",
    Address: "",
    Email: "",
    Facilities: "",
    ReferenceId: "",
    CustomerId: "",
    CustomerDate: "",
    CustomerYear: "",
    Others: "",
    Description: "",
    Video: "",
    GoogleMap: "",
    Verified: "",
    CustomerImage: [],
    SitePlan: {} as File
  });
  const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [sitePlanPreview, setSitePlanPreview] = useState<string>("");
  const [errors, setErrors] = useState<ErrorInterface>({});
  const router = useRouter();



  // 🟩 Handle Input
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setCustomerData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: "" }));
    },
    []
  );

  const handleSelectChange = useCallback(
    (label: string, selected: string) => {
      setCustomerData((prev) => ({ ...prev, [label]: selected }));
      setErrors((prev) => ({ ...prev, [label]: "" }));
    },
    []
  );

  // 🟩 Handle File Input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const files = e.target.files;
    if (!files) return;

    if (field === "CustomerImage") {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setCustomerData((prev) => ({ ...prev, CustomerImage: [...prev.CustomerImage, ...newFiles] }));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    } else if (field === "SitePlan") {
      const file = files[0];
      setCustomerData((prev) => ({ ...prev, SitePlan: file }));
      setSitePlanPreview(URL.createObjectURL(file));
    }
  };

  // 🟩 Remove image
  const handleRemoveImage = (index: number) => {
    setCustomerData((prev) => ({
      ...prev,
      CustomerImage: prev.CustomerImage.filter((_, i) => i !== index)
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // 🟩 Remove site plan
  const handleRemoveSitePlan = () => {
    setCustomerData((prev) => ({ ...prev, SitePlan: {} as File }));
    setSitePlanPreview("");
  };

  // 🟩 Validate Form
  const validateForm = () => {
    const newErrors: ErrorInterface = {};
    if (!customerData.Campaign?.name.trim())
      newErrors.Campaign = "Campaign is required";
    if (!customerData.customerName.trim())
      newErrors.customerName = "Customer Name is required";
    if (customerData.Email.trim() && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(customerData.Email))
      newErrors.Email = "Invalid email format";
    if (!customerData.ContactNumber.trim())
      newErrors.ContactNumber = "Contact No is required";
    if (customerData.ContactNumber && customerData.ContactNumber.trim().length<10)
      newErrors.ContactNumber = "Contact No should atlest be 10 digit";
    return newErrors;
  };

  // 🟩 Submit Form
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();

      // Append fields

      if (customerData.Campaign) formData.append("Campaign", customerData.Campaign.name);
      if (customerData.CustomerType) formData.append("CustomerType", customerData.CustomerType.name);
      if (customerData.customerName) formData.append("customerName", customerData.customerName);
      if (customerData.CustomerSubtype) formData.append("CustomerSubType", customerData.CustomerSubtype?.name);
      if (customerData.ContactNumber) formData.append("ContactNumber", customerData.ContactNumber);
      if (customerData.City) formData.append("City", customerData.City);
      if (customerData.Location) formData.append("Location", customerData.Location);
      if (customerData.Area) formData.append("Area", customerData.Area);
      if (customerData.Address) formData.append("Adderess", customerData.Address);
      if (customerData.Email) formData.append("Email", customerData.Email);
      if (customerData.Facilities) formData.append("Facillities", customerData.Facilities);
      if (customerData.ReferenceId) formData.append("ReferenceId", customerData.ReferenceId);
      if (customerData.CustomerId) formData.append("CustomerId", customerData.CustomerId);
      if (customerData.CustomerDate) formData.append("CustomerDate", customerData.CustomerDate);
      if (customerData.CustomerYear) formData.append("CustomerYear", customerData.CustomerYear);
      if (customerData.Others) formData.append("Other", customerData.Others);
      if (customerData.Description) formData.append("Description", customerData.Description);
      if (customerData.Video) formData.append("Video", customerData.Video);
      if (customerData.GoogleMap) formData.append("GoogleMap", customerData.GoogleMap);
      if (customerData.Verified) formData.append("Verified", customerData.Verified);

      // Append files correctly
      if (Array.isArray(customerData.CustomerImage)) {
        customerData.CustomerImage.forEach((file) => formData.append("CustomerImage", file));
      }

      if (customerData.SitePlan && (customerData.SitePlan as any).name) {
        formData.append("SitePlan", customerData.SitePlan);
      }
      //console.log(customerData)
      const result = await addCustomer(formData);

      if (result) {
        toast.success("Customer added successfully!");
        router.push("/customer");
      } else {
        toast.error("Failed to add customer");
      }
    } catch (error) {
      toast.error("Error adding customer");
      console.error("Customer Add Error:", error);
    }
  };

  const dropdownOptions = ["Option1", "Option2", "Option3"];

  // Object-based fields (for ObjectSelect)
  const objectFields = [
    { key: "Campaign", fetchFn: getCampaign },
    { key: "CustomerType", staticData: [] },
    { key: "CustomerSubtype", staticData: [] } // dependent

  ];

  // Simple array fields (for normal Select)
  const arrayFields = [
    { key: "Verified", staticData: ["yes", "no"] },
    { key: "Gender", staticData: ["male", "female", "other"] },
    { key: "City", fetchFn: getCity },
    { key: "Facilities", fetchFn: getFacilities },
    { key: "Location", fetchFn: getLocation },
  ];


  useEffect(() => {
    const loadFieldOptions = async () => {
      await handleFieldOptionsObject(objectFields, setFieldOptions);
      await handleFieldOptions(arrayFields, setFieldOptions);
    };
    loadFieldOptions();
  }, []);


  useEffect(() => {
    if (customerData.Campaign.id) {
      fetchCustomerType(customerData.Campaign.id);
    } else {
      setFieldOptions((prev) => ({ ...prev, CustomerType: [] }));
    }

    if (customerData.Campaign.id && customerData.CustomerType.id) {
      fetchCustomerSubType(customerData.Campaign.id, customerData.CustomerType.id);
    } else {
      setFieldOptions((prev) => ({ ...prev, CustomerSubtype: [] }));
    }
  }, [customerData.Campaign.id, customerData.CustomerType.id]);

  const fetchCustomerType = async (campaignId: string) => {
    try {
      const res = await getTypesByCampaign(campaignId);
      setFieldOptions((prev) => ({ ...prev, CustomerType: res || [] }));
    } catch (error) {
      console.error("Error fetching types:", error);
      setFieldOptions((prev) => ({ ...prev, CustomerType: [] }));
    }
  };

  const fetchCustomerSubType = async (campaignId: string, customertypeId: string) => {
    try {
      const res = await getSubtypeByCampaignAndType(campaignId, customertypeId);
      setFieldOptions((prev) => ({ ...prev, CustomerSubtype: res || [] }));
    } catch (error) {
      console.error("Error fetching types:", error);
      setFieldOptions((prev) => ({ ...prev, CustomerSubtype: [] }));
    }
  };




  return (
    <div className=" min-h-screen flex justify-center">
      <Toaster position="top-right" />
      <div className="w-full">
        <div className="flex justify-end mb-4">
          <BackButton
            url="/customer"
            text="Back"
            icon={<ArrowLeft size={18} />}
          />
        </div>

        <div className="bg-white backdrop-blur-lg p-10 w-full rounded-3xl shadow-2xl h-auto">
          <form onSubmit={(e) => e.preventDefault()} className="w-full">
            <div className="mb-8 text-left border-b pb-4 border-gray-200">
              <h1 className="text-3xl font-extrabold text-[var(--color-secondary-darker)] leading-tight tracking-tight">
                Add <span className="text-[var(--color-primary)]">Customer Information</span>
              </h1>
            </div>

            <div className="grid grid-cols-3 gap-6 max-lg:grid-cols-1">
              {/* <SingleSelect options={Array.isArray(fieldOptions?.Campaign)?fieldOptions.Campaign:[]} label="Campaign" value={customerData.Campaign} onChange={(v) => handleSelectChange("Campaign", v)} error={errors.Campaign} />
              <SingleSelect options={Array.isArray(fieldOptions?.CustomerType)?fieldOptions.CustomerType:[]} label="Customer Type" value={customerData.CustomerType} onChange={(v) => handleSelectChange("CustomerType", v)} /> */}
              <ObjectSelect
                options={Array.isArray(fieldOptions?.Campaign) ? fieldOptions.Campaign : []}
                label="Campaign"
                value={customerData.Campaign.id}
                getLabel={(item) => item?.Name || ""}
                getId={(item) => item?._id || ""}
                onChange={(selectedId) => {
                  const selectedObj = fieldOptions.Campaign.find((i) => i._id === selectedId);
                  if (selectedObj) {
                    setCustomerData((prev) => ({
                      ...prev,
                      Campaign: { id: selectedObj._id, name: selectedObj.Name },
                      CustomerType: { id: "", name: "" }, // reset on change
                    }));
                  }
                }}
                error={errors.Campaign}
              />

              <ObjectSelect
                options={Array.isArray(fieldOptions?.CustomerType) ? fieldOptions.CustomerType : []}
                label="Customer Type"
                value={customerData.CustomerType.id}
                getLabel={(item) => item?.Name || ""}
                getId={(item) => item?._id || ""}
                onChange={(selectedId) => {
                  const selectedObj = fieldOptions.CustomerType.find((i) => i._id === selectedId);
                  if (selectedObj) {
                    setCustomerData((prev) => ({
                      ...prev,
                      CustomerType: { id: selectedObj._id, name: selectedObj.Name },
                      CustomerSubtype:{id:"",name:""} // reset on change
                    }));
                  }
                }}
                error={errors.CustomerType}
              />

              <ObjectSelect
                options={Array.isArray(fieldOptions?.CustomerSubtype) ? fieldOptions.CustomerSubtype : []}
                label="Customer Subtype"
                value={customerData.CustomerSubtype.id}
                getLabel={(item) => item?.Name || ""}
                getId={(item) => item?._id || ""}
                onChange={(selectedId) => {
                  const selectedObj = fieldOptions.CustomerSubtype.find((i) => i._id === selectedId);
                  if (selectedObj) {
                    setCustomerData((prev) => ({
                      ...prev,
                      CustomerSubtype: { id: selectedObj._id, name: selectedObj.Name },
                    }));
                  }
                }}
                error={errors.CustomerSubtype}
              />

                           
              <InputField label="Customer Name" name="customerName" value={customerData.customerName} onChange={handleInputChange} error={errors.customerName} />
              <InputField label="Contact No" name="ContactNumber" value={customerData.ContactNumber} onChange={handleInputChange} error={errors.ContactNumber} />
              <SingleSelect options={Array.isArray(fieldOptions?.City) ? fieldOptions.City : []} label="City" value={customerData.City} onChange={(v) => handleSelectChange("City", v)} />
              <SingleSelect options={Array.isArray(fieldOptions?.Location) ? fieldOptions.Location : []} label="Location" value={customerData.Location} onChange={(v) => handleSelectChange("Location", v)} />
              <InputField label="Area" name="Area" value={customerData.Area} onChange={handleInputChange} />
              <InputField label="Address" name="Address" value={customerData.Address} onChange={handleInputChange} />
              <InputField label="Email" name="Email" value={customerData.Email} onChange={handleInputChange} error={errors.Email} />
              <SingleSelect options={Array.isArray(fieldOptions?.Facilities) ? fieldOptions.Facilities : []} label="Facilities" value={customerData.Facilities} onChange={(v) => handleSelectChange("Facilities", v)} />
              <InputField label="Reference ID" name="ReferenceId" value={customerData.ReferenceId} onChange={handleInputChange} />
              <InputField label="Customer ID" name="CustomerId" value={customerData.CustomerId} onChange={handleInputChange} />
              <DateSelector label="Customer Date" value={customerData.CustomerDate} onChange={(val) => handleSelectChange("CustomerDate", val)} />
              <InputField label="Customer Year" name="CustomerYear" value={customerData.CustomerYear} onChange={handleInputChange} />
              <InputField label="Others" name="Others" value={customerData.Others} onChange={handleInputChange} />
              <InputField label="Description" name="Description" value={customerData.Description} onChange={handleInputChange} />
              <InputField label="Video" name="Video" value={customerData.Video} onChange={handleInputChange} />
              <InputField label="Google Map" name="GoogleMap" value={customerData.GoogleMap} onChange={handleInputChange} />
              <SingleSelect options={Array.isArray(fieldOptions?.Verified) ? fieldOptions.Verified : []} label="Verified" value={customerData.Verified} onChange={(v) => handleSelectChange("Verified", v)} />
              

            </div>
            <div className="flex flex-wrap my-5 gap-5">
                <FileUpload label="Customer Images" multiple previews={imagePreviews} onChange={(e) => handleFileChange(e, "CustomerImage")} onRemove={handleRemoveImage} />
              <FileUpload label="Site Plan" previews={sitePlanPreview ? [sitePlanPreview] : []} onChange={(e) => handleFileChange(e, "SitePlan")} onRemove={handleRemoveSitePlan} />
              </div>

            <div className="flex justify-end mt-4">

              <SaveButton text="Save" onClick={handleSubmit} />

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


const InputField: React.FC<{
  label: string;
  name: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ label, name, value, onChange, error }) => (
  <label className="relative block w-full">
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      className={`peer w-full border rounded-sm bg-transparent py-3 px-4 outline-none 
        ${error ? "border-red-500 focus:border-red-500" : "border-gray-400 focus:border-blue-500"}`}
    />
    <p className={`absolute left-2 bg-white px-1 text-gray-500 text-sm transition-all duration-300
      ${value || error ? "-top-2 text-xs text-blue-500" : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500"}`}>
      {label}
    </p>
    {error && <span className="text-red-500 text-sm mt-1 block">{error}</span>}
  </label>
);

// Textarea field
const TextareaField: React.FC<{
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}> = ({ label, name, value, onChange }) => (
  <label className="relative block w-full">
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder=" "
      className="peer w-full border rounded-sm border-gray-400 bg-transparent py-3 px-4 outline-none focus:border-blue-500 min-h-[100px]"
    ></textarea>
    <p className={`absolute left-2 bg-white px-1 text-gray-500 text-sm transition-all duration-300
      ${value ? "-top-2 text-xs text-blue-500" : "peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500"}`}>
      {label}
    </p>
  </label>
);

// File upload with preview and remove
const FileUpload: React.FC<{
  label: string;
  multiple?: boolean;
  previews?: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove?: (index: number) => void;
}> = ({ label, multiple, previews = [], onChange, onRemove }) => (
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type="file"
      multiple={multiple}
      onChange={onChange}
      className="border border-gray-300 rounded-md p-2"
    />
    {previews.length > 0 && (
      <div className="flex flex-wrap gap-3 mt-3">
        {previews.map((src, index) => (
          <div key={index} className="relative">
            <img
              src={src}
              alt={`preview-${index}`}
              className="w-24 h-24 object-cover rounded-md border"
            />
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="absolute top-[-8px] right-[-8px] bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
              >
                <X size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);