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
    this.setState({
      itemData: data,
      loading: false,
    });
  };

  handleLoadData = async () => {
    const { item } = this.props;
    this.setState({
      loading: true,
    });
    getRoninSlp(item?.raddr, this.populateData, () => {
      this.setState({
        loading: false,
      });
    //   console.log("failed");
    });
  };

  handleRefresh() {}

  render() {
    const { loading, itemData } = this.state;
    return (
      <div class={style.itemcomponent}>
        <div class={style.itemnamecomponent}>
          <p class={style.itemtext}>{this.props?.item?.nick}</p>

          {loading ? (
            <div>
              <p class={style.itemtextsmall}>Loading...</p>
            </div>
          ) : (
            <p class={style.itemtextsmall}>
              {itemData?.next_claim_timestamp
                ? `Next Claim: ${convertDate(itemData?.next_claim_timestamp)}`
                : "No Data"}
            </p>
          )}
          <p class={style.itemtextsmall}>{this.props?.item?.raddr || "-"}</p>
        </div>
        {loading ? (
          <></>
        ) : (
          <div class={style.itemslpstat}>
            <p class={style.itemtext}>
              {itemData?.ingame_slp
                ? `${itemData?.ingame_slp || "-"} SLP`
                : null}
            </p>
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
  componentDidUpdate() {
    this.fillList();
  }
  fillList = () => {
    const { items } = this.props;
    // console.log("items :", items);
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
