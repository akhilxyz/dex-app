const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3004;
const cors = require('cors'); // Import the cors package

const API_TOKEN = 'xCq9OlN6VnUPJ0GKY4JxWoiw3R2hf387'; // Replace with your actual authorization token

app.use(cors());
app.use(express.json());

app.get('/allowance', async (req, res) => {
  const { tokenAddress, walletAddress } = req.query;
  try {
    const response = await axios.get(
      `https://api.1inch.dev/swap/v5.2/137/approve/allowance?tokenAddress=${tokenAddress}&walletAddress=${walletAddress}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          Accept: '*/*',
        },
      }
    );

    // The allowance data is in response.data
    const allowanceData = response.data;

    res.json(allowanceData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/getPrice', async (req, res) => {
  const { addressOne, addressTwo } = req.body;
  const currency = 'USD';
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };

    const responseOne = await axios.post(
      'https://api.1inch.dev/price/v1.1/137',
      {
        tokens: [addressOne, addressTwo],
        currency,
      },
      config
    );

    console.log("responseOne", responseOne)

    if (responseOne.status !== 200) {
      throw new Error('Failed to fetch token prices from 1inch API');
    }

    const usdPrices = {
      tokenOne: responseOne.data[addressOne],
      tokenTwo: responseOne.data[addressTwo],
      ratio: responseOne.data[addressOne] / responseOne.data[addressTwo],
    };

    res.send(usdPrices);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/approve', async (req, res) => {
  const { tokenAddress } = req.query;
  console.log("tokenAddress", tokenAddress)
  try {
    const apiUrl = 'https://api.1inch.dev/swap/v5.2/137/approve/transaction';
    const tokenAddress = '0x9de41aff9f55219d5bf4359f167d1d0c772a396d';
    const amount = '100000000000';



    const response = await axios
      .get(apiUrl, {
        params: {
          tokenAddress,
          amount,
        },
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${API_TOKEN}`,
        },
      })

    if (response.status !== 200) {
      throw new Error('Failed to fetch token prices from 1inch API', response.statusText);
    }

    // The approval transaction data is in response.data
    const approvalTransactionData = response.data;

    res.json(approvalTransactionData);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/swap', async (req, res) => {
  const { tokenOneAddress, tokenTwoAddress, tokenOneAmount, address, slippage } = req.query;
  try {
    const apiUrl = 'https://api.1inch.dev/swap/v5.2/137/swap';
    const src = tokenOneAddress;
    const dst = tokenTwoAddress;
    const amount = tokenOneAmount.padEnd(tokenOne.decimals + tokenOneAmount.length, '0');
    const from = address;
    const response = await axios.get(apiUrl, {
      params: {
        src,
        dst,
        amount,
        from,
        slippage,
      },
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });
    if (response.status !== 200) {
      throw new Error('Failed to SWAP', response.statusText);
    }
    res.json(response.data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
