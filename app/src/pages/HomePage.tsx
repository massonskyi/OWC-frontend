import React, { StrictMode, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import TSPR from "../components/BackgroundParticles";
import '../styles/ParticleBackground.css';
import '../styles/HomePage.css';
import image1 from "../images/1.png";
import image2 from "../images/2.png";
import image3 from "../images/3.png";
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
      link: "/test-editor",
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
  const handleOpenTextEditor = () => {
    window.location.href = "/test-editor";
  }
  const handleOpenSignIn = () => {
    window.location.href = "/auth?mode=sign-in";
  }
  const handleOpenSignUp = () => {
    window.location.href = "/auth?mode=sign-up";
  }
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
        </div>
        <div className="rotated-block">
          <p>Редактируйте. Творите. </p>
          <p> Быстро, бесплатно и быстро</p>
          <img src={image1} alt="Example" />
          <Button variant="contained" color="primary" onClick={handleOpenTextEditor}>Text Editor</Button>
        </div>
        <div style={{ height: "200px" }}></div>
        <div className="rotated-block-right">
          <p>Но можно и больше. Сохранять. Делиться. Хранить.</p>
          <p>Безопастно и комфортно.</p>
          <img src={image2} alt="Пример изображения" />
          <Button variant="contained" color="primary" onClick={handleOpenSignIn}>Войти и начать!</Button>
        </div>
        <div style={{ height: "200px" }}></div>

        <div className="rotated-block">
          <p>Храните все свои проекты в одном месте</p>
          <img src={image3} alt="Пример изображения" />
          <Button variant="contained" color="primary" onClick={handleOpenSignUp}>Присоединяйтесь к нам уже сейчас!</Button>
        </div>
      </>
  );
};