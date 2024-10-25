import React from 'react';
import PropTypes from 'prop-types';
import ImageItem from '../../../components/ImageItem';
import { Grid, makeStyles } from '@material-ui/core';
import NullData from '../../../components/NullData';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';

Result.propTypes = {
  listImages: PropTypes.array.isRequired,
  actionDetailsImgRef: PropTypes.func
};

function Result({ listImages, actionDetailsImg }) {
  const classes = useStyles();
  const [isOpenImage, setIsOpenImage] = React.useState(false);
  const [photoIndex, setPhotoIndex] = React.useState(0);

  const actionDetailsImgRef = index => {
    setPhotoIndex(index);
    setIsOpenImage(true);
  };
  return (
    listImages && (
      <div>
        {listImages.length === 0 ? (
          <NullData />
        ) : (
          <Grid container spacing={3}>
            {listImages?.map((image, i) => (
              <Grid item key={image.id} lg={3} md={6} xs={12}>
                <ImageItem
                  actionDetailsImgRef={() => actionDetailsImgRef(i)}
                  className={classes.productCard}
                  image={image}
                />
              </Grid>
            ))}
          </Grid>
        )}
        {isOpenImage && (
          <Lightbox
            images={listImages}
            startIndex={photoIndex}
            onClose={() => setIsOpenImage(false)}
          ></Lightbox>
        )}
      </div>
    )
  );
}
const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    minHeight: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  },
  productCard: {
    height: '100%',
    borderRadius: '8px',
    boxShadow: '0 7px 7px 0px rgb(0 0 0 / 7%)'
  }
}));
export default Result;
