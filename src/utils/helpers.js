const data = "DATA";
const GQL_URL_DATA = "https://graphql-gateway.axieinfinity.com/graphql";
const options = {
  method: "GET",
  headers: {
    "access-control-allow-headers":
      "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    "access-control-allow-methods": "POST, PUT, DELETE, GET, OPTIONS",
    "access-control-allow-origin": "*",
    "access-control-expose-headers": "link, per-page, total",
    "access-control-max-age": 7200,
    "access-control-request-method": "*",
    "content-type": "application/json",
  },
};

export async function getSLPPrice(currency = "usd", callBack) {
  const SLP_CONTRACT = "0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25";
  const URL_GECKO_COIN = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${SLP_CONTRACT}&vs_currencies=${currency}`;

  try {
    fetch(URL_GECKO_COIN, options).then(async (results) => {
      const resultData = await results.text();
      const dataBalikan = (resultData && JSON.parse(resultData)) || {};
      if (callBack && callBack instanceof Function) {
        const slpPrice = dataBalikan[SLP_CONTRACT][currency];
        callBack(slpPrice);
      }
    });
  } catch (exs) {
    //oops
  }
}

export async function getCurrencies(callBack) {
  const URL_CURRENCY_LIST =
    "https://api.coingecko.com/api/v3/simple/supported_vs_currencies";

  try {
    fetch(URL_CURRENCY_LIST, options).then(async (results) => {
      const resultData = await results.text();
      const dataBalikan = (resultData && JSON.parse(resultData)) || {};
      if (callBack && callBack instanceof Function) {
        callBack(dataBalikan);
      }
    });
  } catch (exs) {
    //oops
  }
}

export async function getRoninSlp(roninAddress, callBack, callBackError) {
  let address = roninAddress?.trim();
  if (address.indexOf("ronin:") > -1) {
    address = roninAddress.replace("ronin:", "0x");
  }

  const URL_RONIN_FETCH_DATA = `https://axie-infinity.p.rapidapi.com/get-final-data/${address}?id=${address}`;
  try {
    fetch(URL_RONIN_FETCH_DATA, {
      method: "GET",
      headers: {
        "x-rapidapi-host": "axie-infinity.p.rapidapi.com",
        "x-rapidapi-key": "959418aaccmsha32a204a09a9b34p1fcdc3jsn8e6205f7aae2",
      },
    })
      .then(async (response) => {
        const resultData = await response.text();
        let error = false;
        if (
          resultData?.messages?.indexOf("unreachable") > -1 ||
          resultData?.indexOf("Error") > -1
        ) {
          callBackError();
          error = true;
        }

        if (callBack && callBack instanceof Function && !error) {
          const rawData = await JSON.parse(resultData);

          if (rawData?.walletData) {
            callBack(rawData?.walletData);
          } else if (rawData?.calendar && rawData?.pvpData) {
            callBack(rawData);
          }
        }
      })
      .catch((err) => {
        //

        if (callBackError && callBackError instanceof Function) {
          callBackError(err);
        }
      });
  } catch (ex) {
    if (callBackError && callBackError instanceof Function) {
      callBackError(ex);
    }
  }
}

export async function removeFromLocal(roninAddr, callBack, callBackError) {
  try {
    const currentData = window.localStorage.getItem(data) || "{}";
    const jsonCurrentData = JSON.parse(currentData);

    if (jsonCurrentData?.dataPlayer?.length > 0) {
      const playerData = jsonCurrentData?.dataPlayer;
      
      const indexToDelete = playerData.indexOf(
        playerData.filter((a) => a.raddr === roninAddr)[0]
      );
      
      playerData.splice(indexToDelete, 1);
      
      if (playerData === undefined || playerData === null) {
        //empty ?
      }
      window.localStorage.setItem(data, JSON.stringify(jsonCurrentData));
      if (callBack && callBack instanceof Function) {
        callBack();
      }
    }
  } catch (exception) {
    // failed to save to localStorage
    if (callBackError && callBackError instanceof Function) {
      callBackError();
    }
  }
}

export async function addToLocal(
  ronin,
  nick,
  pplayer,
  pinvestor,
  callBack,
  errorCallback
) {
  try {
    const item = {
      raddr: ronin,
      nick,
      pplayer,
      pinvestor,
    };
    const currentData = window.localStorage.getItem(data) || "{}";
    const jsonCurrentData = JSON.parse(currentData);
    if (jsonCurrentData?.dataPlayer?.length > 0) {
      if (!checkDuplicate(ronin, jsonCurrentData?.dataPlayer)) {
        if (!checkNickDuplicate(nick, jsonCurrentData?.dataPlayer)) {
          jsonCurrentData.dataPlayer.push(item);
          window.localStorage.setItem(data, JSON.stringify(jsonCurrentData));
          if (callBack && callBack instanceof Function) {
            callBack(jsonCurrentData?.dataPlayer);
          }
        } else {
          errorCallback &&
            errorCallback instanceof Function &&
            errorCallback(false);
        }
      } else {
        errorCallback &&
          errorCallback instanceof Function &&
          errorCallback(true);
      }
    } else {
      jsonCurrentData.dataPlayer = [];
      jsonCurrentData.dataPlayer.push(item);
      window.localStorage.setItem(data, JSON.stringify(jsonCurrentData));
      if (callBack && callBack instanceof Function) {
        callBack(jsonCurrentData?.dataPlayer);
      }
    }
  } catch (ex) {
    // failed to load
    // console.log("could not get / save data ", ex);
  }
}
// fetch all data from local storage and put on generic table
export async function fetchAllData(callBack) {
  try {
    const currentData = window.localStorage.getItem(data) || "{}";
    const jsonCurrentData = JSON.parse(currentData);
    const { dataPlayer } = jsonCurrentData;
    const allData = [];
    if (dataPlayer && dataPlayer.length > 0) {
      for (let x = 0; x < dataPlayer.length; x += 1) {
        getRoninSlp(dataPlayer[x]?.raddr, (result) => {
          allData.push(result);
          if (
            x === dataPlayer.length - 1 &&
            callBack &&
            callBack instanceof Function
          ) {
            //last element
            callBack(allData);
          }
        });
      }
    }
  } catch (ex) {
    // console.log("failed to fetch data : ", ex);
  }
}

export async function getAllLocalData(callBack) {
  try {
    const allData = window.localStorage.getItem(data) || "{}";
    const jsonAllData = JSON.parse(allData);
    callBack(jsonAllData?.dataPlayer);
  } catch (e) {
    // oops
  }
}

function checkDuplicate(rnAddress, localData) {
  for (let a = 0; a < localData.length; a += 1) {
    if (localData[a]?.raddr === rnAddress) {
      return true;
    }
  }
  return false;
}

function checkNickDuplicate(rnNick, localData) {
  for (let a = 0; a < localData.length; a += 1) {
    if (localData[a]?.nick === rnNick) {
      return true;
    }
  }
  return false;
}

export function convertDate(sec) {
  const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(sec);
  return `${d.getDate()}/${
    d.getMonth() + 1
  }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
}
export function add14Days(sec) {
  const d = new Date(0);
  d.setUTCSeconds(sec);
  d.setDate(d.getDate() + 14);
  return `${d.getDate()}/${
    d.getMonth() + 1
  }/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
}

export function fetchAxieGqlDetail(roninAddr, callBack) {
  try {
    let address = roninAddr;
    if (roninAddr.indexOf("ronin:") > -1) {
      address = roninAddr.replace("ronin:", "0x");
    }

    fetch(GQL_URL_DATA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {
            axies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {
                  total
                  results {
                          ...AxieBrief
                                __typename
                                  }
                                      __typename
                                      }
                                    }
                                    
                                    fragment AxieBrief on Axie {
                                        id
                                          name
                                            stage
                                              class
                                                breedCount
                                                  image
                                                    title
                                                      battleInfo {
                                                            banned
                                                                __typename
                                                                }
                                                                  auction {
                                                                        currentPrice
                                                                            currentPriceUSD
                                                                                __typename
                                                                                }
                                                                                  parts {
                                                                                        id
                                                                                            name
                                                                                                class
                                                                                                    type
                                                                                                        specialGenes
                                                                                                            __typename
                                                                                                            }
                                                                                                              __typename
                                                                                                            }
                                                                                                            
      `,
        variables: {
          from: 0,
          size: 3,
          sort: "IdDesc",
          auctionType: "All",
          owner: address,
          criteria: {
            region: null,
            parts: null,
            bodyShapes: null,
            classes: null,
            stages: null,
            numMystic: null,
            pureness: null,
            title: null,
            breedable: null,
            breedCount: null,
            hp: [],
            skill: [],
            speed: [],
            morale: [],
          },
        },
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (callBack && callBack instanceof Function) {
          callBack(result);
        }
      });
  } catch (ex) {
    // console.log("exception : ", ex);
  }
}

export async function fetchAxieProfile(roninAddr, callBack) {
  try {
    fetch(GQL_URL_DATA, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operationName: "GetProfileByRoninAddress",
        variables: {
          roninAddress: roninAddr.replace("ronin:", "0x").trim(),
        },
        query:
          "query GetProfileByRoninAddress($roninAddress: String!) {\n  publicProfileWithRoninAddress(roninAddress: $roninAddress) {\n    ...Profile\n    __typename\n  }\n}\n\nfragment Profile on PublicProfile {\n  accountId\n  name\n  addresses {\n    ...Addresses\n    __typename\n  }\n  __typename\n}\n\nfragment Addresses on NetAddresses {\n  ethereum\n  tomo\n  loom\n  ronin\n  __typename\n}\n",
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (callBack && callBack instanceof Function) {
          callBack(result);
        }
      });
  } catch (exs) {
    // console.log("error : ", exs);
  }
}

export async function getSlpApiV2(roninAddr, callBack, callBackError) {
  const URL_GAME_API = `https://game-api.skymavis.com/game-api/clients/${roninAddr.replace(
    "ronin:",
    "0x"
  )}/items/1`;
  try {
    fetch(URL_GAME_API, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (callBack && callBack instanceof Function) {
          callBack(result);
        }
      })
      .catch((err) => {
        if (callBackError && callBackError instanceof Function) {
          callBackError(err);
        }
      });
  } catch (ex) {
    if (callBackError && callBackError instanceof Function) {
      callBackError(ex);
    }
  }
}

export async function saveCurrency(selected) {
  try {
    window.localStorage.setItem("currency", selected);
  } catch (exs) {
    //
  }
}

export async function getCurrency(callBack) {
  try {
    if (callBack && callBack instanceof Function) {
      callBack(window.localStorage.getItem("currency"));
    }
  } catch (err) {
    // console.log("err to load currency.");
  }
}
