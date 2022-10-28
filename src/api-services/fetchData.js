import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const fetchData = async (searchQuery, perPage, page) => {
  const URL_KEY = '29852735-acc344f41552f923d8dc8cb55';
  const URL = 'https://pixabay.com/api/';
  const searchQueryUrl = `${URL}?key=${URL_KEY}&q=${searchQuery}&image_type=photo&per_page=${perPage}&page=${page}`;

  return axios
    .get(searchQueryUrl)
    .then(response => {
      if (response.status === 200) {
        return response.data;
      }
    })
    .catch(error => {
      console.log(error);

      return Notify.error('Something went wrong. Please try again.');
    });
};

export default fetchData;
