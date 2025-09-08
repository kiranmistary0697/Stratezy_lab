import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Paper,
  Typography,
} from "@mui/material";
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
  isSquare = true,
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
    <Paper
      sx={{
        p: 2,
        width: 300,
        boxShadow: "0px 0px 0px 0px",
      }}
    >
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
                  <Typography
                    sx={{
                      fontFamily: "Inter",
                      fontWeight: 400,
                      fontSize: "14px",
                      lineHeight: "120%",
                      letterSpacing: "0%",
                      color: "#0A0A0A",
                    }}
                  >
                    {!isStatus && <span>{item[dataKey]} </span>}
                    {isVersion && item.version && (
                      <Badge variant="version">{item.version}</Badge>
                    )}
                    {isStatus && item[dataKey] && (
                      <Badge
                        variant={item[dataKey].toLowerCase()}
                        isSquare={isSquare}
                      >
                        {item[dataKey]}
                      </Badge>
                    )}
                  </Typography>
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
