import css from './ImageGallery-styles.module.css';
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem';

const ImageGallery = ({ images, getImageObj }) => {
  return (
    <>
      <h1 className="visually-hidden">Gallery</h1>
      <ul className={css.ImageGallery}>
        {images.map(image => {
          return (
            <li
              className={css.ImageGalleryItem}
              key={image.id}
              onClick={() => getImageObj(image)}
            >
              <ImageGalleryItem
                className={css.ImageGalleryItem}
                image={image}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ImageGallery;
