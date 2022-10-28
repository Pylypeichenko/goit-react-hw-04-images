import { PropTypes } from 'prop-types';

import css from './ImageGalleryItem-styles.module.css';

const ImageGalleryItem = ({ image }) => {
  return (
    <img
      className={css.ImageGalleryItem__image}
      src={image.webformatURL}
      alt={image.tags}
    />
  );
};

ImageGalleryItem.propTypes = {
  image: PropTypes.shape({
    webformatURL: PropTypes.string.isRequired,
    tags: PropTypes.string.isRequired,
  }),
};

export default ImageGalleryItem;
