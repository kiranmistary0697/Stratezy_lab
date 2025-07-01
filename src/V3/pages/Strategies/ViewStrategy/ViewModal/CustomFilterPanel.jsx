import { Checkbox, FormControlLabel, FormGroup, Paper } from "@mui/material";
import { useState } from "react";
import Badge from "../../../../common/Badge";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";

const CustomFilterPanel = ({
  data = [],
  fieldName,
  title,
  applyValue,
  dataKey = "",
  isVersion = false,
  isStatus = false,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);

  const handleChange = (event, dataKey) => {
    const newSelected = event.target.checked
      ? [...selectedValues, dataKey]
      : selectedValues.filter((val) => val !== dataKey);

    setSelectedValues(newSelected);

    applyValue({
      field: fieldName,
      operator: "in",
      value: newSelected.length > 0 ? newSelected : [],
    });
  };

  return (
    <Paper sx={{ p: 2, width: 300 }}>
      <strong>{title}</strong>
      {data.length > 0 ? (
        <FormGroup>
          {data.map((item, index) => {
            const key = `${item[dataKey]}${
              isVersion ? item.version || "" : ""
            }-${index}`;
            const isChecked = selectedValues.includes(item[dataKey]);
            return (
              <FormControlLabel
                className="custom-select "
                key={key}
                control={
                  <Checkbox
                    icon={<CheckBoxOutlinedIcon />}
                    checkedIcon={<CheckBoxIcon />}
                    checked={isChecked}
                    onChange={(event) => handleChange(event, item[dataKey])}
                  />
                }
                label={
                  <div className="flex items-center gap-2">
                    {!isStatus && <span>{item[dataKey]}</span>}
                    {isVersion && item.version && (
                      <Badge variant="version">{item.version}</Badge>
                    )}
                    {isStatus && item[dataKey] && (
                      <Badge variant={item[dataKey].toLowerCase()} isSquare>
                        {item[dataKey]}
                      </Badge>
                    )}
                  </div>
                }
              />
            );
          })}
        </FormGroup>
      ) : (
        <p>No available options</p>
      )}
    </Paper>
  );
};

export default CustomFilterPanel;
