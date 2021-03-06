import React, { useState } from 'react';
import PropTypes from 'prop-types';

function CoinSelector({ coins, onCoinChange }) {
  const [coin, setCoin] = useState('');

  const handleChange = (e) => {
    setCoin(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCoinChange(coin);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select className="select" value={coin} onChange={handleChange}>
        <option disabled value="">
          Select coin
        </option>
        {coins.map((coin) => (
          <option key={coin.id} value={coin.id}>
            {coin.name}
          </option>
        ))}
      </select>
      <button className="button" type="submit" disabled={!Boolean(coin)}>
        Submit
      </button>
    </form>
  );
}

CoinSelector.propTypes = {
  coins: PropTypes.array,
  onCoinChange: PropTypes.func.isRequired,
};

export default CoinSelector;
