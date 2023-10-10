const express = require("express");
const Moralis = require("moralis").default;
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 3001;
const MORALIS_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjE1YzUzZDFmLTBmMTItNDdmNC1iNGFhLTZiMTVmNWY4MDE4MyIsIm9yZ0lkIjoiNTQxMTEiLCJ1c2VySWQiOiI1Mzc2MSIsInR5cGVJZCI6IjIxYTBiZjY0LWE3NjQtNDIxZC1iYzQ2LTMwMzNiNTc0N2QzOSIsInR5cGUiOiJQUk9KRUNUIiwiaWF0IjoxNjk2ODYyOTU4LCJleHAiOjQ4NTI2MjI5NTh9.FfIZLyNUS-5AJjIW7N9q8Wp4UKRIAwrGCRHrxp5FSYE"

app.use(cors());
app.use(express.json());

app.get("/tokenPrice", async (req, res) => {

  const {query} = req;

  const responseOne = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressOne
  })

  const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressTwo
  })

  const usdPrices = {
    tokenOne: responseOne.raw.usdPrice,
    tokenTwo: responseTwo.raw.usdPrice,
    ratio: responseOne.raw.usdPrice/responseTwo.raw.usdPrice
  }
  

  return res.status(200).json(usdPrices);
});

// console.log("process.env.MORALIS_KEY", process.env.MORALIS_KEY)
Moralis.start({
  apiKey: MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
