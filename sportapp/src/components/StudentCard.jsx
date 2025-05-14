import React from 'react';
import { motion } from 'framer-motion';
import { User, UserRound, Pencil, Trash2 } from 'lucide-react';
import { triggerHapticFeedback } from '../utils/haptics';

// Animation variants
const cardVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.2 } },
  hover: { scale: 1.03, transition: { duration: 0.2 } }
};

/**
 * StudentCard component displays information about a student
 * @param {Object} props
 * @param {Object} props.student - Student data object
 * @param {Function} props.onEdit - Edit handler function
 * @param {Function} props.onDelete - Delete handler function
 * @param {Boolean} props.selected - Whether the student is selected
 * @param {Function} props.onSelect - Selection handler function
 * @param {Boolean} props.selectable - Whether the card is selectable
 * @param {String} props.size - Card size (small, medium, large)
 */
const StudentCard = ({
  student,
  onEdit,
  onDelete,
  selected = false,
  onSelect,
  selectable = false,
  size = 'medium'
}) => {
  if (!student) return null;
  
  // Determine gender-specific styles
  const genderColor = student.GESCHLECHT === 'M' 
    ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800'
    : 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800';
  
  const genderIcon = student.GESCHLECHT === 'M' ? <User size={16} /> : <UserRound size={16} />;
  
  // Determine size classes
  const sizeClasses = {
    small: 'p-3 text-sm',
    medium: 'p-4',
    large: 'p-5 text-lg'
  };
  
  // Handle click on card for selection
  const handleClick = () => {
    if (selectable && onSelect) {
      triggerHapticFeedback('selection');
      onSelect(student);
    }
  };
  
  // Handle edit button click
  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card selection
    triggerHapticFeedback('light');
    if (onEdit) onEdit(student);
  };
  
  // Handle delete button click
  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card selection
    triggerHapticFeedback('warning');
    if (onDelete) onDelete(student);
  };
  
  return (
    <motion.div
      className={`
        relative rounded-lg border ${sizeClasses[size] || sizeClasses.medium}
        ${selected ? `ring-2 ring-indigo-500 border-indigo-500 dark:ring-indigo-400 dark:border-indigo-400` : 
          'border-gray-200 dark:border-gray-700'}
        ${selectable ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50' : ''}
        bg-white dark:bg-gray-800 shadow-sm
      `}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover={selectable ? "hover" : undefined}
      onClick={handleClick}
    >
      {/* Student info */}
      <div className="flex items-center space-x-3">
        {/* Avatar/Initial */}
        <div className={`
          w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold
          ${genderColor}
        `}>
          {student.VORNAME ? student.VORNAME.charAt(0) : '?'}
        </div>
        
        {/* Student details */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900 dark:text-white truncate">
            {student.NACHNAME}, {student.VORNAME}
          </div>
          
          <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
            {/* Gender indicator */}
            <span className="inline-flex items-center">
              {genderIcon}
              <span className="ml-1">{student.GESCHLECHT === 'M' ? 'Männlich' : 'Weiblich'}</span>
            </span>
            
            {/* Class if available */}
            {student.KLASSE && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span>Klasse {student.KLASSE}</span>
              </>
            )}
            
            {/* Team if available */}
            {(student.TEAM || student.TEAMID) && (
              <>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <span className="inline-flex items-center">
                  <span 
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: student.TEAM?.FARBE || '#6366F1' }}
                  />
                  {student.TEAM?.NAME || `Team ${student.TEAMID}`}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        {(onEdit || onDelete) && (
          <div className="flex space-x-1">
            {onEdit && (
              <button
                type="button"
                onClick={handleEditClick}
                className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                aria-label="Edit student"
              >
                <Pencil size={18} />
              </button>
            )}
            
            {onDelete && (
              <button
                type="button"
                onClick={handleDeleteClick}
                className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                aria-label="Delete student"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Selection indicator */}
      {selected && (
        <div className="absolute right-3 top-3 w-4 h-4 rounded-full bg-indigo-500 dark:bg-indigo-400"></div>
      )}
    </motion.div>
  );
};

export default StudentCard;
