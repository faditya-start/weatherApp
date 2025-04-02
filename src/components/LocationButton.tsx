interface LocationButtonProps {
  onLocationClick: () => void;
  isLoading?: boolean;
}

export const LocationButton = ({ onLocationClick, isLoading = false }: LocationButtonProps) => {
  return (
    <button
      onClick={onLocationClick}
      disabled={isLoading}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      title="Get weather for my location"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
          clipRule="evenodd"
        />
      </svg>
      {isLoading ? 'Getting location...' : 'My Location'}
    </button>
  );
}; 