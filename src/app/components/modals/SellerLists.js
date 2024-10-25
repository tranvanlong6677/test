import React from 'react';
import { useSelector } from 'react-redux'
import Dialog from '@material-ui/core/Dialog';
import { Box  } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import DialogContent from '@material-ui/core/DialogContent';
import { Slide } from '@material-ui/core';
import 'date-fns';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import { 
  Table,
  TableBody, 
  TableCell,
  TableHead,
  TableRow
} from '@material-ui/core';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="right" ref={ref} {...props} />;
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});


const  SellerLists = ({ open, handleClose, setSellerSelected }) => {
  const listSellers = useSelector(state => state.userSlice.listSellers);

  const handleCloseBox = () => {
    handleClose();
  };

  const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
      </MuiDialogTitle>
    );
  });
 
  const handleRowClick = (row) => {
    setSellerSelected(row)
    handleClose() 
  }

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseBox}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseBox}>
          Chọn người bán (<i>Click vào một hàng để chọn</i>)
        </DialogTitle>        
        <DialogContent>
          <Box mb={5}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tài khoản</TableCell>
                  <TableCell>Tên</TableCell>
                  <TableCell>Số điện thoại</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listSellers?.map((seller, index) => (
                  <TableRow hover key={seller?.id}  onClick={() => handleRowClick(seller)}>
                    {/* <TableCell>{seller.id}</TableCell> */}
                      <TableCell>{ ++index }</TableCell>
                      <TableCell>{ seller?.username }</TableCell>
                      <TableCell>{ seller?.full_name }</TableCell>
                      <TableCell>{ seller?.phone }</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default React.memo(SellerLists);