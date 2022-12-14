import { Notify } from 'notiflix/build/notiflix-notify-aio';

import css from './App-styles.module.css';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Spinner from './Spinner/Spinner';
import Modal from './Modal/Modal';
import fetchData from '../api-services/fetchData';
import { useState } from 'react';
import { useEffect } from 'react';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [totalQueryHits, setTotalQueryHits] = useState(0);

  useEffect(() => {
    const createGallery = async () => {
      setStatus('pending');

      try {
        const data = await fetchData(searchQuery, page);
        if (data.totalHits === 0) {
          Notify.warning(`We couldn't find anything. 
            Try another word for search`);
          setStatus('resolved');
          return;
        }
        if (data.totalHits !== 0 && page === 1) {
          Notify.success(`We found ${data.totalHits - images.length} images`);
        }
        if (data.totalHits === images.length) {
          Notify.info('These images are final for your request');
        }

        setTotalQueryHits(data.totalHits);

        const imagesArray = data.hits.map(obj => {
          const newObj = {
            id: obj.id,
            webformatURL: obj.webformatURL,
            tags: obj.tags,
            largeImageURL: obj.largeImageURL,
          };

          return newObj;
        });

        setStatus('resolved');
        return setImages(images => [...images, ...imagesArray]);
      } catch (error) {
        Notify.error('Something went wrong. Please try again.');
        setError(error);
        setStatus('rejected');
      }
    };

    createGallery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, page]);

  const pageIncrement = () => {
    setPage(state => state + 1);
  };

  const getSearchQuery = data => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    setImages([]);
    setSearchQuery(data);
    setPage(1);
  };

  const modalOpen = () => {
    if (!showModal) {
      setShowModal(true);
    }
  };

  const modalClose = () => {
    if (showModal) {
      setShowModal(false);
    }
  };

  const getImageData = data => {
    setSelectedImage(data);
    modalOpen();
  };

  return (
    <div className={css.App}>
      <Searchbar onFormSubmit={getSearchQuery} />

      {status === 'rejected' && <p>{error.message}</p>}

      <ImageGallery images={images} getImageObj={getImageData} />

      {status === 'pending' && <Spinner />}

      {images.length < totalQueryHits && <Button handleClick={pageIncrement} />}

      {showModal && (
        <Modal onModalClose={modalClose}>
          <img src={selectedImage.largeImageURL} alt={selectedImage.tags} />
        </Modal>
      )}
    </div>
  );
};
