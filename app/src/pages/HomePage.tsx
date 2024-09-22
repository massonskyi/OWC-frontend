import React, { StrictMode } from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import TSPR from "../components/BackgroundParticles";
import '../styles/ParticleBackground.css';
import Futures from '../components/FuturesContainer'; // Import the Futures component

// TODO: Move styles to CSS
const ButtonContainer = styled.div`
  z-index: 2;
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;

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
  ];

  return (
    <>
      <StrictMode>
        <TSPR />
      </StrictMode>
      <div className="nav-text-main-screen">
        <h1 className="glitch-h1-home-screen" data-text="Online Text Editor"> Online Text Editor </h1>
        <ButtonContainer>
          {links.map((item) => (
            <Link key={item.id} to={item.link} style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                color="secondary"
                style={{
                  minWidth: "400px",
                  maxWidth: "1000px",
                }}
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </ButtonContainer>
      </div>
    </>
  );
};
