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

export default ImageGalleryItem;
