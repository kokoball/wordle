import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import logo from '@/assets/logo.png';
import styled from 'styled-components';
import CardWithForm from '@/components/CardWithInput';
import { clearWordleStorage, encrypt } from '@/lib/utils';

const Wrapper = styled.div`
  position: relative;
  color: #000;
  max-width: 100%;
  width: 100%;
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #e3e3e1;

  .welcome-module {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px 42px 0;
    flex-direction: column;
    gap: 40px;

    & > div > button + button {
      margin-left: 20px;
    }
  }
`;

const IntroMenu = () => {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Wrapper>
      <div className="welcome-module">
        <img src={logo} alt="logo" />
        <div>
          <Button
            variant="outline"
            size={'lg'}
            onClick={() => {
              clearWordleStorage();
              navigate(`/wordle/${encrypt('WORLD')}`);
            }}
          >
            시작하기
          </Button>
          <Button
            variant="outline"
            size={'lg'}
            onClick={() => {
              clearWordleStorage();
              setIsCardOpen(true);
            }}
          >
            워들 생성하기
          </Button>
        </div>
        {isCardOpen && (
          <CardWithForm handleCloseCard={() => setIsCardOpen(false)} />
        )}
      </div>
    </Wrapper>
  );
};

export default IntroMenu;
