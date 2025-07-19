import CloseButton from './CloseButton';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

function Modal({ open, onClose, title, children }: ModalProps) {
  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 flex justify-center items-center transition-colors ${
        open ? 'bg-black/20' : 'invisible'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-black rounded-xl shadow p-6 transition-all ${
          open ? 'scale-100 opacity-100' : 'scale-125 opacity-0'
        }`}
      >
        <div>{title}</div>
        <CloseButton onClick={onClose} />
        {children}
      </div>
    </div>
  );
}

export default Modal;
