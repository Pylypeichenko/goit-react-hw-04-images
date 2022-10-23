import css from './Button.-styles.module.css';

const Button = ({ handleClick }) => {
  return (
    <button className={css.Button} type="button" onClick={handleClick}>
      Load some more
    </button>
  );
};

export default Button;
