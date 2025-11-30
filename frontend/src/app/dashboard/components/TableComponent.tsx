import React from 'react'

const countryData = [
  {
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/1280px-Flag_of_Germany.svg.png",
    countryName: "Gopalpura",
    salesName: "100",
    avgValue: "21.1%"
  },
  {
    img: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Flag_of_the_United_States.svg/1280px-Flag_of_the_United_States.svg.png",
    countryName: "Durgapura",
    salesName: "95",
    avgValue: "34.2%"
  },
/*   {
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Flag_of_Australia.svg/2560px-Flag_of_Australia.svg.png",
    countryName: "Australia",
    salesName: "40",
    avgValue: "12.45%"
  },
  {
    img: "https://img.freepik.com/free-vector/illustration-uk-flag_53876-18166.jpg?semt=ais_hybrid&w=740&q=80",
    countryName: "United Kingdom",
    salesName: "10",
    avgValue: "8.65%"
  } */
]

function TableComponent() {
  return (
    <div className="w-full max-w-full sm:max-w-[500px] bg-white  shadow-md p-3 sm:p-5 mx-auto">
      <h2 className="text-base sm:text-lg font-semibold text-gray-700 mb-4 text-center sm:text-left">
        Global Sales by Top Locations
      </h2>

      {/* Header */}
      <div className="hidden sm:flex flex-row items-center justify-between text-gray-500 font-semibold text-xs  border-b border-gray-200 pb-2 mb-2">
       {/*  <div className="">Flag</div> */}
        <div>Locations</div>
        <div>Customers</div>
        {/* <div>Average</div> */}
      </div>

      {/* Rows */}
      <div className="flex flex-col gap-3">
        {countryData.map((data, index) => (
          <div
            key={index}
            className="grid grid-cols-2 sm:grid-cols-2 items-center bg-gray-50 sm:bg-transparent 
              p-2 sm:p-0 rounded-lg sm:rounded-none shadow-sm sm:shadow-none"
          >
            {/* Flag */}
           {/*  <div className="flex justify-center sm:justify-start">
              <img
                src={data.img}
                alt={`${data.countryName} flag`}
                className="w-6 h-4 sm:w-8 sm:h-5 object-cover rounded-sm"
              />
            </div> */}

            {/* Country */}
            <div className="text-center sm:text-left text-xs sm:text-sm font-medium text-gray-700 truncate">
              {data.countryName}
            </div>

            {/* Sales */}
            <div className=" text-xs text-right sm:text-sm text-gray-600">
              {data.salesName}
            </div>

            {/* Avg (hidden on mobile) */}
          {/*   <div className="hidden sm:block text-center sm:text-right text-xs sm:text-sm text-gray-600">
              {data.avgValue}
            </div> */}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableComponent
