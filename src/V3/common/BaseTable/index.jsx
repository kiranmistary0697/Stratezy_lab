import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";

import FixedRow from "./FixedRow";
import Pagination from "./Pagination";

import styled from "@emotion/styled";
import Backdrop from "../Backdrop";
import { useLazyCachedGetQuery } from "../../../slices/api";

const valuesToFilterForQuery = [null, "", undefined];

export const usePagination = () => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const next = useCallback(() => setPage((prev) => prev + 1), []);
  const previous = useCallback(() => setPage((prev) => prev - 1), []);
  const first = useCallback(() => setPage(1), []);
  const last = useCallback(() => setPage(totalPages), [totalPages]);
  const gotoPage = useCallback((page) => setPage(page), []);

  return {
    page,
    totalPages,
    setTotalPages,
    next,
    previous,
    first,
    last,
    gotoPage,
  };
};

const StyledTableContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "maxHeight",
})`
  max-height: ${({ maxHeight }) => maxHeight ?? "unset"};
  overflow-y: auto;
  .MuiPaper-root {
    overflow-x: scroll;
  }
`;

const BaseTable = ({
  columns,
  data,
  id,
  className,
  style,
  headerClassName,
  bodyClassName,
  pagination,
  pageSize,
  paginationType,
  serverSidePaginationConfig = {},
  registerResetPage = () => {},
  isExpandable,
  isDefaultExpanded,
  displaySrNo,
  renderSubRow = () => {},
  maxHeight,
  t,
}) => {
  const [rowData, setRowData] = useState([]);
  const [isAllExpanded, setIsAllExpanded] = useState(isDefaultExpanded);

  const paginate = usePagination();
  const { page, setTotalPages, first } = paginate;

  const [cachedGet, { data: { data: tableData } = {}, isLoading, isFetching }] =
    useLazyCachedGetQuery();

  useEffect(() => {
    if (!pagination) {
      setRowData(data);
    }
  }, [pagination, data]);

  useEffect(() => {
    if (pagination && paginationType === "clientSide") {
      setTotalPages(Math.ceil(data.length / pageSize));
      const rowData = data.slice(pageSize * (page - 1), pageSize * page);
      setRowData(rowData);
    }
  }, [page, pageSize, paginationType, data, pagination, setTotalPages]);

  useEffect(() => {
    if (
      pagination &&
      paginationType === "serverSide" &&
      serverSidePaginationConfig.endpoint
    ) {
      const initialQuery = { pageNumber: page, pageSize };
      const query = serverSidePaginationConfig.query || {};

      const finalQuery = Object.entries({
        ...initialQuery,
        ...query,
      }).reduce((result, [key, value]) => {
        if (valuesToFilterForQuery.includes(value)) {
          return result;
        }

        return {
          ...result,
          [key]: value,
        };
      }, {});

      cachedGet({
        endpoint: serverSidePaginationConfig.endpoint,
        query: finalQuery,
        tags: serverSidePaginationConfig.tags,
      });
    }
  }, [
    page,
    pageSize,
    pagination,
    paginationType,
    serverSidePaginationConfig.query,
    serverSidePaginationConfig.endpoint,
    serverSidePaginationConfig.tags,
  ]);

  useEffect(() => {
    if (tableData?.items) {
      setRowData(tableData.items);
      setTotalPages(tableData.totalPage);
    }
  }, [tableData, setTotalPages]);

  useEffect(() => {
    registerResetPage(first);
  }, []);

  const updatedColumns = useMemo(
    () => (displaySrNo ? [{ title: "Sr. No" }, ...columns] : columns),
    [columns]
  );

  return (
    <>
      <StyledTableContainer maxHeight={maxHeight}>
        {/* <Backdrop open={isLoading || isFetching} /> */}
        <Table id={id} className={className} sx={style}>
          <TableHead
            className={headerClassName}
            sx={{
              backgroundColor: "#1B365D",
              position: "sticky",
              top: 0,
              zIndex: 2,
            }}
          >
            <TableRow>
              {isExpandable && !!rowData.length && (
                <TableCell sx={{ width: "10px" }}>
                  <IconButton
                    className="text-white"
                    onClick={() => setIsAllExpanded((prev) => !prev)}
                  >
                    <i
                      className={`${
                        isAllExpanded
                          ? "mdi mdi-chevron-double-down "
                          : "mdi mdi-chevron-double-right"
                      } ri-md`}
                    />
                  </IconButton>
                </TableCell>
              )}
              {updatedColumns.map((column, index) => (
                <TableCell
                  sx={{ color: "white" }}
                  key={column.field || index}
                  {...(column.columnProps ?? {})}
                >
                  {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody className={bodyClassName}>
            {rowData.length ? (
              rowData.map((item, rowIndex) => (
                <FixedRow
                  key={`${item.id}-${page}-${rowIndex}`}
                  rowIndex={rowIndex}
                  columns={updatedColumns}
                  page={page}
                  pageSize={pageSize}
                  item={item}
                  displaySrNo={displaySrNo}
                  isExpandable={isExpandable}
                  isAllExpanded={isAllExpanded}
                  renderSubRow={renderSubRow}
                />
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={updatedColumns.length}
                  className="text-center"
                >
                  No Data Available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTableContainer>
      {pagination && <Pagination paginate={paginate} style={style} />}
    </>
  );
};
export default BaseTable;
