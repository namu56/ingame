import { useEffect, useRef } from 'react';

function useOutsideClick<T extends HTMLElement = HTMLElement>(
  isOpen: boolean,
  onClose: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose, ref]);

  return ref;
}

export default useOutsideClick;
