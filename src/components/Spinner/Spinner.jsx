import { MutatingDots } from 'react-loader-spinner';

import css from './Spinner.module.css';

const Spinner = () => {
  return (
    <div className={css.Spinner}>
      <MutatingDots />
    </div>
  );
};

export default Spinner;
