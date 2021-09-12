import { h, Component } from "preact";
import {
  getSLPPrice,
  getCurrencies,
  saveCurrency,
  getCurrency,
} from "../../utils/helpers";

export default class CoingeckoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPrice: "",
      currentCurrency: "jpy",
      loadingCurrency: false,
      currencyList: [],
    };
  }

  componentDidMount() {
    // const { currentCurrency } = this.state;
    this.initCurrency();
    // getSLPPrice(currentCurrency, this.onSukses);
    getCurrencies(this.handlePriceList);
  }

  onSukses = (slp_price) => {
    this.setState({
      currentPrice: slp_price,
    });
  };

  initCurrency = () => {
    getCurrency((result) => {
      if (result) {
        this.setState({
          currentCurrency: result,
        });
      } 
      getSLPPrice(result || this.state.currentCurrency, this.onSukses);
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
    this.setState(
      {
        loadingCurrency: true,
      },
      () =>
        getSLPPrice(e.target.value, (result) => {
          this.setState({
            currentCurrency: e.target.value,
            currentPrice: result,
            loadingCurrency: false,
          });
          saveCurrency(e.target.value);
        })
    );
  };

  render() {
    return (
      <div>
        <p>
          Currency :{" "}
          {this.state.loadingCurrency ? (
            "Loading... "
          ) : (
            <select
              value={this.state.currentCurrency}
              onChange={this.handleChange}
              disabled={this.state.currencyList.length < 1}
            >
              {this.renderList()}
            </select>
          )}
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
