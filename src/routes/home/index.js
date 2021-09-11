import { h } from "preact";
import CoingeckoComponent from "./CoinGeckoRes";
import ScholarFetch from "./ScholarFetch";
import style from "./style.css";

const Home = () => (
  <div class={style.home}>
    <h1>Ronin SLP Tracking</h1>
    <h2>Axie Infinity Scholar SLP managment</h2>
    <div>
      <CoingeckoComponent />
      <ScholarFetch />
    </div>
  </div>
);

export default Home;
