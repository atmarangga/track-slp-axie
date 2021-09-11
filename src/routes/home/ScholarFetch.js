import { h, Component } from "preact";
import { getRoninSlp, addToLocal } from "../../utils/helpers";
import style from "./style.css";

export default class ScholarFetch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentRoninAddress: "",
      currentNickName: "",
      playerShare: null,
      investorShare: null,
      loading: false,
    };
  }

  componentDidMount() {
    // getRoninSlp('ronin:57883281c943401af0691e9ce0781af67d83ef51',() => {});
  }

  handleAddButton = () => {
    console.log("clixk ! :: ", this.state);
    const { currentNickName, currentRoninAddress, playerShare, investorShare } =
      this.state;

    if(currentNickName && currentRoninAddress){
      getRoninSlp(
        currentRoninAddress,
        () => {
          addToLocal(
            currentRoninAddress,
            currentNickName,
            playerShare,
            investorShare,
            () => {
              this.setState({
                loading: false,
              });
            }
          );
        },
        () => {
          this.setState({ loading: false });
        }
      );
    }

    
    
  };
  handleEditButton = () => {};

  handleInput = (e) => {
    if (e.target.value) {
      this.setState({
        playerShare: Number(e.target.value),
        investorShare: 100 - Number(e.target.value),
      });
    } else {
      this.setState({
        playerShare: null,
        investorShare: 100,
      });
    }
  };

  handleInputInvestor = (e) => {
    if (e.target.value) {
      this.setState({
        investorShare: Number(e.target.value),
        playerShare: 100 - Number(e.target.value),
      });
    } else {
      this.setState({
        investorShare: null,
        playerShare: 100,
      });
    }
  };

  render() {
    return (
      <div class={style.container}>
        <input
          placeholder="Ronin Address. ex : ronin:57883281c943401af0691e9ce0781af67d83ef51"
          class={style.inputronin}
          onChange={(e) => {
            this.setState({
              currentRoninAddress: e?.target?.value,
            });
          }}
        />
        <input
          placeholder="Nick Name ex: Albert D. Einstein"
          class={style.inputronin}
          onChange={(e) => {
            this.setState({
              currentNickName: e?.target?.value,
            });
          }}
          onBlur={() => {}}
        />
        <div class={style.innercontainer}>
          <input
            type="number"
            placeholder="% Player"
            class={style.inputshare}
            value={this.state.playerShare}
            onKeyUp={this.handleInput}
          />
          <input
            type="number"
            placeholder="% Investor"
            value={this.state.investorShare}
            class={style.inputshare}
            onKeyUp={this.handleInputInvestor}
          />
          {this.state.edit ? (
            <button
              type="submit"
              onClick={this.handleEditButton}
              class={style.addbtn}
            >
              Submit
            </button>
          ) : (
            <button
              type="submit"
              onClick={this.handleAddButton}
              class={style.addbtn}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    );
  }
}
