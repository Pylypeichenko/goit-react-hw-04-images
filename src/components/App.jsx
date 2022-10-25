import { Component } from 'react';
import axios from 'axios';

import css from './App-styles.module.css';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Spinner from './Spinner/Spinner';
import Modal from './Modal/Modal';

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
    this.pageReset();
    this.setState({ status: 'pending' });

    return this.fetchData()
      .then(images => this.setState({ images, status: 'resolved' }))
      .then(this.pageIncrement())
      .catch(error => this.setState({ error, status: 'rejected' }));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      this.pageReset();
      this.setState({ status: 'pending' });

      return this.fetchData()
        .then(images => {
          return this.setState({ images, status: 'resolved' });
        })
        .then(this.pageIncrement())
        .catch(error => this.setState({ error, status: 'rejected' }));
    }
  }

  onLoadMore = () => {
    this.setState({ status: 'pending' });

    return this.fetchData()
      .then(nextImages =>
        this.setState(({ images }) => ({
          images: [...images, ...nextImages],
          status: 'resolved',
        }))
      )
      .then(this.pageIncrement())
      .catch(error => this.setState({ error, status: 'rejected' }));
  };

  fetchData = async () => {
    const URL_KEY = '29852735-acc344f41552f923d8dc8cb55';
    const URL = 'https://pixabay.com/api/';
    const searchQueryUrl = `${URL}?key=${URL_KEY}&q=${this.state.searchQuery}&image_type=photo&per_page=${this.state.perPage}&page=${this.state.page}`;

    return axios.get(searchQueryUrl).then(response => {
      if (response.status === 200) {
        return response.data.hits;
      }
      return Promise.reject(
        new Error('Oops! Something went wrong. Please reload the page :(')
      );
    });
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

    this.setState({ searchQuery: data });
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
