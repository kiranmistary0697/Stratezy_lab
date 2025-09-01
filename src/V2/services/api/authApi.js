import React from "react";
import axios from "axios";
import { BACKEND_BASE_URL, authEndpoints } from "../apiEndpoints";

const { FIRST_TIME_LOGIN_API, JOIN_WAITLIST_API } = authEndpoints;

let firstTimeLogin = false; // for first time login stub api response

// Stub for joinWaitlist API
export const joinWaitlist = async (formData) => {
  try {
    //console.log("Calling joinwaitlist API");
    const response = await axios.post(JOIN_WAITLIST_API, formData);
    //console.log("JoinwaitList API response - ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding to waitlist", error);
    throw error;
  }
};

// Stub for firstTimeLogin API
export const checkFirstTimeLogin = async (authToken) => {
  try {
    //console.log("Calling firstTimeLogin API with token:", authToken); // Debug token
    const response = await axios.get(FIRST_TIME_LOGIN_API, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching firstTimeLogin status", error);
    throw error;
  }
};

// Stub for submitAdditionalDetails API
export const submitAdditionalDetails = async (formData, authToken) => {
  // Real API call for form submission
  try {
    //console.log("Calling joinwatlist API");
    const response = await axios.post(FIRST_TIME_LOGIN_API, formData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error submitting additional details", error);
    throw error;
  }
};
