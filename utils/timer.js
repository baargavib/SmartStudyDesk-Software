import { useState, useEffect, useRef } from 'react';

const POMODORO_MINUTES = 25;
const POMODORO_SECONDS = POMODORO_MINUTES * 60;

export const useTimer = (onComplete) => {
    const [secondsLeft, setSecondsLeft] = useState(POMODORO_SECONDS);
    const [isActive, setIsActive] = useState(false);
    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive && secondsLeft > 0) {
            timerRef.current = setInterval(() => {
                setSecondsLeft((prev) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0 && isActive) {
            setIsActive(false);
            clearInterval(timerRef.current);
            if (onComplete) onComplete();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, secondsLeft, onComplete]);

    const toggle = () => setIsActive(!isActive);
    const reset = () => {
        setIsActive(false);
        setSecondsLeft(POMODORO_SECONDS);
    };
    const stop = () => {
        setIsActive(false);
        setSecondsLeft(POMODORO_SECONDS);
    };

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    return { formattedTime, isActive, toggle, reset, stop, secondsLeft, POMODORO_SECONDS };
};
