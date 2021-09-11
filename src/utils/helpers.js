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
        console.log("response data : ", resultData);
        if (callBack && callBack instanceof Function) {
          callBack();
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

export async function addToLocal(ronin, nick, pplayer, pinvestor, callBack) {
  try {
    const data = "DATA";
    const item = {
      raddr: ronin,
      nick,
      pplayer,
      pinvestor,
    };
    const currentData = window.localStorage.getItem(data) || [];
    const jsonCurrentData = JSON.parse(currentData);
    jsonCurrentData.push(item);
    window.localStorage.setItem(JSON.stringify(jsonCurrentData));
    if (callBack && callBack instanceof Function) {
      callBack();
    }
  } catch (ex) {
    // failed to load
  }
}
