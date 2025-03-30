import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BackgroundOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 60, 100, 0.6);
  z-index: 1;
`;

export const LoginCard = styled.div`
  z-index: 2;
  background: white;
  padding: 40px 30px;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  max-width: 400px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Title = styled.h2`
  text-align: center;
  color: #004080;
`;

export const SelectBox = styled.select`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 16px;
`;

export const LoginButton = styled.button`
  background-color: #0077b6;
  color: white;
  font-weight: bold;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #005f91;
  }
`;

export const ErrorText = styled.p`
  color: red;
  text-align: center;
  margin-top: 10px;
`;
