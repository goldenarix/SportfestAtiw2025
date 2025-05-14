import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({ title, value, subtitle, icon, change, onClick }) => {
  return (
    <motion.div
      className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
          {icon}
        </div>
        {change && (
          <div className={`flex items-center text-xs font-medium ${
            change.status === 'increase' ? 'text-emerald-600 dark:text-emerald-400' : 
            change.status === 'decrease' ? 'text-rose-600 dark:text-rose-400' : 
            'text-gray-600 dark:text-gray-400'
          }`}>
            {change.status === 'increase' ? (
              <ArrowUp size={12} className="mr-1" />
            ) : change.status === 'decrease' ? (
              <ArrowDown size={12} className="mr-1" />
            ) : null}
            <span>{change.value}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">{change.label}</span>
          </div>
        )}
      </div>
      
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </h3>
      
      {subtitle ? (
        <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
      )}
      
      {/* Decorative element */}
      <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-indigo-100/80 dark:bg-indigo-900/10 rounded-full opacity-50"></div>
    </motion.div>
  );
};

export default StatCard;