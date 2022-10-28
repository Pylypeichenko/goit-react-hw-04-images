import { Component } from 'react';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import css from './App-styles.module.css';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Spinner from './Spinner/Spinner';
import Modal from './Modal/Modal';
import fetchData from '../api-services/fetchData';

export class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    page: 1,
    perPage: 12,
    showModal: false,
    selectedImage: '',
    status: 'idle',
    error: null,
    totalQueryHits: 0,
  };

  componentDidMount() {
    console.log('componentDidMount');
    this.createGallery();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      console.log('componentDidUpdate');
      this.createGallery();
    }
  }

  createGallery = () => {
    this.setState({ status: 'pending' });
    const { searchQuery, perPage, page } = this.state;

    return fetchData(searchQuery, perPage, page)
      .then(data => {
        if (data.totalHits === 0) {
          Notify.warning(`We couldn't find anything. 
            Try another word for search`);
        }
        if (data.totalHits !== 0) {
          Notify.success(`We found ${data.totalHits} images on your request`);
        }

        this.setState({ totalQueryHits: data.totalHits });

        const imagesArray = data.hits.map(obj => {
          const newObj = {
            id: obj.id,
            webformatURL: obj.webformatURL,
            tags: obj.tags,
            largeImageURL: obj.largeImageURL,
          };

          return newObj;
        });

        return this.setState(({ images }) => ({
          images: [...images, ...imagesArray],
          status: 'resolved',
        }));
      })
      .catch(error => {
        Notify.error('Something went wrong. Please try again.');
        this.setState({ error, status: 'rejected' });
      })
      .finally(this.pageIncrement());
  };

  pageReset = () => {
    this.setState({ page: 1 });
  };

  pageIncrement = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  getSearchQuery = data => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    this.setState({ searchQuery: data, images: [] });
    this.pageReset();
  };

  modalOpen = () => {
    if (!this.state.showModal) {
      this.setState({ showModal: true });
    }
  };

  modalClose = () => {
    if (this.state.showModal) {
      this.setState({ showModal: false });
    }
  };

  getImageData = data => {
    this.setState({ selectedImage: data });
    this.modalOpen();
  };

  render() {
    const { images, status, showModal, selectedImage, error, totalQueryHits } =
      this.state;

    return (
      <div className={css.App}>
        {showModal && (
          <Modal onModalClose={this.modalClose}>
            <img src={selectedImage.largeImageURL} alt={selectedImage.tags} />
          </Modal>
        )}

        <Searchbar onFormSubmit={this.getSearchQuery} />

        {status === 'rejected' && <p>{error.message}</p>}

        <ImageGallery images={images} getImageObj={this.getImageData} />

        {status === 'pending' && <Spinner />}

        {images.length < totalQueryHits && (
          <Button handleClick={this.createGallery} />
        )}
      </div>
    );
  }
}
