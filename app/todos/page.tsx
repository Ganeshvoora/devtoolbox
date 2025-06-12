"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrivateRoute from "@/components/PrivateRoute";


interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.2 }
    }
  };
  
  // Load todos from localStorage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem('todoList');
    if (storedTodos) {
      try {
        // Convert old format to new format if needed
        const parsed = JSON.parse(storedTodos);
        
        if (Array.isArray(parsed)) {
          setTodos(parsed);
        } else {
          // Convert from object format to array format
          const todosArray = Object.entries(parsed).map(([id, text]) => ({
            id,
            text: text as string,
            completed: false
          }));
          setTodos(todosArray);
        }
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    }
  }, []);
  
  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todos));
  }, [todos]);
  
  // Generate a random ID for new todos
  const generateId = (): string => {
    return 'id' + Math.ceil(Math.random() * 100000);
  };
  
  // Add a new todo
  const addTodo = () => {
    if (inputValue.trim() === '') {
      alert('Please enter a todo');
      return;
    }
    
    const newTodo: Todo = {
      id: generateId(),
      text: inputValue.trim(),
      completed: false
    };
    
    setTodos([...todos, newTodo]);
    setInputValue('');
    
    // Focus the input field after adding
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Remove a todo
  const removeTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  // Toggle todo completion status
  const toggleComplete = (id: string) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };
  
  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };
  
  // Clear all completed todos
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };
  
  // Count completed and remaining todos
  const completedCount = todos.filter(todo => todo.completed).length;
  const remainingCount = todos.length - completedCount;
  
  return (
    <PrivateRoute>
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto py-12 px-4">
        <motion.div 
          className="max-w-2xl mx-auto bg-gray-900 p-8 rounded-lg shadow-lg border border-gray-800"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-3xl font-bold mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-red-500">Your</span>
            <span className="text-green-500">Todos</span>
          </motion.h1>
          
          <motion.div 
            className="input-section mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Add a new todo"
              />
              <motion.button
                onClick={addTodo}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Add
              </motion.button>
            </div>
            <p className="text-gray-400 text-sm mt-2">Press Enter to add a new todo</p>
          </motion.div>
          
          <motion.div 
            className="todos-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Your Todo List</h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">
                  {remainingCount} remaining
                </span>
                {completedCount > 0 && (
                  <motion.button
                    onClick={clearCompleted}
                    className="text-sm text-red-400 hover:text-red-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear completed
                  </motion.button>
                )}
              </div>
            </div>
            
            {todos.length === 0 ? (
              <motion.div 
                className="text-center py-8 text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p>No todos yet. Add some tasks!</p>
              </motion.div>
            ) : (
              <motion.ul 
                className="space-y-3"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <AnimatePresence>
                  {todos.map((todo) => (
                    <motion.li 
                      key={todo.id}
                      variants={itemVariants}
                      exit="exit"
                      layout
                    >
                      <div className="flex items-center justify-between bg-gray-800 p-3 rounded-lg border border-gray-700">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`check-${todo.id}`}
                            checked={todo.completed}
                            onChange={() => toggleComplete(todo.id)}
                            className="mr-3 h-5 w-5 rounded accent-green-500"
                          />
                          <label
                            htmlFor={`check-${todo.id}`}
                            className={`${todo.completed ? 'line-through text-gray-500' : 'text-white'} transition-all`}
                          >
                            {todo.text}
                          </label>
                        </div>
                        <motion.button
                          onClick={() => removeTodo(todo.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </motion.button>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
            )}
            
            {todos.length > 0 && (
              <motion.div
                className="mt-6 flex justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div 
                  className="text-xs bg-blue-900 bg-opacity-30 text-blue-300 py-1 px-3 rounded-full"
                  whileHover={{ scale: 1.05 }}
                >
                  {todos.length} total item{todos.length > 1 ? 's' : ''}
                </motion.div>
                
                <motion.div className="flex gap-2">
                  {completedCount > 0 && (
                    <motion.div className="text-xs bg-green-900 bg-opacity-30 text-green-300 py-1 px-3 rounded-full">
                      {completedCount} completed
                    </motion.div>
                  )}
                  
                  {remainingCount > 0 && (
                    <motion.div className="text-xs bg-yellow-900 bg-opacity-30 text-yellow-300 py-1 px-3 rounded-full">
                      {remainingCount} active
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
    </PrivateRoute>
  );
}