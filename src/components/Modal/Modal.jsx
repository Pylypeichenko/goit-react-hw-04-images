import { Component } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

const modalRoot = document.querySelector('#modal_root');

class Modal extends Component {
  componentDidMount() {
    window.addEventListener('keydown', this.handleEscapeKeydown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEscapeKeydown);
  }

  handleEscapeKeydown = e => {
    if (e.code === 'Escape') {
      this.props.onModalClose();
    }
  };

  handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      this.props.onModalClose();
    }
  };

  render() {
    const { children } = this.props;
    return createPortal(
      <div className={css.Modal__backdrop} onClick={this.handleBackdropClick}>
        <div className={css.Modal__window}>{children}</div>
      </div>,
      modalRoot
    );
  }
}

export default Modal;
