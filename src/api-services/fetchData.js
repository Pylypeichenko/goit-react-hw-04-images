import axios from 'axios';

const fetchData = ({ searchQuery, perPage, page }) => {
  const URL_KEY = '29852735-acc344f41552f923d8dc8cb55';
  const URL = 'https://pixabay.com/api/';
  const searchQueryUrl = `${URL}?key=${URL_KEY}&q=${searchQuery}&image_type=photo&per_page=${perPage}&page=${page}`;

  return axios
    .get(searchQueryUrl)
    .then(response => response.data.hits)
    .then(images => this.setState({ images }));
};

export default fetchData;
