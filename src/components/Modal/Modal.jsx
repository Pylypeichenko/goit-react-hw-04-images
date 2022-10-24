import { Component } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal_root');

class Modal extends Component {
  render() {
    const { children } = this.props;
    return createPortal(
      <div className={css.Modal__backdrop}>
        <div className={css.Modal__window}>{children}</div>
      </div>,
      modalRoot
    );
  }
}

export default Modal;
