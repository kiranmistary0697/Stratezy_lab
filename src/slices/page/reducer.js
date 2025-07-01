import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stockBundle: [],
  tradeRule: [],
  traderSequence: [],
  stockEntryExitEntry: [],
  stockEntryExitExit: [],
  portfolioSizing: [],
  marketEntryExitEntry: [],
  marketEntryExitExit: [],
  backTestData:[]
};

const stockSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setAllData: (state, action) => {
      state[action.payload.key] = action.payload.data;
    },
    setBacktestData: (state,action)=> {
      state.backTestData =  action.payload
    }
  },
});

export const { setAllData , setBacktestData } = stockSlice.actions;
export default stockSlice.reducer;
