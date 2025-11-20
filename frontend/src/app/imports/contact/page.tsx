'use client'

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import SingleSelect from "@/app/component/SingleSelect";
import { useRouter } from "next/navigation";

import { getCampaign } from "@/store/masters/campaign/campaign";   // Range
import { handleFieldOptions } from "@/app/utils/handleFieldOptions";

import { contactExcelHeaders, importContact } from "@/store/contact";   // ✅ Your contact import API
import { getContactType, getContactTypeByCampaign } from "@/store/masters/contacttype/contacttype";
import BackButton from "@/app/component/buttons/BackButton";
import SaveButton from "@/app/component/buttons/SaveButton";
import { handleFieldOptionsObject } from "@/app/utils/handleFieldOptionsObject";
import ObjectSelect from "@/app/component/ObjectSelect";
import { useContactImport } from "@/context/ContactImportContext";


export default function ContactImport() {

  const [importData, setImportData] = useState({
    Campaign: { id: "", name: "" },
    ContactType: { id: "", name: "" },
    Range: "",
    file: null as File | null,
  });

  const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { setExcelHeaders , setFile } = useContactImport();


  // ✅ Fetch dropdown data

  // Object-based fields (for ObjectSelect)
  const objectFields = [
    { key: "Campaign", fetchFn: getCampaign },
    { key: "ContactType", staticData: [] },

  ];

  // Simple array fields (for normal Select)
  const arrayFields = [
    { key: "Range", staticData: ["10", "20", "30"] }
  ];
  const rangeOptions = ["10", "20", "30"]

  useEffect(() => {
    const loadFieldOptions = async () => {
      await handleFieldOptionsObject(objectFields, setFieldOptions);
      // await handleFieldOptions(arrayFields, setFieldOptions);
    };
    loadFieldOptions();
  }, []);

  useEffect(() => {
    if (importData.Campaign.id) {
      fetchContactType(importData.Campaign.id);
    } else {
      setFieldOptions((prev) => ({ ...prev, ContactType: [] }));
    }


  }, [importData.Campaign.id]);

  const fetchContactType = async (campaignId: string) => {
    try {
      const res = await getContactTypeByCampaign(campaignId);
      setFieldOptions((prev) => ({ ...prev, ContactType: res?.data || [] }));

    } catch (error) {
      console.error("Error fetching types:", error);
      setFieldOptions((prev) => ({ ...prev, ContactType: [] }));
    }
  };


  // Select change
  const handleSelectChange = useCallback((label: string, value: string) => {
    setImportData((prev) => ({ ...prev, [label]: value }));
    setErrors((prev) => ({ ...prev, [label]: "" }));
  }, []);


  // File upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImportData((prev) => ({ ...prev, file }));
  };


  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!importData.file) newErrors.file = "Please upload an Excel file";

    return newErrors;
  };


  //  Submit
  const handleSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const formData = new FormData();
     /*  formData.append("Campaign", importData.Campaign?.name);
      formData.append("ContactType", importData.ContactType?.name);
      formData.append("Range", importData.Range); */
      if (importData.file) formData.append("file", importData.file);

      const result = await contactExcelHeaders(formData);
      console.log(" result naruto",result)

      if (result?.headers) {
        //toast.success("Contacts imported successfully!");
        setExcelHeaders(result.headers);
        setFile(importData.file)
        router.push("/imports/contact/select-imports");
      } else {
        toast.error("Failed to import contacts");
      }
    } catch (error) {
      console.error("Import Error:", error);
      toast.error("Error importing contacts");
    }
  };


  return (
    <div className=" min-h-screen max-md:p-0 max-w-[700px] mx-auto flex justify-center">
      <Toaster position="top-right" />

      <div className="w-full">
        <div className="flex justify-end mb-4">
          <BackButton
            url="/contact"
            text="Back"
            icon={<ArrowLeft size={18} />}
          />
        </div>

        <div className="bg-white/90 backdrop-blur-lg p-10 w-full rounded-3xl shadow-2xl h-auto">
          <h1 className="text-2xl font-extrabold text-[var(--color-secondary-darker)] mb-8 border-b pb-4">
            Import <span className="text-[var(--color-primary)]
">Contacts</span>
          </h1>

          <div className=" w-full">
           

            <FileUpload
              label="Choose Excel File"
              onChange={handleFileChange}
              error={errors.file}
            />
          </div>

          <div className="flex justify-end mt-8">

            <SaveButton text="Import" onClick={handleSubmit} />

          </div>
        </div>
      </div>
    </div>
  );
}



// ✅ File Upload Component
const FileUpload = ({ label, onChange, error }: any) => (
  <div className="flex flex-col">
    <label className="font-semibold text-gray-700 mb-2">{label}</label>
    <input
      type="file"
      accept=".xlsx, .xls"
      onChange={onChange}
      className="border border-gray-300 rounded-md p-2"
    />
    {error && <span className="text-red-500 text-sm mt-2">{error}</span>}
  </div>
);
