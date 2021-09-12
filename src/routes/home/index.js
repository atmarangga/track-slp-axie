import { h, Component } from "preact";
import CoingeckoComponent from "./CoinGeckoRes";
import ScholarFetch from "./ScholarFetch";
import ListComponent from "./ListComponent";
import { getAllLocalData, getSlpApiV2} from "../../utils/helpers";

import style from "./style.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalData: [],
      detailData: [],
      totalSlp: 0,
      slpToCurrency: 0,
    };
  }

  componentDidMount() {
    getSlpApiV2("ronin:57883281c943401af0691e9ce0781af67d83ef51");
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

  updateDetailData = (item) => {
    const {detailData} = this.state;
    if(detailData.length < 1){
      detailData.push(item)
    } else {
      for(let x = 0; x < detailData.length; x += 1){

      }
    }
        
  }

  render() {
    return (
      <div class={style.home}>
        <h1>Ronin SLP Tracking</h1>
        <h2>Axie Infinity Scholar SLP managment</h2>
        <div>
          <CoingeckoComponent />
          <ScholarFetch component={this} />
          <ListComponent items={this.state.totalData} component={this} />
        </div>
      </div>
    );
  }
}

export default Home;
