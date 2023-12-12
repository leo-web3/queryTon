const fs = require("fs");
const axios = require("axios");

const graphqlUrl = "https://dton.io/graphql_tonana";

async function fetchWalletData(address) {
  const query = {
    operationName: "GetWalletCoins",
    variables: {
      address: address,
      page: 0,
      size: 12,
    },
    query: `
            query GetWalletCoins($address: String, $size: Int, $page: Int) {
                coins: ton20wallets(
                    address: $address
                    page: $page
                    page_size: $size
                    order_by: "gen_utime"
                ) {
                    amount
                    address
                    tick
                    __typename
                }
                ton20walletsCount(address: $address)
            }
        `,
  };

  try {
    const response = await axios.post(graphqlUrl, query);
    return response.data;
  } catch (error) {
    console.error("Error fetching data for address:", address, error);
    return null;
  }
}

async function main() {
  const walletData = JSON.parse(fs.readFileSync("wallet.json", "utf8"));

  for (const wallet of walletData) {
    const data = await fetchWalletData(wallet);
    console.log(data.data.coins[0].amount, "-data");
    console.log(`Data for wallet ${wallet}:`, data.data.coins[0].amount / 1000000000);
  }
}

main();
