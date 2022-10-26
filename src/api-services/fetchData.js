import axios from 'axios';

const fetchData = async (searchQuery, perPage, page) => {
  const URL_KEY = '29852735-acc344f41552f923d8dc8cb55';
  const URL = 'https://pixabay.com/api/';
  const searchQueryUrl = `${URL}?key=${URL_KEY}&q=${searchQuery}&image_type=photo&per_page=${perPage}&page=${page}`;

  return axios
    .get(searchQueryUrl)
    .then(response => {
      if (response.status === 200) {
        return response.data.hits;
      }
      return Promise.reject(
        new Error('Oops! Something went wrong. Please reload the page :(')
      );
    })
    .then(objArray => {
      return objArray.map(obj => {
        const newObj = {
          id: obj.id,
          webformatURL: obj.webformatURL,
          tags: obj.tags,
          largeImageURL: obj.largeImageURL,
        };

        return newObj;
      });
    });
};

export default fetchData;
