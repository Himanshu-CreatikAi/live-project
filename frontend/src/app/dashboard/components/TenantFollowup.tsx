"use client";
import React from 'react'
import ProgressCircle from './ProgressCircle';
import Link from 'next/link';
import { BsArrowRightCircle } from "react-icons/bs";

const TenantFollowups = () => {
    const TenantFollowUpData = [
        {
            percentage: 48,
            color: "#10b981",
            visits: 10,
            followUp: 21,
            status: "To Visit"
        },
        {
            percentage: 0,
            color: "#10b981",
            visits: 0,
            followUp: 21,
            status: "Visited"
        },
        {
            percentage: 24,
            color: "#10b981",
            visits: 5,
            followUp: 21,
            status: "Interested"
        },
        {
            percentage: 0,
            color: "#10b981",
            visits: 0,
            followUp: 21,
            status: "Not Interested"
        },
        {
            percentage: 0,
            color: "#10b981",
            visits: 5,
            followUp: 21,
            status: "Want Demo"
        },
        {
            percentage: 29,
            color: "#ef4444",
            visits: 6,
            followUp: 21,
            status: "Need Followup"
        }

    ]
    return (
        <div>
            <section className=" mt-6 bg-white p-5">
                <h2 className=" font-bold text-xl mb-10">TENANT FOLLOWUP</h2>

                <div className=" grid lg:grid-cols-4 md:grid-cols-2 max-md:grid-cols-1 gap-12 px-5">

                    {
                        TenantFollowUpData.map((item, index) => {
                            return <div key={index} className=" flex flex-col gap-1">


                                <div>
                                    <ProgressCircle percentage={item.percentage} size={80} strokeWidth={3} color={item.color} />

                                </div>
                                <div className=" text-center">
                                    <p>{item.visits} {item.status} / {item.followUp} FollowUp</p>
                                    <Link href={"#"} className=" flex gap-1 items-center justify-center">{item.status} <BsArrowRightCircle className=" mt-[2px] text-sm font-light"/></Link>
                                </div>
                            </div>
                        })
                    }



                </div>
            </section>
        </div>
    )
}

export default TenantFollowups
