'use client';

import { useState, useEffect } from 'react';

export function PWAInstall() {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showHelper, setShowHelper] = useState(false);

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
            setIsStandalone(true);
        }

        // Handle Android/Chrome install prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Detect iOS
        const isIOSDevice = /iPhone|iPad|iPod/.test(window.navigator.userAgent) && !(window as any).MSStream;
        setIsIOS(isIOSDevice);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (isIOS) {
            setShowHelper(true);
            return;
        }

        if (!installPrompt) {
            return;
        }

        const result = await installPrompt.prompt();
        if (result.outcome === 'accepted') {
            setInstallPrompt(null);
        }
    };

    if (isStandalone) return null;

    return (
        <>
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={handleInstallClick}
                    className="bg-pink-600 hover:bg-pink-700 text-white p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center group"
                    aria-label="Install App"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap ml-0 group-hover:ml-2 font-medium">
                        Install App
                    </span>
                </button>
            </div>

            {showHelper && isIOS && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 transition-opacity">
                    <div className="bg-white rounded-t-3xl w-full max-w-md p-8 pb-12 animate-in slide-in-from-bottom duration-300">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Install on iPhone</h3>
                            <button
                                onClick={() => setShowHelper(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                    </svg>
                                </div>
                                <p className="text-gray-700">1. Tap the <strong>Share</strong> button at the bottom of Safari.</p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <p className="text-gray-700">2. Scroll down and tap <strong>Add to Home Screen</strong>.</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowHelper(false)}
                            className="w-full mt-8 bg-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-pink-700 active:scale-95 transition-all"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
