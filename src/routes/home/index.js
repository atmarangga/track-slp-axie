import { h, Component } from "preact";
import CoingeckoComponent from "./CoinGeckoRes";
import ScholarFetch from "./ScholarFetch";
import ListComponent from "./ListComponent";
import { getAllLocalData, fetchAxieGqlDetail } from "../../utils/helpers";

import style from "./style.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalData: [],
    };
  }

  componentDidMount() {
    fetchAxieGqlDetail();
    getAllLocalData(this.updateData);
  }

  updateData = (newItem) => {
    this.setState(
      {
        totalData: newItem,
      },
      () => {
        // console.log("totalData : ", this.state.totalData);
      }
    );
  };

  render() {
    return (
      <div class={style.home}>
        <h1>Ronin SLP Tracking</h1>
        <h2>Axie Infinity Scholar SLP managment</h2>
        <div>
          <CoingeckoComponent />
          <ScholarFetch component={this} />
          <ListComponent items={this.state.totalData} />
        </div>
      </div>
    );
  }
}

export default Home;
