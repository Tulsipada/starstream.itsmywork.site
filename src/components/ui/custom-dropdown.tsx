import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  className,
  triggerClassName,
  contentClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate position when dropdown opens
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  const selectedOption = options.find(option => option.value === value);

  const dropdownContent = isOpen && (
    <div 
      ref={dropdownRef}
      className={cn(
        "fixed z-[9999] bg-background/95 backdrop-blur-md border border-border/20 rounded-md shadow-lg max-h-60 overflow-y-auto",
        contentClassName
      )}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        minWidth: position.width
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground flex items-center justify-between"
          onClick={() => {
            onValueChange(option.value);
            setIsOpen(false);
          }}
        >
          <span>{option.label}</span>
          {value === option.value && (
            <Check className="h-4 w-4" />
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className={cn("relative", className)}>
      <Button
        ref={triggerRef}
        variant="outline"
        className={cn("w-full justify-between", triggerClassName)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label || placeholder}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
      
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
};

export default CustomDropdown;