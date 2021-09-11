
const options = {
    method: 'GET',
    headers: {
        "access-control-allow-headers": 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        "access-control-allow-methods": 'POST, PUT, DELETE, GET, OPTIONS',
        "access-control-allow-origin": '*',
        "access-control-expose-headers": 'link, per-page, total',
        "access-control-max-age": 7200,
        "access-control-request-method": '*',
        "content-type": "application/json"
    }
}

export async function getSLPPrice (currency = 'usd', callBack){
    const SLP_CONTRACT = '0xcc8fa225d80b9c7d42f96e9570156c65d6caaa25';
    const URL_GECKO_COIN = `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${SLP_CONTRACT}&vs_currencies=${currency}`;
    
    try{
        fetch(URL_GECKO_COIN, options).then(async (results) => {
            const resultData = await results.text();
            console.log('resultData :: ', resultData);
            const dataBalikan = (resultData && JSON.parse(resultData)) || {}
            console.log('dataBalikan :: ', dataBalikan);
            if(callBack && callBack instanceof Function){
                const slpPrice = dataBalikan[SLP_CONTRACT][currency]
                callBack(slpPrice);
            }
        })       
    }
    catch(exs){
        //oops
    }
}

export async function getCurrencies (callBack){
    
    const URL_CURRENCY_LIST = 'https://api.coingecko.com/api/v3/simple/supported_vs_currencies';
    
    try{
        fetch(URL_CURRENCY_LIST, options).then(async (results) => {
            const resultData = await results.text();
            const dataBalikan = (resultData && JSON.parse(resultData)) || {}
            console.log('data currencies :: ', dataBalikan);
            if(callBack && callBack instanceof Function){
                callBack(dataBalikan);
            }
        })       
    }
    catch(exs){
        //oops
    }
}