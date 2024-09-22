// src/components/TypedText.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../styles/TypedText.css';

const TypedText: React.FC = () => {
    const textArray = useMemo(() => ["hard", "fun", "a journey", "LIFE"], []);
    const typingDelay = 200;
    const erasingDelay = 100;
    const newTextDelay = 2000; // Delay between current and next text
  
    const [textArrayIndex, setTextArrayIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [typedText, setTypedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
  
    const typeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const eraseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
    useEffect(() => {
      const type = () => {
        if (charIndex < textArray[textArrayIndex].length) {
          setTypedText(prevText => prevText + textArray[textArrayIndex].charAt(charIndex));
          setCharIndex(charIndex + 1);
          typeTimeoutRef.current = setTimeout(type, typingDelay);
        } else {
          setIsTyping(false);
          eraseTimeoutRef.current = setTimeout(erase, newTextDelay);
        }
      };
  
      const erase = () => {
        if (charIndex > 0) {
          setTypedText(textArray[textArrayIndex].substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
          eraseTimeoutRef.current = setTimeout(erase, erasingDelay);
        } else {
          setIsTyping(false);
          setTextArrayIndex((textArrayIndex + 1) % textArray.length);
          typeTimeoutRef.current = setTimeout(type, typingDelay + 1100);
        }
      };
  
      type();
  
      return () => {
        if (typeTimeoutRef.current) clearTimeout(typeTimeoutRef.current);
        if (eraseTimeoutRef.current) clearTimeout(eraseTimeoutRef.current);
      };
    }, [charIndex, textArrayIndex, textArray]);

  return (
    <div className="container-typed-text">
      <p>
        Coding is <span className="typed-text">{typedText}</span>
        <span className={`cursor ${isTyping ? 'typing' : ''}`}>&nbsp;</span>
      </p>
    </div>
  );
};

export default TypedText;
