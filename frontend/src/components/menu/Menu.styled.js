import styled from 'styled-components';

export const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.primaryDark};
  height: 10vh;
  text-align: left;
  padding: 1rem;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;
  transform: ${({ open }) => open ? 'translateX(0)' : 'translateX(-100%)'};
  @media (max-width: ${({ theme }) => theme.mobile}) {
    width: 100%;
  }

  hr {
    border-top: 1px solid red;
  }

  h3 {
    font-size: 1.5rem;
    padding: 0.1rem 0;
    font-weight: bold;
    letter-spacing: 0.1rem;
    color: ${({ theme }) => theme.secondaryDark};
    text-decoration: none;
    transition: color 0.3s linear;
    
    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 0.5rem;
      text-align: center;
    }
  }

  a {
    font-size: 1.1rem;
    padding: 0.5rem 0;
    font-weight: bold;
    word-wrap:break-word;
    letter-spacing: 0.1rem;
    color: ${({ theme }) => theme.secondaryDark};
    text-decoration: none;
    transition: color 0.3s linear;
    
    @media (max-width: ${({ theme }) => theme.mobile}) {
      font-size: 0.5rem;
      text-align: center;
    }

    &:hover {
      color: ${({ theme }) => theme.primaryHover};
    }
  }
`;