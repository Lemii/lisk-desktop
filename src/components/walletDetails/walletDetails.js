import React from 'react';
import Box from '../toolbox/box';
import LiskAmount from '../liskAmount';
import { tokenMap } from '../../constants/tokens';
import styles from './walletDetails.css';
import Icon from '../toolbox/icon';

const MyAccount = ({
  t, account, settings, className,
}) => {
  const info = account.info || {};
  const token = settings.token;

  const coins = Object.entries(info)
    .map(([key, coin]) => token.list[key] && coin)
    .filter(coin => coin);

  return (
    <Box className={`${styles.box} ${className}`}>
      <Box.Header>
        <h1>{t('Wallet details')}</h1>
      </Box.Header>
      <Box.Content className={`${styles.container} coin-container`}>
        {
        coins.map(coin => (
          <Box.Row key={coin.token} className={`${styles.row} coin-row`}>
            <Icon name={coin.token === tokenMap.LSK.key ? 'lskIcon' : 'btcIcon'} />
            <div className={styles.details}>
              <span>{t('{{token}} Balance', { token: tokenMap[coin.token].label })}</span>
              <span>
                <LiskAmount val={coin.balance} />
                {' '}
                {coin.token}
              </span>
            </div>
          </Box.Row>
        ))
      }
      </Box.Content>
    </Box>
  );
};

export default MyAccount;
