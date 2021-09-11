import { h } from "preact";
import CoingeckoComponent from "./CoinGeckoRes";
import ScholarFetch from "./ScholarFetch";
import style from "./style.css";

const Home = () => (
  <div class={style.home}>
    <amp-ad
      width="100vw"
      height="320"
      type="adsense"
      data-ad-client="ca-pub-4432250463613785"
      data-ad-slot="9121031415"
      data-auto-format="rspv"
      data-full-width=""
    >
      <div overflow=""></div>
    </amp-ad>
    <h1>Ronin SLP Tracking</h1>
    <h2>Axie Infinity Scholar SLP managment</h2>
    <div>
      <CoingeckoComponent />
      <ScholarFetch />
    </div>
  </div>
);

export default Home;
