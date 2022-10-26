import { Component } from 'react';

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
  };

  componentDidMount() {
    this.createGallery();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.createGallery();
    }
  }
  createGallery = () => {
    this.setState({ status: 'pending' });
    const { searchQuery, perPage, page } = this.state;

    return fetchData(searchQuery, perPage, page)
      .then(images => this.setState({ images, status: 'resolved' }))
      .catch(error => this.setState({ error, status: 'rejected' }))
      .finally(this.pageIncrement());
  };

  onLoadMore = () => {
    this.setState({ status: 'pending' });
    const { searchQuery, perPage, page } = this.state;

    return fetchData(searchQuery, perPage, page)
      .then(nextImages =>
        this.setState(({ images }) => ({
          images: [...images, ...nextImages],
          status: 'resolved',
        }))
      )
      .catch(error => this.setState({ error, status: 'rejected' }))
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
    const { images, perPage, status, showModal, selectedImage, error } =
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

        {images.length >= perPage && images.length % perPage === 0 && (
          <Button handleClick={this.onLoadMore} />
        )}
      </div>
    );
  }
}
