import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}> {/* stopPropagation로 이벤트 버블링 방지 */}
        {children}
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}

export default Modal;
