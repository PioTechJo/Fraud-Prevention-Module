import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Alert } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alert: Alert | null;
}

const AlertDetailsModal: React.FC<Props> = ({ isOpen, onClose, alert }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen) {
      setPos({ x: 0, y: 0 });
    }
  }, [isOpen]);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStartPos.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      setPos({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y,
      });
    };
    const onMouseUp = () => setDragging(false);

    if (dragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[100] pointer-events-none overflow-hidden">
      <div 
        className="bg-white rounded-lg w-full max-w-xl border border-gray-200 pointer-events-auto"
        style={{ 
          transform: `translate(${pos.x}px, ${pos.y}px)`,
          boxShadow: '0px 15px 15px -2px rgba(0, 0, 0, 0.50)'
        }}
      >
        <div 
          onMouseDown={onMouseDown}
          className="bg-[#001D4A] p-3 flex justify-between items-center cursor-move select-none rounded-t-lg"
        >
          <h3 className="text-white font-bold text-[12px] uppercase tracking-wider">Alert Details</h3>
          <button onClick={onClose} className="text-white hover:text-gray-300 transition-colors cursor-pointer outline-none">
            <X size={16} />
          </button>
        </div>

        <div className="p-12 min-h-[300px] flex items-center justify-center text-gray-300 italic text-[11px] select-none">
          {/* Empty as requested */}
          No details available for this historical record.
        </div>
      </div>
    </div>
  );
};

export default AlertDetailsModal;