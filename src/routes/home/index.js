import { h, Component } from "preact";
import style from "./style.css";

import { getSLPPrice, getCurrencies } from "../../utils/helpers";

class CoingeckoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPrice: "",
      currentCurrency: "idr",
      currencyList: [],
    };
  }

  componentDidMount() {
    const { currentCurrency } = this.state;
    getSLPPrice(currentCurrency, this.onSukses);
    getCurrencies(this.handlePriceList);
  }

  onSukses = (slp_price) => {
    this.setState({
      currentPrice: slp_price,
    });
  };

  handlePriceList = (lists) => {
    this.setState({
      currencyList: lists,
    });
  };

  renderList = () => {
    const { currencyList } = this.state;
    const returnData = [];
    for (let i = 0; i < currencyList.length; i += 1) {
      returnData.push(
        <option value={currencyList[i]}>
          {" "}
          {currencyList[i]?.toUpperCase()}
        </option>
      );
    }
    return returnData;
  };

  handleChange = (e) => {
    this.setState({ currentCurrency: e.target.value }, () => {
      getSLPPrice(this.state.currentCurrency, this.onSukses);
    });
  };

  render() {
    return (
      <div>
        <p>
          Currency :{" "}
          <select
            value={this.state.currentCurrency}
            onChange={this.handleChange}
            disabled={this.state.currencyList.length < 1}
          >
            {this.renderList()}
          </select>
        </p>
        <p>
          <b>SLP</b> current price :{" "}
          {`${this.state.currentCurrency?.toUpperCase()} ${
            this.state.currentPrice
          }`}
        </p>
      </div>
    );
  }
}

const Home = () => (
  <div class={style.home}>
    <h1>Multiple Slp Tracking</h1>
    <h2>A.K.A. Scholar slp managment</h2>
    <div>
      <CoingeckoComponent />
    </div>
  </div>
);

export default Home;
