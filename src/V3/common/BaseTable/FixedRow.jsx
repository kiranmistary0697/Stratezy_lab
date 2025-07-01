import React, { useRef, useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { get } from "lodash";
import { IconButton, TableCell, TableRow } from "@mui/material";
const emptyValues = [null, undefined, ""];

const FixedRow = ({
  columns,
  rowIndex,
  page,
  item,
  isExpandable,
  isAllExpanded,
  renderSubRow,
  displaySrNo,
  pageSize,
}) => {
  const ref = useRef();
  const [isExpanded, setIsExpanded] = useState(isAllExpanded);

  useEffect(() => {
    setIsExpanded(isAllExpanded);
  }, [isAllExpanded]);

  const subRow = useMemo(() => renderSubRow(item), [item, renderSubRow]);

  const rowProps = item.id ? { id: item.id } : {};

  return (
    <>
      <TableRow {...rowProps}>
        {isExpandable && subRow && (
          <TableCell sx={{ width: "5%" }}>
            <IconButton
              className="text-dark"
              onClick={() => setIsExpanded((prev) => !prev)}
            >
              <i
                className={`${
                  isExpanded
                    ? "ri-arrow-down-s-line ri-sm"
                    : "ri-arrow-right-s-line ri-sm"
                }`}
              />
            </IconButton>
          </TableCell>
        )}

        {columns.map((column, index) =>
          !!displaySrNo && index === 0 ? (
            <TableCell key={index}>
              {(page - 1) * pageSize + (rowIndex + 1)}
            </TableCell>
          ) : (
            <TableCell key={column.field || index}>
              {column.field
                ? emptyValues.includes(get(item, column.field))
                  ? "--"
                  : get(item, column.field)
                : column.renderCell &&
                  column.renderCell(item, rowIndex, page, ref)}
            </TableCell>
          )
        )}
      </TableRow>

      {isExpanded && subRow && (
        <TableRow>
          <TableCell colSpan={columns.length + 1}>{subRow}</TableCell>
        </TableRow>
      )}
    </>
  );
};

FixedRow.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object),
  rowIndex: PropTypes.number,
  page: PropTypes.number,
  item: PropTypes.object,
  isExpandable: PropTypes.bool,
  isAllExpanded: PropTypes.bool,
  renderSubRow: PropTypes.func,
  displaySrNo: PropTypes.bool,
  pageSize: PropTypes.number,
};

export default FixedRow;
