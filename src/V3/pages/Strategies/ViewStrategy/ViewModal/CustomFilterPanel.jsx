import { Checkbox, FormControlLabel, FormGroup, Paper } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import Badge from "../../../../common/Badge";

const CustomFilterPanel = ({
  data = [],
  fieldName,
  title,
  applyValue,
  dataKey = "",
  isVersion = false,
  isStatus = false,
  selectedValues = [],
}) => {
  const handleChange = (event, dataKeyValue) => {
    const newSelected = event.target.checked
      ? [...new Set([...selectedValues, dataKeyValue])]
      : selectedValues.filter((val) => val !== dataKeyValue);

    applyValue({
      field: fieldName,
      operator: "in",
      value: newSelected,
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
                // className="custom-select"
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
