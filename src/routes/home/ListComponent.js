import { h, Component } from "preact";

import {
  convertDate,
  add14Days,
  getSlpApiV2,
  fetchAxieProfile,
} from "../../utils/helpers";
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

  populateData = async (data) => {
    console.log("data save : ", data);
    try {
      const { item } = this.props;
      fetchAxieProfile(item?.raddr, (result) => {
        console.log("detail ? : ", result?.data?.publicProfileWithRoninAddress);
        this.setState(
          {
            itemData: {
              ...data,
              ...item,
              accountId: result?.data?.publicProfileWithRoninAddress?.accountId,
              name: result?.data?.publicProfileWithRoninAddress?.name,
            },
            loading: false,
          },
          () => {
            // console.log("this.state : ", this.state);
          }
        );
      });
    } catch (ex) {
      console.log("error fetch detail");
    }
  };

  handleLoadData = async () => {
    const { item } = this.props;
    this.setState({
      loading: true,
    });
    getSlpApiV2(item?.raddr, this.populateData, () => {
      this.setState({
        loading: false,
      });

      //   console.log("failed");
    });
  };

  handleRefresh = async () => {};

  prepareSLP = () => {};

  populateNickSlpRow = () => {
    const { itemData } = this.state;
    console.log("itemData?.name", itemData?.name);
    console.log("itemData?.total", itemData?.total);
    if (
      (itemData?.name === undefined ||
        itemData?.name === "" ||
        itemData?.name === null) &&
      itemData?.total === undefined
    ) {
      const noData = `| No data.`;
      return noData;
    }
    return `| ${itemData?.name} ${itemData?.name ? "|" : " "} ${
      itemData?.total
    } ${itemData?.total ? "SLP :" : null}`;
  };

  populateLastClaimedRow = () => {
    const { itemData } = this.state;
    const { item } = this.props;
    const url_marketplace = `https://marketplace.axieinfinity.com/profile/${item.raddr}/axie`;

    if (
      itemData?.name === undefined &&
      itemData?.last_claimed_item_at === undefined
    ) {
      return (
        <div class={style}>
          <a
            class={style.itemtextsmall}
            href={url_marketplace}
            target="_blank"
            rel="noreferrer"
          >
            {item.raddr}
          </a>
          <div class={style.datecontainer}>
            <p class={style.itemtextsmall}> - </p>
            <div class={style.hseperate} />
            <p class={style.itemtextsmall}> </p>
          </div>
        </div>
      );
    }

    return (
      <div class={style}>
        <a
          class={style.itemtextsmall}
          href={url_marketplace}
          target="_blank"
          rel="noreferrer"
        >
          {item.raddr}
        </a>
        <div class={style.datecontainer}>
          <p class={style.itemtextsmall}>
            {`Last claimed : ${convertDate(itemData?.last_claimed_item_at)}`}
          </p>
          <div class={style.hseperate} />
          <p class={style.itemtextsmall}>
            {`Next claimed : ${add14Days(itemData?.last_claimed_item_at)}`}
          </p>
        </div>
      </div>
    );
  };

  removeItem = () => {};

  render() {
    const { loading } = this.state;
    const { item } = this.props;
    return (
      <div class={style.itemcomponent}>
        <div class={style.itemnamecomponent}>
          <p class={style.itemtext}>
            <b>
              {item?.nick} {!loading ? this.populateNickSlpRow() : null}
            </b>
          </p>
          {loading ? (
            <div>
              <p class={style.itemtextsmall}>Loading...</p>
              <p class={style.itemtextsmall}>``</p>
            </div>
          ) : (
            this.populateLastClaimedRow()
          )}
        </div>
        <div class={style.itemrightremove} onClick={this.removeItem}>Remove</div>
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
