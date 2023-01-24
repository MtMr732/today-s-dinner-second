import * as React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const Selector = (props) => {
  const { menutype, handleMenutype } = props;

  return (
    <Box sx={{ minWidth: 120, maxWidth: 200 }}>
      <FormControl fullWidth>
        <InputLabel id='select-label'>select</InputLabel>
        <Select
          id='menu-type'
          value={menutype}
          label='select'
          onChange={handleMenutype}
        >
          <MenuItem value={"mainMenus"}>主菜</MenuItem>
          <MenuItem value={"sideMenus"}>副菜</MenuItem>
          <MenuItem value={"garnish"}>付け合わせ</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};
export default Selector;
