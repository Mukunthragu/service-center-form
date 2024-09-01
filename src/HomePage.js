import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const SubscribeButton = styled.button`
  padding: 10px 20px;
  font-size: 18px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate('/ServiceCenter');
  };

  return (
    <HomeContainer>
      <SubscribeButton onClick={handleSubscribe}>
        Click here to subscribe for service center
      </SubscribeButton>
    </HomeContainer>
  );
};

export default HomePage;