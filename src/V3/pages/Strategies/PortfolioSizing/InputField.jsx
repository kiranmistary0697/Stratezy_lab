import { FormGroup, FormHelperText, TextField, Tooltip } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
const InputField = ({
  tooltip,
  label,
  error,
  errorText,
  disable,
  ...props
}) => {
  return (
    <div className="w-full md:w-[368px]">
      <FormGroup className="mb-3">
        <label className="flex gap-2.5 items-center text-[12px] font-semibold text-[#333] leading-[14.52px]">
          {label}
          <Tooltip
            title={tooltip}
            placement="right"
            componentsProps={{
              tooltip: {
                sx: {
                  // width: "400px",
                  padding: "16px",
                  background: "#FFFFFF",
                  color: "#666666",
                  boxShadow: "0px 8px 16px 0px #7B7F8229",
                  fontFamily: "Inter",
                  fontWeight: 400,
                  fontSize: "14px",
                  lineHeight: "20px",
                },
              },
            }}
          >
            <InfoOutlinedIcon
              sx={{
                color: "#666666",
                width: "17px",
                height: "17px",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        </label>
        <TextField
          fullWidth
          margin="normal"
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: "100%",
              md: "368px",
            },
            maxWidth: "100%",
            outline: "none",
          }}
          disabled={disable}
          error={error}
          {...props}
        />
        {error && <FormHelperText error>{errorText}</FormHelperText>}
      </FormGroup>
    </div>
  );
};

export default InputField;
