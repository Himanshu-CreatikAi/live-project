'use client'
import { useEffect, useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { MdEdit, MdDelete, MdAdd, MdFavorite, MdFavoriteBorder } from "react-icons/md";
import Button from '@mui/material/Button';
import SingleSelect from "@/app/component/SingleSelect";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusSquare } from "lucide-react";
import ProtectedRoute from "../component/ProtectedRoutes";
import toast, { Toaster } from "react-hot-toast";
import { getCustomer, deleteCustomer, getFilteredCustomer, updateCustomer, assignCustomer, deleteAllCustomer } from "@/store/customer";
import { CustomerAdvInterface, customerAssignInterface, customerGetDataInterface, DeleteDialogDataInterface } from "@/store/customer.interface";
import DeleteDialog from "../component/popups/DeleteDialog";
import { getCampaign } from "@/store/masters/campaign/campaign";
import { getTypes } from "@/store/masters/types/types";
import { getCity } from "@/store/masters/city/city";
import { getLocation } from "@/store/masters/location/location";
import { handleFieldOptions } from "../utils/handleFieldOptions";
import PopupMenu from "../component/popups/PopupMenu";
import { getAllAdmins } from "@/store/auth";
import { usersGetDataInterface } from "@/store/auth.interface";
import { getSubtype } from "@/store/masters/subtype/subtype";
import { mailAllCustomerInterface, mailGetDataInterface } from "@/store/masters/mail/mail.interface";
import { whatsappAllCustomerInterface, whatsappGetDataInterface } from "@/store/masters/whatsapp/whatsapp.interface";
import { emailAllCustomer, getMail } from "@/store/masters/mail/mail";
import { getWhatsapp, whatsappAllCustomer } from "@/store/masters/whatsapp/whatsapp";
import FavouriteDialog from "../component/popups/FavouriteDialog";
import AddButton from "../component/buttons/AddButton";
import PageHeader from "../component/labels/PageHeader";
import ListPopup from "../component/popups/ListPopup";
import LoaderCircle from "../component/LoaderCircle";


interface DeleteAllDialogDataInterface { }

export default function Customer() {
  const router = useRouter();

  /*NEW STATE FOR SELECTED CUSTOMERS */
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [selectedUser, setSelectUser] = useState<string>();
  const [selectedWhatsapptemplate, setSelectedWhatsapptemplate] = useState<string>();
  const [selectedMailtemplate, setSelectedMailtemplate] = useState<string>();
  const [users, setUsers] = useState<usersGetDataInterface[]>([])

  const [mailTemplates, setMailtemplates] = useState<mailGetDataInterface[]>([])
  const [whatsappTemplates, setWhatsappTemplates] = useState<whatsappGetDataInterface[]>([])


  /*REST OF YOUR STATES (UNCHANGED) */
  const [toggleSearchDropdown, setToggleSearchDropdown] = useState(false);
  const [currentTablePage, setCurrentTablePage] = useState(1);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isMailAllOpen, setIsMailAllOpen] = useState(false);
  const [isWhatsappAllOpen, setIsWhatsappAllOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isFavouriteDialogOpen, setIsFavouriteDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<DeleteDialogDataInterface | null>(null);
  const [dialogType, setDialogType] = useState<"delete" | "favourite" | null>(null);
  const [fieldOptions, setFieldOptions] = useState<Record<string, any[]>>({});
  const [isFavrouteCustomer, setIsFavrouteCustomer] = useState<boolean>(false);
  const [deleteAllDialogData, setDeleteAllDialogData] =
    useState<DeleteAllDialogDataInterface | null>(null);

  const [rowsPerTablePage, setRowsPerTablePage] = useState(10);
  const [filters, setFilters] = useState({
    StatusAssign: [] as string[],
    Campaign: [] as string[],
    CustomerType: [] as string[],
    CustomerSubtype: [] as string[],
    City: [] as string[],
    Location: [] as string[],
    User: [] as string[],
    Keyword: "" as string,
    Limit: ["10"] as string[],
  });

  const [customerData, setCustomerData] = useState<customerGetDataInterface[]>([]);
  const [customerAdv, setCustomerAdv] = useState<CustomerAdvInterface[]>([]);

  useEffect(() => {
    getCustomers();
    fetchFields();
  }, []);

  const getCustomers = async () => {
    const data = await getCustomer();
    if (data) {
      setCustomerData(
        data.map((item: any) => {
          const date = new Date(item.createdAt);
          const formattedDate =
            date.getDate().toString().padStart(2, "0") + "-" +
            (date.getMonth() + 1).toString().padStart(2, "0") + "-" +
            date.getFullYear();
          return {
            _id: item._id,
            Campaign: item.Campaign,
            Type: item.CustomerType,
            SubType: item.CustomerSubType,
            Name: item.customerName,
            Email: item.Email,
            City: item.City,
            Location: item.Location,
            ContactNumber: item.ContactNumber,
            AssignTo: item.AssignTo?.name,
            isFavourite: item.isFavourite,
            Date: item.date ?? formattedDate,
          }
        })
      );
      setCustomerAdv(
        data.map((item: any) => ({
          _id: item._id,
          Campaign: item.Campaign || [],
          CustomerType: item.CustomerType || [],
          CustomerSubtype: item.CustomerSubtype || [],
          City: item.City || [],
          Location: item.Location || [],
          User: item.User || [],
          Limit: item.Limit || [],
        }))
      );
    }
  };

  const handleDelete = async (data: DeleteDialogDataInterface | null) => {
    if (!data) return;
    const response = await deleteCustomer(data.id);
    if (response) {
      toast.success(`Customer deleted successfully`);
      setIsDeleteDialogOpen(false);
      setDialogData(null);
      await getCustomers();
    }
  };

  const handleFavourite = async (data: DeleteDialogDataInterface | null) => {
    if (!data) return;
    const formData = new FormData();
    const current = customerData.find(c => c._id === data.id);
    const newFav = !current?.isFavourite;
    formData.append("isFavourite", newFav.toString());

    const res = await updateCustomer(data.id, formData);
    if (res) {
      toast.success("Favourite updated successfully");
      setIsFavouriteDialogOpen(false);
      setDialogData(null);
      await getCustomers();
    } else {
      toast.error("Failed to update favourite");
    }
  };

  const handleFavouriteToggle = (id: string, name: string, number: string, isFavourite: boolean) => {
    setDialogType("favourite");
    setIsFavouriteDialogOpen(true);
    setDialogData({
      id,
      customerName: name,
      ContactNumber: number
    });
    setIsFavrouteCustomer(isFavourite);
  };

  const handleSelectChange = async (field: keyof typeof filters, selected: string | string[]) => {
    const updatedFilters = {
      ...filters,
      [field]: Array.isArray(selected)
        ? selected
        : selected
          ? [selected]
          : [],
    };
    setFilters(updatedFilters);



    const queryParams = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (key === "Limit") return; // 
      if (Array.isArray(value) && value.length > 0) {
        value.forEach((v) => queryParams.append(key, v));
      } else if (typeof value === "string" && value) {
        queryParams.append(key, value);
      }
    });



    const data = await getFilteredCustomer(queryParams.toString());
    if (data) {
      setCustomerData(data.map((item: any) => {
        const date = new Date(item.createdAt);
        const formattedDate =
          date.getDate().toString().padStart(2, "0") + "-" +
          (date.getMonth() + 1).toString().padStart(2, "0") + "-" +
          date.getFullYear();
        return {
          _id: item._id,
          Campaign: item.Campaign,
          Type: item.CustomerType,
          SubType: item.CustomerSubType,
          Name: item.customerName,
          Email: item.Email,
          City: item.City,
          Location: item.Location,
          ContactNumber: item.ContactNumber,
          AssignTo: item.AssignTo?.name,
          isFavourite: item.isFavourite,
          Date: item.date ?? formattedDate,
        }
      }))
      setCurrentTablePage(1);
    }
  };

  const clearFilter = async () => {
    setFilters({
      StatusAssign: [],
      Campaign: [],
      CustomerType: [],
      CustomerSubtype: [],
      City: [],
      Location: [],
      User: [],
      Keyword: "",
      Limit: [],
    });
    await getCustomers();
  };

  const totalTablePages = useMemo(() => {
    return Math.ceil(customerData.length / rowsPerTablePage) || 1;
  }, [customerData, rowsPerTablePage]);

  const startIndex = (currentTablePage - 1) * rowsPerTablePage;
  const currentRows = customerData.slice(startIndex, startIndex + rowsPerTablePage);


  useEffect(() => {
    const safeLimit = Number(filters.Limit?.[0]);
    setRowsPerTablePage(safeLimit);
    setCurrentTablePage(1);
  }, [filters.Limit]);






  const nexttablePage = () => {
    if (currentTablePage !== totalTablePages)
      setCurrentTablePage(currentTablePage + 1);
  };
  const prevtablePage = () => {
    if (currentTablePage !== 1) setCurrentTablePage(currentTablePage - 1);
  };

  const [filterOptions, setFilterOptions] = useState({
    StatusAssign: [] as string[],
    Campaign: [],
    CustomerType: [],
    CustomerSubtype: [],
    City: [],
    Location: [],
    User: [] as string[],
  });

  const fetchUsers = async () => {
    const response = await getAllAdmins();

    if (response) {
      console.log("response ", response);

      const admins = response?.admins?.filter((e) => e.role === "user") ?? []; //ensure only user roles are fetched

      setUsers(
        admins.map((item: any): usersGetDataInterface => ({
          _id: item?._id ?? "",
          name: item?.name ?? "",
        }))
      );

      return;
    }
  };

  const fetchEmailTemplates = async () => {
    const response = await getMail();

    if (response) {
      console.log("response ", response);

      const mailtemplates = response?.filter((e: any) => e.status === "Active") ?? []; //ensure only user roles are fetched
      console.log(" mail data ", response)
      setMailtemplates(
        mailtemplates.map((item: any): mailGetDataInterface => ({
          _id: item?._id ?? "",
          name: item?.name ?? "",
          body: item?.body ?? ""
        }))
      );

      return;
    }
  };

  const fetchWhatsappTemplates = async () => {
    const response = await getWhatsapp();

    if (response) {
      console.log("response ", response);

      const whatsapptemplates = response?.filter((e: any) => e.status === "Active") ?? []; //ensure only active status are fetched
      console.log(" mail data ", response)
      setWhatsappTemplates(
        whatsapptemplates.map((item: any): whatsappGetDataInterface => ({
          _id: item?._id ?? "",
          name: item?.name ?? "",
          body: item?.body ?? ""
        }))
      );

      return;
    }
  };


  const handleDeleteAll = async () => {
    if (customerData.length === 0) return;
    const payload = {
      customerIds: [...selectedCustomers]
    }
    const response = await deleteAllCustomer(payload);
    if (response) {
      toast.success(`All contacts deleted`);
      setIsDeleteAllDialogOpen(false);
      setDeleteAllDialogData(null);
      setSelectedCustomers([]);
      getCustomers();
    }
  };


  //Fetch dropdown data
  const fetchFields = async () => {
    await handleFieldOptions(
      [
        { key: "StatusAssign", staticData: ["Assigned", "Unassigned"] },
        { key: "Campaign", fetchFn: getCampaign },
        { key: "CustomerType", fetchFn: getTypes },
        { key: "CustomerSubtype", fetchFn: getSubtype },
        { key: "City", fetchFn: getCity },
        { key: "Location", fetchFn: getLocation },
        { key: "User", fetchFn: getAllAdmins },
      ],
      setFieldOptions
    );
  };

  /* SELECT ALL HANDLER */
  const handleSelectAll = () => {
    const allIds = customerData.map((c) => c._id);
    setSelectedCustomers((prev) =>
      allIds.every((id) => prev.includes(id))
        ? prev.filter((id) => !allIds.includes(id)) // unselect all
        : [...new Set([...prev, ...allIds])] // select all visible rows
    );
  };

  /* ✅ SELECT SINGLE ROW HANDLER */
  const handleSelectRow = (id: string) => {
    setSelectedCustomers((prev) =>
      prev.includes(id)
        ? prev.filter((cid) => cid !== id)
        : [...prev, id]
    );
  };

  const handleSelectUser = (id: string) => {
    setSelectUser(prev => (prev === id ? undefined : id)); //  only one user at a time
  };

  const handleSelectMailtemplate = (id: string) => {
    setSelectedMailtemplate(prev => (prev === id ? undefined : id)); //  only one user at a time
  };

  const handleSelectWhatsapptemplate = (id: string) => {
    setSelectedWhatsapptemplate(prev => (prev === id ? undefined : id)); // only one user at a time
  };


  const handleAssignto = async () => {
    if (!selectedUser) {
      toast.error("Please select a user");
      return;
    }

    const payload: customerAssignInterface = {
      customerIds: selectedCustomers,
      assignToId: selectedUser,
    };

    console.log(payload)

    const response = await assignCustomer(payload);
    if (response) {
      toast.success(" customers assigned succesfully")
      await getCustomers();
      setIsAssignOpen(false);
      return response
    }
    toast.error("failed to assign customers")
    setIsAssignOpen(false)
  };

  const handleMailAll = async () => {
    if (!selectedMailtemplate) {
      toast.error("Please select a template");
      return;
    }

    const payload: mailAllCustomerInterface = {
      customerIds: selectedCustomers,
      templateId: selectedMailtemplate,
    };

    console.log(payload)

    const response = await emailAllCustomer(payload);
    if (response) {
      toast.success("Email customers succesfully")
      setIsMailAllOpen(false);
      return response
    }
    toast.error("failed to email customers")
    setIsMailAllOpen(false);
  };

  const handleWhatsappAll = async () => {
    if (!selectedWhatsapptemplate) {
      toast.error("Please select a template");
      return;
    }

    const payload: whatsappAllCustomerInterface = {
      customerIds: selectedCustomers,
      templateId: selectedWhatsapptemplate,
    };

    console.log(payload)

    const response = await whatsappAllCustomer(payload);
    if (response) {
      toast.success("Whatsapp customers succesfully")
      setIsWhatsappAllOpen(false);
      return response
    }
    toast.error("failed to whatsapp customers")
    setIsWhatsappAllOpen(false);
  };




  return (
    <ProtectedRoute>
      <div className=" min-h-[calc(100vh-56px)] overflow-auto max-md:py-10">
        <Toaster position="top-right" />

        {/* Delete Dialog */}
        <DeleteDialog<DeleteDialogDataInterface>
          isOpen={isDeleteDialogOpen}
          title="Are you sure you want to delete this customer?"
          data={dialogData}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setDialogData(null);
          }}
          onDelete={handleDelete}
        />

        <DeleteDialog<DeleteAllDialogDataInterface>
          isOpen={isDeleteAllDialogOpen}
          title="Are you sure you want to delete ALL customers?"
          data={deleteAllDialogData}
          onClose={() => {
            setIsDeleteAllDialogOpen(false);
            setDeleteAllDialogData(null);
          }}
          onDelete={handleDeleteAll}
        />

        {/* Favourite Dialog */}
        <FavouriteDialog<DeleteDialogDataInterface>
          isOpen={isFavouriteDialogOpen}
          title={`Are you sure you want to ${isFavrouteCustomer ? "unfavourite" : "favourite"} this customer?`}
          data={dialogData}
          onClose={() => {
            setIsFavouriteDialogOpen(false);
            setDialogData(null);
          }}
          onDelete={handleFavourite}
        />

        {/* Assign User Popup */}
        {isAssignOpen && selectedCustomers.length > 0 && (
          <ListPopup
            title="Assign Customers"
            list={users}
            selected={selectedUser}
            onSelect={handleSelectUser}
            onSubmit={handleAssignto}
            submitLabel="Assign"
            onClose={() => setIsAssignOpen(false)}
          />
        )}

        {/* mail all popup */}
        {isMailAllOpen && selectedCustomers.length > 0 && (
          <ListPopup
            title="Mail to All Customers"
            list={mailTemplates}
            selected={selectedMailtemplate}
            onSelect={handleSelectMailtemplate}
            onSubmit={handleMailAll}
            submitLabel="Mail All"
            onClose={() => setIsMailAllOpen(false)}
          />
        )}


        {/* whatsapp all popup */}
        {isWhatsappAllOpen && selectedCustomers.length > 0 && (
          <ListPopup
            title="Whatsapp to All Customers"
            list={whatsappTemplates}
            selected={selectedWhatsapptemplate}
            onSelect={handleSelectWhatsapptemplate}
            onSubmit={handleWhatsappAll}
            submitLabel="Whatsapp All"
            onClose={() => setIsWhatsappAllOpen(false)}
          />
        )}


        {/* ---------- TABLE START ---------- */}
        <LoaderCircle />
        <div className="p-4 max-md:p-3 w-full rounded-md bg-white">
          <div className="flex justify-between items-center p-2">
            <PageHeader title="Dashboard" subtitles={["Customer"]} />

            <AddButton
              url="/customer/add"
              text="Add"
              icon={<PlusSquare size={18} />}
            />

          </div>

          {/* TABLE */}
          <section className="flex flex-col mt-6 p-2 rounded-md">
            <div className="m-5 relative ">
              <div className="flex justify-between cursor-pointer items-center py-1 px-2 border border-gray-800 rounded-md" onClick={() => setToggleSearchDropdown(!toggleSearchDropdown)}>
                <h3 className="flex items-center gap-1"><CiSearch />Advance Search</h3>
                <button
                  type="button"

                  className="p-2 hover:bg-gray-200 rounded-md cursor-pointer"
                >
                  {toggleSearchDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </button>
              </div>

              <div className={`overflow-hidden ${toggleSearchDropdown ? "max-h-[2000px]" : "max-h-0"} transition-all duration-500 ease-in-out px-5`}>
                <div className="flex flex-col gap-5 my-5">
                  <div className="grid grid-cols-3 gap-5 max-md:grid-cols-1 max-lg:grid-cols-2">

                    <SingleSelect options={Array.isArray(fieldOptions?.Campaign) ? fieldOptions.Campaign : []} value={filters.Campaign[0]} label="Campaign" onChange={(v) => handleSelectChange("Campaign", v)} />

                    <SingleSelect options={Array.isArray(fieldOptions?.CustomerType) ? fieldOptions.CustomerType : []} value={filters.CustomerType[0]} label="Customer Type" onChange={(v) => handleSelectChange("CustomerType", v)} />

                    <SingleSelect options={Array.isArray(fieldOptions?.CustomerSubtype) ? fieldOptions.CustomerSubtype : []} value={filters.CustomerSubtype[0]} label="Customer Subtype" onChange={(v) => handleSelectChange("CustomerSubtype", v)} />

                    <SingleSelect options={Array.isArray(fieldOptions?.City) ? fieldOptions.City : []} value={filters.City[0]} label="City" onChange={(v) => handleSelectChange("City", v)} />

                    <SingleSelect options={Array.isArray(fieldOptions?.Location) ? fieldOptions.Location : []} value={filters.Location[0]} label="Location" onChange={(v) => handleSelectChange("Location", v)} />

                    <SingleSelect options={Array.isArray(fieldOptions?.User) ? fieldOptions.User : []} value={filters.User[0]} label="User" onChange={(v) => handleSelectChange("User", v)} />

                    <SingleSelect options={["10", "25", "50", "100"]} value={filters.Limit[0]} label="Limit" onChange={(v) => handleSelectChange("Limit", v)} />

                  </div>

                </div>

                {/* ✅ Keyword Search */}
                <form className="flex flex-wrap max-md:flex-col justify-between items-center mb-5">
                  <div className="min-w-[80%]">
                    <label className="block mb-2 text-sm font-medium text-gray-900">AI Genie</label>
                    <input
                      type="text"
                      placeholder="type text here.."
                      className="border border-gray-300 rounded-md px-3 py-2 outline-none w-full"
                      value={filters.Keyword}
                      onChange={(e) => handleSelectChange("Keyword", e.target.value)}
                    />
                  </div>

                  <div className="flex justify-center items-center">
                    <button type="submit" className="border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer px-3 py-2 mt-6 rounded-md">
                      Explore
                    </button>
                    <button type="reset" onClick={clearFilter} className="text-red-500 text-sm px-5 py-2 mt-6 rounded-md ml-3">
                      Clear Search
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className=" overflow-auto">
              <div className="flex gap-10 items-center px-3 py-4 min-w-max text-gray-700">

                <label htmlFor="selectall" className=" relative overflow-hidden py-[2px] group hover:bg-[var(--color-primary-lighter)] hover:text-white text-[var(--color-primary)] bg-[var(--color-primary-lighter)]  rounded-tr-sm rounded-br-sm  border-l-[3px] px-2 border-l-[var(--color-primary)] cursor-pointer">
                  <div className=" absolute top-0 left-0 z-0 h-full bg-[var(--color-primary)] w-0 group-hover:w-full transition-all duration-300 "></div>
                  <span className="relative">Select All</span>
                </label>
                <button type="button" className=" relative overflow-hidden py-[2px] group hover:bg-[var(--color-primary-lighter)] hover:text-white text-[var(--color-primary)] bg-[var(--color-primary-lighter)]  rounded-tr-sm rounded-br-sm  border-l-[3px] px-2 border-l-[var(--color-primary)] cursor-pointer" onClick={() => {
                  if (selectedCustomers.length <= 0) toast.error("please select atleast 1 customer")
                  else {
                    setIsAssignOpen(true);
                    fetchUsers()
                  } 0
                }}><div className=" absolute top-0 left-0 z-0 h-full bg-[var(--color-primary)] w-0 group-hover:w-full transition-all duration-300 "></div>
                  <span className="relative">Asign To</span></button>
                <button type="button" className=" relative overflow-hidden py-[2px] group hover:bg-[var(--color-primary-lighter)] hover:text-white text-[var(--color-primary)] bg-[var(--color-primary-lighter)]  rounded-tr-sm rounded-br-sm  border-l-[3px] px-2 border-l-[var(--color-primary)] cursor-pointer" onClick={() => {
                  if (selectedCustomers.length <= 0) toast.error("please select atleast 1 customer")
                  else {
                    setIsMailAllOpen(true);
                    fetchEmailTemplates()
                  }
                }}><div className=" absolute top-0 left-0 z-0 h-full bg-[var(--color-primary)] w-0 group-hover:w-full transition-all duration-300 "></div>
                  <span className="relative">Email All</span></button>
                <button type="button" className=" relative overflow-hidden py-[2px] group hover:bg-[var(--color-primary-lighter)] hover:text-white text-[var(--color-primary)] bg-[var(--color-primary-lighter)]  rounded-tr-sm rounded-br-sm  border-l-[3px] px-2 border-l-[var(--color-primary)] cursor-pointer" onClick={() => {
                  if (selectedCustomers.length <= 0) toast.error("please select atleast 1 customer")
                  else {
                    setIsWhatsappAllOpen(true);
                    fetchWhatsappTemplates()
                  }
                }}><div className=" absolute top-0 left-0 z-0 h-full bg-[var(--color-primary)] w-0 group-hover:w-full transition-all duration-300 "></div>
                  <span className="relative">SMS All</span></button>
                {/*                 <button type="button" className=" relative overflow-hidden py-[2px] group hover:bg-[var(--color-primary-lighter)] hover:text-white text-[var(--color-primary)] bg-[var(--color-primary-lighter)]  rounded-tr-sm rounded-br-sm  border-l-[3px] px-2 border-l-[var(--color-primary)] cursor-pointer">
                  <div className=" absolute top-0 left-0 z-0 h-full bg-[var(--color-primary)] w-0 group-hover:w-full transition-all duration-300 "></div>
                  <span className="relative ">Mass Update</span>
                </button> */}
                <button type="button" className=" relative overflow-hidden py-[2px] group hover:bg-[var(--color-primary-lighter)] hover:text-white text-[var(--color-primary)] bg-[var(--color-primary-lighter)]  rounded-tr-sm rounded-br-sm  border-l-[3px] px-2 border-l-[var(--color-primary)] cursor-pointer" onClick={() => {
                  if (customerData.length > 0) {
                    setIsDeleteAllDialogOpen(true);
                    setDeleteAllDialogData({});
                  }
                }}><div className=" absolute top-0 left-0 z-0 h-full bg-[var(--color-primary)] w-0 group-hover:w-full transition-all duration-300 "></div>
                  <span className="relative ">Delete All</span>
                </button>
              </div>

              <table className="table-auto w-full border-collapse text-sm border border-gray-200">
                <thead className="bg-[var(--color-primary)] text-white">
                  <tr>

                    {/* ✅ SELECT ALL CHECKBOX COLUMN */}
                    <th className="px-2 py-3 border border-[var(--color-secondary-dark)] text-left">

                      <input
                        id="selectall"
                        type="checkbox"
                        className=" hidden"
                        checked={
                          currentRows.length > 0 &&
                          currentRows.every((r) => selectedCustomers.includes(r._id))
                        }
                        onChange={handleSelectAll}
                      />
                    </th>

                    <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">S.No.</th>
                    <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Campaign</th>
                    <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Customer Type</th>
                    <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Customer Subtype</th>
                    <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Location</th>
                    <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Contact No</th>
                    <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Assign To</th>
                    <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Date</th>
                    <th className="px-4 py-3 border border-[var(--color-secondary-dark)] text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {currentRows.length > 0 ? (
                    currentRows.map((item, index) => (
                      <tr key={item._id} className="border-t hover:bg-[#f7f6f3] transition-all duration-200">

                        {/* ✅ ROW CHECKBOX */}
                        <td className="px-2 py-3 border border-gray-200">
                          <input
                            type="checkbox"
                            checked={selectedCustomers.includes(item._id)}
                            onChange={() => handleSelectRow(item._id)}
                          />
                        </td>

                        <td className="px-4 py-3 border border-gray-200">{(currentTablePage - 1) * rowsPerTablePage + (index + 1)}</td>
                        <td className="px-4 py-3 border border-gray-200">{item.Campaign}</td>
                        <td className="px-4 py-3 border border-gray-200">{item.Type}</td>
                        <td className="px-4 py-3 border border-gray-200">{item.SubType}</td>
                        <td className="px-4 py-3 border border-gray-200">{item.Location}</td>
                        <td className="px-4 py-3 border border-gray-200 break-all whitespace-normal w-full max-w-[200px]">{item.ContactNumber}</td>
                        <td className="px-4 py-3 border border-gray-200">{item.AssignTo}</td>
                        <td className="px-4 py-3 border border-gray-200">{item.Date}</td>

                        <td className="px-4 py-2 flex gap-2 items-center">
                          <Button
                            sx={{ backgroundColor: "#E8F5E9", color: "var(--color-primary)", minWidth: "32px", height: "32px", borderRadius: "8px" }}
                            onClick={() => router.push(`/followups/customer/add/${item._id}`)}
                          >
                            <MdAdd />
                          </Button>

                          <Button
                            sx={{ backgroundColor: "#E8F5E9", color: "var(--color-primary)", minWidth: "32px", height: "32px", borderRadius: "8px" }}
                            onClick={() => router.push(`/customer/edit/${item._id}`)}
                          >
                            <MdEdit />
                          </Button>

                          <Button
                            sx={{ backgroundColor: "#FDECEA", color: "#C62828", minWidth: "32px", height: "32px", borderRadius: "8px" }}
                            onClick={() => {
                              setIsDeleteDialogOpen(true);
                              setDialogType("delete");
                              setDialogData({
                                id: item._id,
                                customerName: item.Name,
                                ContactNumber: item.ContactNumber,
                              });
                            }}
                          >
                            <MdDelete />
                          </Button>

                          <Button
                            sx={{
                              backgroundColor: "#FFF0F5",
                              color: item.isFavourite ? "#E91E63" : "#C62828",
                              minWidth: "32px",
                              height: "32px",
                              borderRadius: "8px",
                            }}
                            onClick={() =>
                              handleFavouriteToggle(item._id, item.Name, item.ContactNumber, item.isFavourite ?? false)
                            }
                          >
                            {item.isFavourite ? <MdFavorite /> : <MdFavoriteBorder />}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={10} className="text-center py-4 text-gray-500">
                        No data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>


            </div>
            {/* Pagination */}
            <div className="flex justify-between items-center mt-3 py-3 px-5">
              <p className="text-sm">
                Page {currentTablePage} of {totalTablePages}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() =>
                    setCurrentTablePage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentTablePage === 1}
                  className="px-3 py-1 bg-gray-200 border border-gray-300 rounded disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setCurrentTablePage((prev) =>
                      prev < totalTablePages ? prev + 1 : prev
                    )
                  }
                  disabled={currentTablePage === totalTablePages}
                  className="px-3 py-1 bg-gray-200 border border-gray-300 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>
    </ProtectedRoute>
  );
}
