// This function is used to inject the css in the html template
function injectStyles(styles) {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

// This function is used to return the pure number with adding proper commas for attractive rendering
// for eg : Input(x) = 10000 then Output => 10,000
function numberWithCommas(x){
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// This function is used to return the pure large number to short billion decimal number
// for eg : Input(num) = 677881071091 then Outpur => 677.34
function inBillions(num){
    return (num / 1e9).toFixed(2)
}

(function() {

    // This function is used to fetch token data from CoinGecko
    function fetchTokenData(token) {
        // Construct the API URL for the provided token
        var apiUrl = `https://api.coingecko.com/api/v3/coins/${token}`;
    
        // Make an API request to CoinGecko
        fetch(apiUrl).then(response => {
            if (response.ok) {
            return response.json();
            } else {
            throw new Error('Failed to retrieve token data');
            }
        }).then(data => {
            // Process and display the data in the widget
            displayWidget(data);
        }).catch(error => {
            console.error('Error:', error);
        });
    }

    // THis function is used to render the widget with fetched data
    function displayWidget(data) {
        const container = document.querySelector('.main-container');
        let template;

        if (data) {
            const tokenImage = data.image?.thumb; // Removed optional chaining for data as it is already checked for truthiness
            const tokenRank = data.market_cap_rank;
            const tokenName = data.name;
            const tokenSymbol = data.symbol.toUpperCase(); // Ensuring symbol is uppercase as per previous CSS
            const tokenInUSD = numberWithCommas(data.market_data?.current_price?.usd.toFixed(2));
            const tokenStatus = data.market_data?.price_change_percentage_24h;
            const tokenMarketCap = inBillions(data.market_data?.market_cap?.usd);
            const tokenVolume = inBillions(data.market_data?.total_volume?.usd);
            template = `
                <div class="crypto-widget-container">
                    <div class="crypto-widget-header">
                        <div class="imageDiv" >
                            <img style="width:46px;height:46px;margin:auto;" src="${tokenImage}" alt="token image">
                        </div>
                        <div class="tokenInfoDiv">
                            <p class="token-name-info">
                                <a class="link" href="https://coinmarketcap.com/currencies/${tokenName}" target="_blank">
                                    <span class="token-name">${tokenName}</span>
                                    <span class="token-symbol">(${tokenSymbol})</span>
                                </a>
                            </p>
                            <p class="token-value-info">
                                <span class="token-value">${tokenInUSD}</span>
                                <span class="token-symbol">USD</span>
                                <span class="token-status" style="color:${tokenStatus > 0 ? 'green' : 'red'};">(${tokenStatus > 0 ? '+' : '-'}${Math.abs(tokenStatus)})</span>
                            </p>
                        </div>
                    </div>
                    <div class="crypto-widget-content">
                        <div class="crypto-widget-rank">
                            RANK <br/>
                            <span class="token-rank">${tokenRank}</span>
                        </div>
                        <div class="crypto-widget-market-cap">
                            MARKET CAP <br/> 
                            <span class="token-market-cap">$${tokenMarketCap} B <span style="font-size:12px">USD</span></span>
                        </div>
                        <div class="crypto-widget-market-volume">
                            VOLUME <br/> 
                            <span class="token-market-volume"> $${tokenVolume} B <span style="font-size:12px">USD</span></span>
                        </div>
                    </div>
                    <p class="crypto-widget-footer">
                        <a class="footerLink link" href="https://coinmarketcap.com/" target="_blank">Powered by CoinMarketCap</a>
                    </p>
                </div>
            `;
            
        } 
        else {
            // If data is not provided, display an error message.
            template = `<h3 style="text-align: center;color:red">Please add a valid token name in the data-token attribute of the script tag.</h3>`;
        }
        container.innerHTML = template; 
    }

    var styles = `
        .crypto-widget-container {
            display: flex;
            flex-direction: column;
            width: 50%;
            font-family: 'Arial', sans-serif;
            border: 1px solid #ddd;
            border-radius: 8px;
            margin: 100px auto;
        }
        .crypto-widget-header {
            border-bottom: 1px solid #ddd;
            border-radius: 8px 8px 0 0;
            text-align: center;
            display: flex;
            padding: 20px auto;
        }
        .imageDiv{
            display: flex;
            width: 25%;
        }
        .tokenInfoDiv{
            width: 75%;
            text-align: left;
        }
        .token-name-info{
            color:rgb(16,112,224);
            font-size: 18px;
        }
        .token-value{
            font-weight: bold;
            font-size: 20px;
        }
        .token-symbol{
            font-weight: 500;
            font-size: 14px;
        }
        .token-status{
            font-weight: bold;
            font-size: 16px;
            margin-left: 6px;
        }
        .token-symbol{
            text-transform: uppercase;
        }
        .crypto-widget-content {
            display: flex;
            justify-content: space-evenly;
            text-align: center;
            line-height: 25px;
            border-bottom: 1px solid #ddd;
        }
        .crypto-widget-rank{
            font-size: 12px;
            padding: 15px 0px;
            width: 33.33%;
        }
        .token-rank{
            font-size: 18px;
        }
        .crypto-widget-market-cap{
            font-size: 12px;
            padding: 15px 0px;
            width: 33.33%;
            border-left: 1px solid #ddd;
            border-right: 1px solid #ddd;
        }
        .token-market-cap{
            font-size: 16px;
        }
        
        .crypto-widget-market-volume{
            font-size: 12px;
            padding: 15px 0px;
            width: 33.33%;
        }
        .token-market-volume{
            font-size: 16px;
        }
        .crypto-widget-footer{
            text-align: center;
            font-style: italic;
            font-size: 12px;
        }
        .link{
            cursor: pointer;
            text-decoration: none;
            color:rgb(16,112,224);
        }
        @media screen and (max-width: 768px) {
            .crypto-widget-container {
                width: 75%;
            }
        }
        @media screen and (max-width: 500px) {
            .crypto-widget-container {
                width: 90%;
            }
            .crypto-widget-header{
                flex-direction: column;
                padding-top: 10px;
            }
            .imageDiv{
                width: 100%;
            }
            .tokenInfoDiv{
                width: 100%;
                text-align: center;
            }
            .crypto-widget-rank{
                padding: 8px;
            }
            .crypto-widget-market-cap{
                padding: 8px;
            }
            .crypto-widget-market-volume{
                padding: 8px;
            }
        }
    `;

    // Calling injectStyles function to add the CSS into the page
    injectStyles(styles);

    // Get the token name parameter from the script tag
    var scriptTag = document.currentScript;
    var token = scriptTag.getAttribute('data-token');
    if(token){
        fetchTokenData(token);
    }
    else{
        displayWidget();
    }
})();