export const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// AUTH ENDPOINTS
export const authEndpoints = {
    JOIN_WAITLIST_API: BACKEND_BASE_URL + "/stock-analysis-function/joinWaitList",
    FIRST_TIME_LOGIN_API: BACKEND_BASE_URL + "/stock-analysis-function/firstTimeLogin",
}