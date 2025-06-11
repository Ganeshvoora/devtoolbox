import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 py-8 px-8 md:px-16 text-white">
            <div className="flex flex-col justify-between items-center">
                <div className="flex items-center mb-4 md:mb-0">
                    <span className="text-blue-400 text-xl font-bold mr-2">{"</>"}</span>
                    <span className="font-semibold">DevToolBox</span>
                </div>
                <div className="text-gray-400 text-sm">
                    © {new Date().getFullYear()} DevToolBox. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer
