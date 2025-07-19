type CloseButtonProps = {
  onClick: () => void;
};

const CloseButton = ({ onClick }: CloseButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:text-gray-600 `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18 18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
};

export default CloseButton;
