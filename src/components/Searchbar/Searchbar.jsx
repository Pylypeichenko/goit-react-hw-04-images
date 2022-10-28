import { Component } from 'react';
import css from './Searchbar-styles.module.css';

class Searchbar extends Component {
  state = {
    inputValue: '',
  };

  handleInputChange = event => {
    this.setState({
      inputValue: event.currentTarget.value,
    });
  };

  handleFormSubmit = event => {
    event.preventDefault();

    this.props.onFormSubmit(this.state.inputValue.toLowerCase().trim());
  };

  render() {
    return (
      <header className={css.Searchbar}>
        <form className={css.SearchForm} onSubmit={this.handleFormSubmit}>
          <button type="submit" className={css.SearchForm__button}>
            <span className={css.SearchForm__button_label}>Search</span>
          </button>

          <input
            className={css.SearchForm__input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={this.state.inputValue}
            onChange={this.handleInputChange}
          />
        </form>
      </header>
    );
  }
}

export default Searchbar;
