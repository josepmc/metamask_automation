import TokenBalance from "@/components/TokenBalance";
import DepositHistory from "@/components/DepositHistory";
import DepositToken from "@/components/DepositToken";
import InputAddress from "@/components/InputAddress";
import MetaMaskConnector from "@/components/MetaMaskConnector";
import { useAppStore } from "@/store/app";
import Head from "next/head";
import { FunctionComponent } from "react";


const Home: FunctionComponent = () => {

  const { setTokenAddress, tokenAddress, contract } = useAppStore();
  const updateTokenAddress = (address: string) => setTokenAddress(address);
  const resetTokenAddress = () => setTokenAddress("");

  return (
    <>
      <Head>
        <title>Full Stack Task</title>
        <meta
          name="description"
          content="Full Stack Task with Next.js and Web3"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-4" data-test="AppPage__Div__content">
        <MetaMaskConnector />
        {contract && <>
          {!tokenAddress
            ? (<>
              <div className="my-4">
                <InputAddress
                  onSubmit={updateTokenAddress} />
              </div>
            </>)
            : null
          }
          {tokenAddress
            ? (<>
              <hr />
              <div className="block md:flex md:justify-between">
                <div className="truncate max-w-auto">Selected token: <strong>{tokenAddress}</strong></div>
                <div
                  className="text-green-500 hover:text-green-300 cursor-pointer"
                  onClick={resetTokenAddress}>
                  Select another token
                </div>
              </div>
              <div>
                <TokenBalance />
              </div>
              <div className="my-4">
                <DepositToken />
              </div>
              <div>
                <DepositHistory />
              </div>
            </>)
            : null}
        </>
        }
      </div>
    </>
  );
};

export default Home;