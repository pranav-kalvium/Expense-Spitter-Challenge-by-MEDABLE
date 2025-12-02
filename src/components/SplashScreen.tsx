import { useEffect, useState } from 'react';
import medableLogo from '../assets/medable-logo.png';

interface SplashScreenProps {
    onFinish: () => void;
}

function SplashScreen({ onFinish }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onFinish, 500); // Wait for fade out animation
        },400); // Show for 0.4 seconds (slightly more than 1s for better feel)

        return () => clearTimeout(timer);
    }, [onFinish]);

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            <div className="animate-fade-in-up">
                <img
                    src={medableLogo}
                    alt="Medable Logo"
                    className="h-24 md:h-32 object-contain mb-8 drop-shadow-2xl"
                />
                <div className="flex justify-center">
                    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
}

export default SplashScreen;
