import { h, Component } from "preact";

import {
  convertDate,
  add14Days,
  getSlpApiV2,
  fetchAxieProfile,
  removeFromLocal,
  getAllLocalData,
} from "../../utils/helpers";
import style from "./style.css";
import removeIcon from "../../assets/remove_icon.png";
import refreshIcon from "../../assets/refresh_icon.png";
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
    try {
      const { item } = this.props;
      fetchAxieProfile(item?.raddr, (result) => {
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

  handleRefresh = async () => {
    this.handleLoadData();
  };

  prepareSLP = () => {};

  populateNickSlpRow = () => {
    const { itemData } = this.state;
    if (
      itemData?.name === undefined ||
      itemData?.name === "" ||
      itemData?.name === null
    ) {
      const noData = `| No data.`;
      return noData;
    }
    return `| ${itemData?.name} ${itemData?.name ? "|" : " "} ${
      itemData?.total
    } ${itemData?.total ? "SLP" : ""}`;
  };

  populateLastClaimedRow = () => {
    const { itemData } = this.state;
    const { item } = this.props;
    const url_marketplace = `https://marketplace.axieinfinity.com/profile/${item.raddr}/axie`;

    if (itemData?.name === undefined || itemData?.last_claimed_item_at === 0) {
      return (
        <div class={style}>
          <p class={style.itemtextsmall}>{item.raddr}</p>
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

  removeItem = () => {
    if (confirm("Are you sure you want to delete this item ?")) {
      // Delete
      const { item, component } = this.props;
      removeFromLocal(
        item.raddr,
        () => {
          getAllLocalData(component.updateData);
        },
        () => {}
      );
    } else {
      // Console
    }
  };

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
        {loading ? (
          <div />
        ) : (
          <div class={style.editcontainer}>
            <div class={style.itemright} onClick={this.handleRefresh}>
              <img src={refreshIcon} class={style.icon} />
            </div>
            <div class={style.itemright} onClick={this.removeItem}>
              <img src={removeIcon} class={style.icon} />
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
      allData: [],
    };
  }
  componentDidUpdate(prevProps) {
    // this.fillList();
    if (prevProps.items.length !== this.props.items.length) {
      this.fillList();
    }
  }

  componentDidMount() {
    this.fillList();
  }

  fillList = () => {
    const { items, component } = this.props;
    console.log("items :", items);
    const returnedData = [];
    if (items && items.length > 0) {
      for (let a = 0; a < items.length; a += 1) {
        console.log("item iterate : ", items[a]);
        returnedData.push(<ItemList item={items[a]} component={component} />);
      }
    }
    this.setState({
      allData: returnedData,
    });
  };
  render() {
    return <div style={style.containerlist}>{this.state.allData}</div>;
  }
}
