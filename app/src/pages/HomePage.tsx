import React, { StrictMode, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import TSPR from "../components/BackgroundParticles";
import '../styles/ParticleBackground.css';
import '../styles/HomePage.css';
import Futures from '../components/FuturesContainer'; // Import the Futures component

interface INavigationLink {
  id: number;
  name: string;
  link: string;
}

export const HomePage: React.FC = () => {
  const links: INavigationLink[] = [
    {
      id: 1,
      name: "Text Editor",
      link: "/editor",
    },
    {
      id: 2,
      name: "Вход",
      link: "/auth?mode=sign-in",
    },
    {
      id: 3,
      name: "Регистрация",
      link: "/auth?mode=sign-up",
    },
  ];

  const sectionRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      sectionRefs.current.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
          section.classList.add("visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
      <>
        <StrictMode>
          <TSPR />
        </StrictMode>
        <div className="nav-text-main-screen">
          <h1 className="glitch-h1-home-screen" data-text="Online Text Editor"> Online Text Editor </h1>
          <p className="description">
            Добро пожаловать в наш Онлайн Редактор кода! Здесь вы можете писать, редактировать и делиться своим кодом в реальном времени.
          </p>
          <div className="button-container">
            {links.map((item) => (
                <Link key={item.id} to={item.link} style={{ textDecoration: "none" }}>
                  <Button
                      variant="contained"
                      color="secondary"
                      className="interactive-button"
                  >
                    {item.name}
                  </Button>
                </Link>
            ))}
          </div>
        </div>
      </>
  );
};