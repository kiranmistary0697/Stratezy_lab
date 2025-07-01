import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Autocomplete,
  TextField,
  Box,
  CircularProgress,
  Menu,
  MenuItem,
  Popover,
  ListItemIcon,
  createFilterOptions,
} from "@mui/material";
import { Delete as DeleteIcon, MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";

import { tagTypes } from "../../../tagTypes";
import { useLazyGetQuery } from "../../../../slices/api";

import ModalButton from "../../../common/Table/ModalButton";

import ConfirmModal from "./ConfirmModal";
import ViewAndAddStock from "./ViewAndAddStock";
import CreateStockFilterModal from "./CreateStockFilterModal";

const AddStockFilterModal = ({
  open,
  handleClose,
  title,
  edit = false,
  viewStockList,
  setViewStockList = () => {},
  handleNewStockFilter = () => {},
}) => {
  const navigate = useNavigate();
  const [request] = useLazyGetQuery();

  const { rule = "", func = "", desc = "" } = viewStockList ?? {};

  const [isEditing, setIsEditing] = useState(edit);
  const [allStocks, setAllStocks] = useState([]); // flat NSE list from API
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [isNewStock, setIsNewStock] = useState(false);
  const [input, setInput] = useState("");
  const debouncedInput = useDebounce(input, 300);

  // menu / popover state
  const [menuEl, setMenuEl] = useState(null);
  const [menuStock, setMenuStock] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // child‑modal toggles
  const [showConfirm, setShowConfirm] = useState(false);
  const [showViewStockModal, setShowViewStockModal] = useState(false);

  // API helpers
  const fetchAllStocks = useCallback(async () => {
    try {
      const { data } = await request({
        endpoint: "command/backtest/equitylist?exchange=nse",
        tags: [tagTypes.GET_STOCK],
      }).unwrap();
      setAllStocks(data?.flat() ?? []);
    } catch (err) {
      console.error("Failed to load stocks", err);
    }
  }, [request]);

  const fetchFilterStocks = useCallback(async () => {
    try {
      const { data } = await request({
        endpoint: `stock-analysis-function/${title}`,
        tags: [tagTypes.GET_SELECTDATA],
      }).unwrap();
      setViewStockList(data);
    } catch (err) {
      console.error("Failed to refresh filter stocks", err);
    }
  }, [request, title, setViewStockList]);

  useEffect(() => {
    // On mode switch, fetch corresponding data
    if (isEditing) fetchAllStocks();
    else fetchFilterStocks();
  }, [isEditing, fetchAllStocks, fetchFilterStocks]);

  const initialSymbols = useMemo(() => {
    const match = rule.match(/fltr\s*=\s*([\s\S]*?)\)/);
    if (!match) return [];
    return match[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }, [rule]);
  // Pre‑select symbols when entering edit mode
  useEffect(() => {
    if (!isEditing || !allStocks.length || !initialSymbols.length) return;
    const matched = allStocks.filter((stk) =>
      initialSymbols.some(
        (sym) => sym.toLowerCase() === stk.symbol?.toLowerCase()
      )
    );
    setSelectedStocks(matched);
  }, [isEditing, allStocks, initialSymbols]);

  const customFilterOptions = createFilterOptions({
    matchFrom: "any",
    stringify: (option) =>
      `${option?.symbol?.toLowerCase()} ${option?.companyName?.toLowerCase()}`,
  });

  const availableStocks = useMemo(() => {
    const kw = debouncedInput.toLowerCase();
    return allStocks.filter(
      (stk) =>
        !selectedStocks.some((sel) => sel.symbol === stk.symbol) &&
        (stk.symbol?.toLowerCase().includes(kw) ||
          stk.companyName?.toLowerCase().includes(kw))
    );
  }, [allStocks, debouncedInput, selectedStocks]);

  const toggleEditMode = () => setIsEditing((prev) => !prev);

  const openMenu = (e, stk) => {
    setMenuEl(e.currentTarget);
    setMenuStock(stk);
  };
  const closeMenu = () => {
    setMenuEl(null);
    setMenuStock(null);
  };
  const handleDelete = () => {
    if (!menuStock) return;
    setSelectedStocks((prev) =>
      prev.filter((s) => s.symbol !== menuStock.symbol)
    );
    closeMenu();
  };

  const handlePopoverClose = () => setAnchorEl(null);

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          isOpen={showConfirm}
          handleClose={() => setShowConfirm(false)}
          onClose={handleClose}
          strategyName={func}
          descriptionName={desc}
          title="Are you sure?"
          description="Want to add static stock?"
          selectedStocks={selectedStocks}
        />
      )}

      {isNewStock && (
        <CreateStockFilterModal
          isOpen={isNewStock}
          handleClose={() => setIsNewStock(false)}
          closeCreatStock={handleClose}
          selectedStock={selectedStocks}
          title={"Create Static Stock Filter"}
          description="Description"
          onSave={handleNewStockFilter}
        />
      )}

      {showViewStockModal && (
        <ViewAndAddStock
          isOpen={showViewStockModal}
          setOpenAddStockModal={setShowViewStockModal}
          setSelectedStocks={setSelectedStocks}
          initialStockList={initialSymbols}
        />
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent className="space-y-4 !p-[30px]">
          {/* Header */}
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography fontFamily="Inter" fontWeight={600} fontSize={20}>
              {isEditing ? `Edit ${title}` : title}
            </Typography>

            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer", mb: 2 }}
              onClick={() => navigate("/Devstudio/create-function")}
            >
              View Filter Details
            </Typography>

            {/* warning banner when editing */}
            {isEditing && (
              <Typography
                sx={{
                  backgroundColor: "#FFF4E5",
                  color: "#D97706",
                  p: 1,
                  borderRadius: 1,
                  fontSize: 14,
                }}
              >
                This will update the Stock filter globally and affect the
                strategies using this filter.
              </Typography>
            )}

            {isEditing ? (
              <>
                <Autocomplete
                  multiple
                  loading={!allStocks.length}
                  options={availableStocks}
                  value={selectedStocks}
                  filterOptions={customFilterOptions}
                  onChange={(_, newValue) => setSelectedStocks(newValue)}
                  getOptionLabel={(option) => option.symbol || ""}
                  inputValue={input}
                  onInputChange={(_, value) => setInput(value)}
                  isOptionEqualToValue={(option, value) =>
                    option.symbol === value.symbol
                  }
                  renderOption={(props, option) => (
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
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select a Stock"
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {!allStocks.length && (
                              <CircularProgress size={18} />
                            )}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
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

                <List
                  sx={{
                    mt: 2,
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    maxHeight: 200,
                    overflow: "auto",
                  }}
                >
                  {selectedStocks.map((stk) => (
                    <ListItem
                      key={stk.symbol}
                      divider
                      secondaryAction={
                        <IconButton onClick={(e) => openMenu(e, stk)}>
                          <MoreVert />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={<strong>{stk.symbol}</strong>}
                        secondary={stk.companyName}
                      />
                    </ListItem>
                  ))}
                </List>

                {/* contextual menu for delete */}
                <Menu
                  anchorEl={menuEl}
                  open={Boolean(menuEl)}
                  onClose={closeMenu}
                >
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>
              </>
            ) : (
              <List
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  maxHeight: 200,
                  overflow: "auto",
                }}
              >
                {initialSymbols.map((sym) => (
                  <ListItem key={sym} divider>
                    <ListItemText
                      primary={<strong>{sym}</strong>}
                      secondary={sym}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {/* ————————————————— Footer actions ————————————————— */}
          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <ModalButton variant="secondary" onClick={toggleEditMode}>
              {isEditing ? "Cancel" : "Edit List of Stocks"}
            </ModalButton>

            {isEditing ? (
              <>
                <ModalButton
                  variant="primary"
                  onClick={() => setShowConfirm(true)}
                >
                  Update Stock Filter
                </ModalButton>
                <ModalButton
                  variant="primary"
                  onClick={() => setIsNewStock(true)}
                >
                  Save as New Static Filter
                </ModalButton>
              </>
            ) : (
              <ModalButton variant="primary" onClick={handleClose}>
                Close
              </ModalButton>
            )}
          </Box>
        </DialogContent>
      </Dialog>

      {/* popover entry point when user clicks “save as new” elsewhere */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        sx={{ mt: 1 }}
      >
        <Typography
          className="cursor-pointer text-[#3D69D3] px-4 py-2"
          onClick={() => {
            setShowConfirm(true);
            handlePopoverClose();
          }}
        >
          Save as New Static Filter
        </Typography>
      </Popover>
    </>
  );
};

export default AddStockFilterModal;
