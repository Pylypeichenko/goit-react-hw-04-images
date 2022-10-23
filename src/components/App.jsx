import { Component } from 'react';
import axios from 'axios';

import css from './App-styles.module.css';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';

export class App extends Component {
  state = {
    searchQuery: '',
    images: [],
    page: 1,
    perPage: 12,
  };

  componentDidMount() {
    const URL_KEY = '29852735-acc344f41552f923d8dc8cb55';
    const URL = 'https://pixabay.com/api/';
    const searchQueryUrl = `${URL}?key=${URL_KEY}&q=${this.state.searchQuery}&image_type=photo&per_page=${this.state.perPage}&page=${this.state.page}`;

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
      return axios
        .get(searchQueryUrl)
        .then(response => response.data.hits)
        .then(images => this.setState({ images }))
        .then(this.pageIncrement());
    }
  }

  onLoadMore = () => {
    const URL_KEY = '29852735-acc344f41552f923d8dc8cb55';
    const URL = 'https://pixabay.com/api/';
    const searchQueryUrl = `${URL}?key=${URL_KEY}&q=${this.state.searchQuery}&image_type=photo&per_page=${this.state.perPage}&page=${this.state.page}`;

    return axios
      .get(searchQueryUrl)
      .then(response => response.data.hits)
      .then(nextImages =>
        this.setState(({ images }) => ({
          images: [...images, ...nextImages],
        }))
      )
      .then(this.pageIncrement())
      .then(window.scrollBy(0, window.innerHeight));
  };

  pageReset = () => {
    this.setState({ page: 1 });
  };

  pageIncrement = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  getSearchQuery = data => {
    window.scrollBy({
      top: -260,
      behavior: 'smooth',
    });

    this.setState({ searchQuery: data });
    this.pageReset();
  };

  render() {
    const { images, perPage } = this.state;

    return (
      <div className={css.App}>
        <Searchbar onFormSubmit={this.getSearchQuery} />
        <ImageGallery images={images} />
        {images.length >= perPage && <Button handleClick={this.onLoadMore} />}
      </div>
    );
  }
}
