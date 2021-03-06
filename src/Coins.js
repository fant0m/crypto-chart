import './App.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import CoinChart from './CoinChart';
import CoinSelector from './CoinSelector';

const API_URL = 'https://api.coingecko.com/api/v3';
const DATE_RANGE_FROM = dayjs().add(-6, 'd').unix();
const DATE_RANGE_TO = dayjs().unix();
const COINS_WHITELIST = [
  'bitcoin',
  'litecoin',
  'ethereum',
  'bitcoin cash',
  'dogecoin',
];

function Coins() {
  const [chartData, setChartData] = useState();
  const [coins, setCoins] = useState([]);

  const handleCoinChange = async (coin) => {
    const result = await axios.get(
      `${API_URL}/coins/${coin}/market_chart/range?vs_currency=eur&from=${DATE_RANGE_FROM}&to=${DATE_RANGE_TO}'`
    );
    if (result?.data) {
      const data = [];
      const dates = [];

      const prices = result.data.prices;
      for (const price of prices) {
        const day = dayjs(price[0]);
        if (!dates.includes(day.format('DD/MM/YYYY'))) {
          dates.push(day.format('DD/MM/YYYY'));
          data.push({
            key: day.format('DD/MM/YYYY'),
            value: price[1].toFixed(2),
          });
        }
      }
      setChartData({
        coin,
        data,
      });
    }
  };

  useEffect(() => {
    const fetchCoins = async () => {
      const result = await axios.get(API_URL + '/coins/list');
      if (result?.data) {
        setCoins(
          result.data.filter((coin) =>
            COINS_WHITELIST.includes(coin.name.toLowerCase())
          )
        );
      }
    };
    fetchCoins();
  }, []);

  return (
    <>
      <h1>
        Find the price chart of your favorite{' '}
        <span className="text-primary">coin!</span>
      </h1>
      <CoinSelector coins={coins} onCoinChange={handleCoinChange} />
      {chartData && <CoinChart coin={chartData.coin} data={chartData.data} />}
    </>
  );
}

export default Coins;
