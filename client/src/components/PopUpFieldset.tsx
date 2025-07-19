import CloseButton from './CloseButton';

type PopUpFieldsetProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

function PopUpFieldset({ open, onClose, children }: PopUpFieldsetProps) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`fixed flex top-0 left-3/4 items-center justify-between 
        transition-colors ${open ? 'bg-black' : 'invisible'}`}
    >
      <div>
        <CloseButton onClick={onClose} />
      </div>
      {children}
    </div>
  );
}

export default PopUpFieldset;
