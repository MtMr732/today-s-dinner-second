import * as React from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const style = {
  p: 2,
  margin: "auto",
  height: 250,
  width: 380,
  flexGrow: 1,
  boxShadow: 3,
  borderRadius: "32px",
};

const Menu = (props) => {
  const { menu } = props;

  return (
    <Grid item container direction='column' alignItems='center' sx={style}>
      <Avatar
        alt=''
        src={menu.data().imageURL}
        // ↓この書き方はオブジェクト形式（キーとバリュー）で書くときに使用する
        sx={{ width: 125, height: 125, borderRadius: 5 }}
      />
      <Typography gutterBottom variant='subtitle1' component='div'>
        {menu.data().name}
      </Typography>
      <Typography variant='body2' gutterBottom className='text'>
        {menu.data().description}
      </Typography>
    </Grid>
  );
};
export default Menu;
