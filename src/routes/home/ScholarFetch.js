import { h, Component, createRef } from "preact";
import { addToLocal, getAllLocalData } from "../../utils/helpers";
import ErrorText from "../../components/errortext";
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
      duplicate: false,
      roninInvalid: false,
      nameInvalid: false,
      allData: [],
    };
  }

  allInputRef = createRef();

  handleAddButton = () => {
    

    const { currentNickName, currentRoninAddress, playerShare, investorShare } =
      this.state;
    if (currentNickName && currentRoninAddress) {
      this.setState({
        roninValid: false,
        nameInvalid: false,
      });

      addToLocal(
        currentRoninAddress,
        currentNickName,
        playerShare,
        investorShare,
        (allData) => {
          this.setState(
            {
              currentRoninAddress: "",
              loading: false,
              roninInvalid: false,
              duplicate: false,
              nameInvalid: false,
              currentNickName: "",
              playerShare: null,
              investorShare: null,
              allData,
            },
            () => {
              const { component } = this.props;
              getAllLocalData(component?.updateData(allData));
            }
          );
        },
        (duplicate) => {
          if (duplicate) {
            this.setState({
              loading: false,
              roninInvalid: true,
              duplicate: true,
            });
          } else {
            this.setState({
              nameInvalid: true,
              duplicate: true,
              loading: false,
            });
          }
        }
      );
    } else {
      let nick = false;
      let ronin = false;
      if (!currentNickName) {
        nick = true;
      }
      if (!currentRoninAddress) {
        ronin = true;
      }
      this.setState({
        nameInvalid: nick,
        roninInvalid: ronin,
      });
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
          ref={this.allInputRef}
          disabled={this.state.loading}
          placeholder="Ronin Address. ex : ronin:57883281c943401af0691e9ce0781af67d83ef51"
          class={style.inputronin}
          value={this.state.currentRoninAddress}
          onChange={(e) => {
            this.setState({
              currentRoninAddress: e?.target?.value,
            });
          }}
        />

        {this.state.roninInvalid ? (
          <ErrorText label={"Ronin Address must not be empty or duplicate"} />
        ) : (
          <div class={style.empty}> </div>
        )}

        <input
          disabled={this.state.loading}
          placeholder="Nick Name ex: Albert D. Einstein"
          class={style.inputronin}
          value={this.state.currentNickName}
          onChange={(e) => {
            this.setState({
              currentNickName: e?.target?.value,
            });
          }}
        />
        {this.state.nameInvalid ? (
          <ErrorText label="Name must not be empty or duplicate" />
        ) : (
          <div class={style.empty}> </div>
        )}

        <div class={style.innercontainer}>
          <input
            disabled={this.state.loading}
            type="number"
            placeholder="% Player"
            class={style.inputshare}
            value={this.state.playerShare}
            onKeyUp={this.handleInput}
          />
          <input
            disabled={this.state.loading}
            type="number"
            placeholder="% Investor"
            value={this.state.investorShare}
            class={style.inputshare}
            onKeyUp={this.handleInputInvestor}
          />
          {this.state.edit ? (
            <button
              disabled={this.state.loading}
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
