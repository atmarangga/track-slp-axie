import { h, Component } from "preact";

import { getRoninSlp, convertDate } from "../../utils/helpers";
import style from "./style.css";

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      itemData: {},
    };
  }

  componentDidMount() {
    this.handleLoadData();
  }

  populateData = (data) => {
    console.log("data ? ", data);
    this.setState({
      itemData: data,
      loading: false,
    });
  };

  handleLoadData = () => {
    const { item } = this.props;
    this.setState({
      loading: true,
    });
    getRoninSlp(item?.raddr, this.populateData);
  };

  handleRefresh() {}

  render() {
    const { loading, itemData } = this.state;
    return (
      <div class={style.itemcomponent}>
        <div class={style.itemnamecomponent}>
          <p class={style.itemtext}>{this.props?.item?.nick}</p>
          <p class={style.itemtextsmall}>{this.props?.item?.raddr}</p>
          {loading ? (
            <p class={style.itemtext}>Loading...</p>
          ) : (
            <div class={style.itempvpcontainer}>
              <p
                class={style.itemtextsmall}
              >{`MMR : ${itemData?.pvpData?.elo}`}</p>
              <div class={style.hseperate} />
              <p
                class={style.itemtextsmall}
              >{`Rank : ${itemData?.pvpData?.rank}`}</p>
            </div>
          )}
        </div>
        {loading ? (
          <></>
        ) : (
          <div class={style.itemslpstat}>
            <p class={style.itemtext}>{`${itemData?.ingame_slp} SLP`}</p>
            <div class={style.itempvpcontainer}>
              <p class={style.itemtextsmall}>{`Last Update ${convertDate(
                itemData?.lastupdate
              )}`}</p>
              <div class={style.hseperate} />
              <p class={style.itemtextsmall}>{`Next Claim ${convertDate(
                itemData?.next_claim_timestamp
              )}`}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default class ListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: [],
    };
  }
  componentDidUpdate(){
      this.fillList();
  }
  fillList = () => {
    const { items } = this.props;
    console.log("items :", items);
    const returnedData = [];
    if (items && items.length > 0) {
      for (let a = 0; a < items.length; a += 1) {
        returnedData.push(<ItemList item={items[a]} />);
      }
    }

    return returnedData;
  };
  render() {
    return <div style={style.containerlist}>{this.fillList()}</div>;
  }
}
