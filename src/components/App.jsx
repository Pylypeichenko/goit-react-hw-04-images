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
    isLoading: false,
    showModal: false,
    selectedImage: '',
  };

  componentDidMount() {
    const URL_KEY = '29852735-acc344f41552f923d8dc8cb55';
    const URL = 'https://pixabay.com/api/';
    const searchQueryUrl = `${URL}?key=${URL_KEY}&q=${this.state.searchQuery}&image_type=photo&per_page=${this.state.perPage}&page=${this.state.page}`;

    this.pageReset();

    return axios
      .get(searchQueryUrl)
      .then(response => response.data.hits)
      .then(images => this.setState({ images }))
      .then(this.pageIncrement());
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchQuery !== this.state.searchQuery) {
      const URL_KEY = '29852735-acc344f41552f923d8dc8cb55';
      const URL = 'https://pixabay.com/api/';
      const searchQueryUrl = `${URL}?key=${URL_KEY}&q=${this.state.searchQuery}&image_type=photo&per_page=${this.state.perPage}&page=${this.state.page}`;

      this.pageReset();
      this.setState({ isLoading: true });

      return axios
        .get(searchQueryUrl)
        .then(response => response.data.hits)
        .then(images => this.setState({ images }))
        .then(this.pageIncrement())
        .finally(this.setState({ isLoading: false }));
    }
  }

  onLoadMore = () => {
    const URL_KEY = '29852735-acc344f41552f923d8dc8cb55';
    const URL = 'https://pixabay.com/api/';
    const searchQueryUrl = `${URL}?key=${URL_KEY}&q=${this.state.searchQuery}&image_type=photo&per_page=${this.state.perPage}&page=${this.state.page}`;

    this.setState({ isLoading: true });

    return axios
      .get(searchQueryUrl)
      .then(response => response.data.hits)
      .then(nextImages =>
        this.setState(({ images }) => ({
          images: [...images, ...nextImages],
        }))
      )
      .then(this.pageIncrement())
      .finally(this.setState({ isLoading: false }));
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
    const { images, perPage, isLoading, showModal, selectedImage } = this.state;

    return (
      <div className={css.App}>
        {showModal && (
          <Modal>
            <img src={selectedImage.largeImageURL} alt={selectedImage.tags} />
          </Modal>
        )}
        <Searchbar onFormSubmit={this.getSearchQuery} />
        <ImageGallery images={images} getImageObj={this.getImageData} />
        {isLoading && <Spinner />}
        {images.length >= perPage && images.length % perPage === 0 && (
          <Button handleClick={this.onLoadMore} />
        )}
      </div>
    );
  }
}
