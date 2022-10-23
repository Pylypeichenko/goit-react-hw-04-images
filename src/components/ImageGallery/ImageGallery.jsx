import css from './ImageGallery-styles.module.css';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';

const ImageGallery = ({ images }) => {
  return (
    <ul className={css.ImageGallery}>
      {images.map(image => {
        return (
          <li className={css.ImageGalleryItem} key={image.id}>
            <ImageGalleryItem className={css.ImageGalleryItem} image={image} />
          </li>
        );
      })}
    </ul>
  );
};

export default ImageGallery;
