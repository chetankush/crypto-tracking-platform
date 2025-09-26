import React from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from 'react-icons/fa'

const Footer = () => {
    const { isDark } = useTheme();

    return (
        <footer className="bg-white dark:bg-dark-bg border-t border-gray-200 dark:border-dark-border transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">C</span>
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-400 dark:to-primary-600 bg-clip-text text-transparent">
                                Ctrack
                            </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                            Your ultimate cryptocurrency tracking platform. Monitor real-time prices, track your portfolio, and stay ahead of the market.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="p-2 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                aria-label="Twitter"
                            >
                                <FaTwitter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </a>
                            <a
                                href="#"
                                className="p-2 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                aria-label="GitHub"
                            >
                                <FaGithub className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </a>
                            <a
                                href="#"
                                className="p-2 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedin className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </a>
                            <a
                                href="#"
                                className="p-2 bg-gray-100 dark:bg-dark-card hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                                aria-label="Email"
                            >
                                <FaEnvelope className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Markets
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Portfolio
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Watchlist
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    News
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Company
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-dark-border flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 md:mb-0">
                        © {new Date().getFullYear()} Ctrack. All rights reserved.
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Built with ❤️ for crypto enthusiasts
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer