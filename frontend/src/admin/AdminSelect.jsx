import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

export default function AdminSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner…',
  size = 'md',
  className = '',
  disabled = false,
  id,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, openUp: false });

  // Normaliser les options : chaîne ou objet { value, label, color, bg }
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'object' && opt !== null) {
      return {
        value: opt.value,
        label: opt.label ?? opt.value,
        color: opt.color,
        bg: opt.bg,
      };
    }
    return { value: opt, label: opt };
  });

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Mettre à jour la position flottante absolue par rapport au viewport
  const updateCoords = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const openUp = spaceBelow < 220 && rect.top > 220;

    setCoords({
      top: openUp ? rect.top - 6 : rect.bottom + 6,
      left: rect.left,
      width: Math.max(rect.width, 160),
      openUp,
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    updateCoords();

    function handleClickOutside(e) {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      updateCoords();
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen]);

  const handleSelect = (val) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      onChange({ target: { value: val } });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`admin-select-container ${size} ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''} ${className}`}
      id={id ? `${id}-container` : undefined}
    >
      <button
        type="button"
        id={id}
        className="admin-select-trigger"
        onClick={() => {
          if (!disabled) {
            updateCoords();
            setIsOpen(!isOpen);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className="admin-select-label">
          {selectedOption ? (
            <span className="admin-select-selected-item">
              {selectedOption.color && (
                <span
                  className="admin-select-dot"
                  style={{
                    backgroundColor: selectedOption.color,
                    boxShadow: `0 0 6px ${selectedOption.color}55`,
                  }}
                />
              )}
              <span style={{ color: selectedOption.color || 'inherit' }}>
                {selectedOption.label}
              </span>
            </span>
          ) : (
            <span className="admin-select-placeholder">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          size={15}
          strokeWidth={1.8}
          className={`admin-select-chevron ${isOpen ? 'rotated' : ''}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="admin-select-dropdown"
            role="listbox"
            style={{
              position: 'fixed',
              top: coords.openUp ? 'auto' : `${coords.top}px`,
              bottom: coords.openUp ? `${window.innerHeight - coords.top}px` : 'auto',
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 999999,
            }}
          >
            <div className="admin-select-dropdown-inner">
              {normalizedOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={String(opt.value)}
                    role="option"
                    aria-selected={isSelected}
                    className={`admin-select-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(opt.value)}
                  >
                    <div className="admin-select-option-content">
                      {opt.color && (
                        <span
                          className="admin-select-dot"
                          style={{
                            backgroundColor: opt.color,
                            boxShadow: `0 0 6px ${opt.color}66`,
                          }}
                        />
                      )}
                      <span
                        className="admin-select-option-text"
                        style={
                          opt.color
                            ? { color: opt.color, fontWeight: isSelected ? 600 : 500 }
                            : undefined
                        }
                      >
                        {opt.label}
                      </span>
                    </div>
                    {isSelected && (
                      <Check size={14} strokeWidth={2.2} className="admin-select-check" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
