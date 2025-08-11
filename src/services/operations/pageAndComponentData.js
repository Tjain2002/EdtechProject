// import React from 'react'
import {toast} from "react-hot-toast"
import { apiConnector } from '../apiconnector';
import { catalogData } from '../apis';

export const getCatalogaPageData = async(categoryId) => {
  const toastId = toast.loading("Loading...");
  let result = null;

  try {
    const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API, { categoryId });

    if (!response?.data?.success)
      throw new Error("Could not fetch category page data");

    result = response?.data?.data; // ✅ Only extract the 'data' object
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR....", error);
    toast.error(error.message || "Something went wrong");
    result = error.response?.data;
  }

  toast.dismiss(toastId);
  return result;
}




