import * as React from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

const DecideMenu = (props) => {
  const { displayMenu } = props;
  return (
    <Stack spacing={2} alignItems='center'>
      <Button variant='contained' onClick={displayMenu}>
        献立を決める
      </Button>
    </Stack>
  );
};

export default DecideMenu;
