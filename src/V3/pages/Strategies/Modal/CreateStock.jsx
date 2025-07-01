import React, { useEffect, useMemo, useState } from "react";
import useDebounce from "../../../hooks/useDebounce";
import { useLazyGetQuery } from "../../../../slices/api";
import { tagTypes } from "../../../tagTypes";
import {
  Dialog,
  DialogContent,
  TextField,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  createFilterOptions,
  CircularProgress,
} from "@mui/material";
import CreateStockFilterModal from "./CreateStockFilterModal";
import ModalButton from "../../../common/Table/ModalButton";
import { useNavigate } from "react-router-dom";

const CreateStock = ({
  isOpen,
  handleClose,
  setIsCreateStock,
  handleNewStockFilter = () => {},
}) => {
  const navigate = useNavigate();

  const [getStrategyData] = useLazyGetQuery();

  const [stockList, setStockList] = useState([]);
  const [selectedStock, setSelectedStock] = useState([]);
  const [filterType, setFilterType] = useState("static");
  const [isNewStockFilter, setIsNewStockFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const debouncedInput = useDebounce(inputValue, 300);

  // Fetch stock data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const { data } = await getStrategyData({
          endpoint: "command/backtest/equitylist?exchange=nse",
          tags: [tagTypes.GET_STOCK],
        }).unwrap();
        setStockList(data);
      } catch (error) {
        console.error("Failed to fetch all data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleSave = () => {
    if (filterType === "static") {
      setIsNewStockFilter(true);
    } else {
      navigate("/Devstudio/create-function");
    }
  };

  const customFilterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) =>
      `${option?.symbol?.toLowerCase()} ${option?.companyName?.toLowerCase()}`,
  });

  const filteredStockList = useMemo(() => {
    const flatList = stockList.flat();
    const keyword = debouncedInput.toLowerCase();

    return flatList.filter(
      (stock) =>
        stock &&
        !selectedStock.some(
          (selected) =>
            selected.symbol === stock.symbol ||
            selected.companyName === stock.companyName
        ) &&
        (stock.symbol?.toLowerCase().includes(keyword) ||
          stock.companyName?.toLowerCase().includes(keyword))
    );
  }, [stockList, selectedStock, debouncedInput]);

  return (
    <>
      {isNewStockFilter && (
        <CreateStockFilterModal
          isOpen={isNewStockFilter}
          handleClose={() => setIsNewStockFilter(false)}
          closeCreatStock={handleClose}
          selectedStock={selectedStock}
          title={"Create Static Stock Filter"}
          description="Description"
          onSave={handleNewStockFilter}
        />
      )}

      <Dialog open={isOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent className="space-y-4 !p-[30px]">
          <Box display="flex" flexDirection="column" gap={2}>
            {/* Header */}
            <Typography
              className="subheader"
              sx={{
                fontFamily: "Inter",
                fontWeight: 600,
                fontSize: "20px",
                color: "#0A0A0A",
              }}
            >
              Create New Stock Filter
            </Typography>

            {/* Filter Type Toggle */}
            <RadioGroup
              className="flex justify-between items-center"
              row
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              sx={{
                "& .MuiRadio-root.Mui-checked": {
                  color: "black",
                },
              }}
            >
              <FormControlLabel
                value="static"
                control={<Radio />}
                label="Static Stock Filter"
              />
              <FormControlLabel
                value="dynamic"
                control={<Radio />}
                label="Dynamic Stock Filter"
              />
            </RadioGroup>

            {/* Autocomplete for Static */}
            {filterType === "static" && (
              <Autocomplete
                multiple
                options={filteredStockList}
                filterOptions={customFilterOptions}
                getOptionLabel={(option) =>
                  option?.symbol || option?.companyName
                }
                value={selectedStock}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) =>
                  setInputValue(newInputValue)
                }
                onChange={(event, newValue) => setSelectedStock(newValue)}
                isOptionEqualToValue={(option, value) =>
                  option?.symbol === value.symbol &&
                  option?.companyName === value.companyName
                }
                renderOption={(props, option, { index }) => {
                  // Show loader if no options are available yet
                  if (filteredStockList.length === 0 && index === 0) {
                    return (
                      <li
                        {...props}
                        style={{ justifyContent: "center", padding: "10px" }}
                      >
                        <CircularProgress size={20} />
                      </li>
                    );
                  }

                  return (
                    <li {...props}>
                      <Box display="flex" flexDirection="column">
                        <Typography fontWeight="bold">
                          {option.symbol?.toUpperCase()}
                        </Typography>
                        <Typography color="text.secondary" fontSize={14}>
                          {option.companyName}
                        </Typography>
                      </Box>
                    </li>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select a Stock"
                    variant="outlined"
                    fullWidth
                  />
                )}
                componentsProps={{
                  paper: {
                    sx: {
                      maxHeight: "200px",
                      "& ul": {
                        maxHeight: "160px",
                        overflowY: "auto",
                      },
                    },
                  },
                }}
              />
            )}

            {/* Info Box */}
            <Box
              bgcolor="#F3F6FC"
              borderRadius={2}
              sx={{
                padding: "40px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{ color: "#0A0A0A" }}
              >
                {filterType === "dynamic"
                  ? "Dynamic Stock Filters"
                  : "Add Stock"}
              </Typography>
              <Typography
                variant="body1"
                align="center"
                sx={{ color: "#666666", fontSize: "14px", lineHeight: "20px" }}
              >
                {filterType === "dynamic"
                  ? "Dynamic Stock Filters are more configurable and dynamic in nature."
                  : "Search and add stocks to create a stock filter. This stock filter will be added at the global level."}
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box className="flex gap-5 justify-center items-center w-full">
              <ModalButton variant="secondary" onClick={handleClose}>
                Cancel
              </ModalButton>
              <ModalButton variant="primary" onClick={handleSave}>
                {filterType === "dynamic"
                  ? "Create in Dev Studio"
                  : "Create Stock Filter"}
              </ModalButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateStock;
