import React, { useEffect, useState } from "react";
import { useLazyGetQuery } from "../../../../slices/api";
import { useLocation } from "react-router-dom";
import { tagTypes } from "../../../tagTypes";

import { Box, Divider, Grid2, Tooltip, Typography } from "@mui/material";
import VerifyOnStock from "./VerifyOnStock";
import EditHeader from "./EditHeader";
import FunctionSelect from "./FunctionSelect";
import CreateFunctionHeader from "./CreateFunctionHeader";
import KeywordSearch from "./KeywordSearch";
import EditorFunction from "./EditorFunction";
import VerfiyStockModal from "./VerfiyStockModal";

import {
  FUNCTION_SUB_TITLE,
  FUNCTION_SUB_TITLE_BUTTON,
  FUNCTION_SUB_TITLE_TOOLTIP,
  VERIFY_STOCK_TITLE,
  VERIFY_STOCK_TOOLTIP,
} from "../../../../constants/CommonText";
import AddFunctionModal from "./AddFunctionModal";

const EditFunction = () => {
  const [getStockDetails] = useLazyGetQuery();
  const [getKeywords] = useLazyGetQuery();
  const [getStrategyData] = useLazyGetQuery();

  const [openStockModal, setOpenStockModal] = useState(false);
  const { search, state } = useLocation();
  const [stockData, setStockData] = useState({});
  const [keywordData, setKeywordData] = useState([]);
  const [editUserData, setEditUserData] = useState(false);
  const [openAddFunctionModal, setOpenAddFunctionModal] = useState(false);
  const [stockList, setStockList] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState({});
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const queryParams = new URLSearchParams(search);

  const id = queryParams.get("name");

  //stock-analysis-function/abcggg stock-analysis-function/keywords
  const handleStockAnalysis = async () => {
    try {
      const { data } = await getStockDetails({
        endpoint: `stock-analysis-function/${id}`,
        tags: [tagTypes.GET_SELECTDATA],
      }).unwrap();

      setStockData(data);
    } catch (error) {}
  };
  const handleKeywords = async () => {
    try {
      const { data } = await getKeywords({
        endpoint: `stock-analysis-function/keywords`,
        tags: [tagTypes.GET_KEYWORDS],
      }).unwrap();

      setKeywordData(data);
    } catch (error) {}
  };
  useEffect(() => {
    if (id) {
      handleStockAnalysis();
      handleKeywords();
    }
  }, [id]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // setIsLoading(true);
        const { data } = await getStrategyData({
          endpoint: "command/backtest/equitylist?exchange=nse",
          tags: [tagTypes.GET_STOCK],
        }).unwrap();
        setStockList(data);
      } catch (error) {
        console.error("Failed to fetch all data:", error);
      } finally {
        // setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <>
      {openStockModal && (
        <VerfiyStockModal
          isOpen={openStockModal}
          handleClose={() => {
            setOpenStockModal(false);
          }}
          title={"Verify on a Stock"}
        />
      )}

      {openAddFunctionModal && (
        <AddFunctionModal
          isOpen={openAddFunctionModal}
          handleClose={() => {
            setOpenAddFunctionModal(false);
          }}
          // onSave={handleSaveFunction}
          // isSaving={isSaving}
          // selectedFunction={selectedFunction}
          title={"Create Function"}
        />
      )}

      <div className="sm:h-[calc(100vh-100px)] bg-[#f0f0f0]  overflow-auto p-8">
        <div className="bg-white h-auto">
          <EditHeader
            stockData={stockData}
            handleChange={() => {
              setEditUserData(true);
            }}
          />

          <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />
          <FunctionSelect
            stockData={stockData}
            editUserData={editUserData}
            id={id}
          />
          <Divider sx={{ width: "100%", borderColor: "zinc.200" }} />
          <CreateFunctionHeader
            title={FUNCTION_SUB_TITLE}
            tooltip={FUNCTION_SUB_TITLE_TOOLTIP}
            buttonText={FUNCTION_SUB_TITLE_BUTTON}
            isFunction
            handleChange={() => {
              setOpenStockModal(true);
            }}
            systemDefine={stockData?.userDefined}
            // id={id}
          />
          <Grid2
            container
            spacing={2}
            className="w-full  h-[calc(100%-76px)] overflow-auto px-4 border border-zinc-200 "
          >
            <Grid2
              // className="md:border-r md:border-r-zinc-200"
              item
              size={{
                xs: 12,
                md: 6,
                lg: 4,
              }}
            >
              <KeywordSearch keywordData={keywordData} />
            </Grid2>
            <Grid2
              item
              size={{
                xs: 12,
                md: 6,
                lg: 8,
              }}
            >
              {stockData?.rule && <EditorFunction stockData={stockData} />}
            </Grid2>

            {/* Stock Bundle Step - Full Width on Small Screens, Half on Medium+, 6.7/12 on Large+ */}
          </Grid2>
          <CreateFunctionHeader
            title={VERIFY_STOCK_TITLE}
            tooltip={VERIFY_STOCK_TOOLTIP}
            buttonText={"Continue to save"}
            // isFunction
            handleChange={() => {
              setOpenStockModal(true);
            }}
            isVerify
            // systemDefine={stockData?.userDefined}
            // id={id}
          />

          <Grid2
            container
            spacing={2}
            className="w-full  h-[calc(100%-76px)] overflow-auto px-4 border border-zinc-200"
          >
            <Grid2
              className="md:border-r md:border-r-zinc-200"
              item
              size={{
                xs: 12,
                md: 6,
                lg: 4,
              }}
            >
              <VerifyOnStock
                // title="Verify on Stock"
                dateRange={dateRange}
                setDateRange={setDateRange}
                stockList={stockList}
                selectedStock={selectedStock}
                setSelectedStock={setSelectedStock}
              />
            </Grid2>
            <Grid2
              item
              size={{
                xs: 12,
                md: 6,
                lg: 8,
              }}
            >
              {/* <CapitalChart selectedOption={"capital"} /> */}
            </Grid2>
          </Grid2>
        </div>
      </div>
    </>
  );
};

export default EditFunction;
