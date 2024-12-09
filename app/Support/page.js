// import { Navbar } from "@/components/navbar";
import {SupportPageComponent} from "../../components/support-page";
import React from 'react'
import ProtectedComponent from '@/components/UnifiedProtectedComponent'
const Support = () => {
  return (
    <>
    {/* <Navbar/> */}
   < SupportPageComponent/>
    </>
  )
}

export default ProtectedComponent(Support);