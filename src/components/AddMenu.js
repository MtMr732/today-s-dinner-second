import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Selector from "./Selector";
import TextField from "@mui/material/TextField";
import { Stack } from "@mui/system";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 380,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const AddMenu = (props) => {
  const {
    isModalOpen,
    setModalOpen,
    menutype,
    handleMenutype,
    onChangeFile,
    onClickSubmit,
  } = props;
  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <Stack spacing={2} alignItems='center'>
      <Button variant='contained' onClick={handleOpen}>
        メニューを追加
      </Button>
      <Modal open={isModalOpen} onClose={handleClose}>
        <Box sx={style}>
          <Selector menutype={menutype} handleMenutype={handleMenutype} />
          <TextField
            sx={{ maxWidth: 200 }}
            id='menu-name'
            label='メニュー名'
            variant='outlined'
          />
          <TextField
            id='menu-content'
            sx={{ minWidth: 380 }}
            label='内容'
            variant='outlined'
            multiline
            rows={4}
          />
          <input
            type='file'
            name='imageFile'
            accept='image/*'
            onChange={onChangeFile}
          />
          <Button variant='contained' onClick={onClickSubmit}>
            追加
          </Button>
        </Box>
      </Modal>
    </Stack>
  );
};

export default AddMenu;
