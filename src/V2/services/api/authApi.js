import React from "react";
import axios from "axios";
import { BACKEND_BASE_URL, authEndpoints } from "../apiEndpoints";

const { FIRST_TIME_LOGIN_API, JOIN_WAITLIST_API } = authEndpoints;

let firstTimeLogin = false; // for first time login stub api response

// Stub for joinWaitlist API
export const joinWaitlist = async (formData) => {
  //console.log("Payload=>\n", formData);

  // If backend URL is not defined, simulate the API request
  /*if (!BACKEND_BASE_URL) 
    {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    status: "Success",
                    message: "You have been added to the waitlist. You will get a response in your email once approved."
                });
            }, 1000);
        });
    }*/

  // Real API call
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
  // If backend URL is not defined, simulate the API request
  /* if (!BACKEND_BASE_URL) 
    {
         return new Promise((resolve) => {
             setTimeout(() => {
                 resolve({ firstTimeLogin });
             }, 1000);
         });
    }*/

  // Real API call
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
  // If backend URL is not defined, simulate the API request
  // if (!BACKEND_BASE_URL) {
  //     return new Promise((resolve) => {
  //         setTimeout(() => {
  //             console.log("Addition Details Form Data=>\n", formData);

  //             // After a successful submission, set firstTimeLogin to false
  //             firstTimeLogin = false;

  //             resolve({
  //                 success: true,
  //                 message: "Submission Successful",
  //             });
  //         }, 1000);
  //     });
  // }

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
