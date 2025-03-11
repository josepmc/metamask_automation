import { FunctionComponent, useEffect, useState } from "react";
import { useAppStore } from "@/store/app";
import { EXAMPLE_TOKEN_ADDRESS, IERC20_TOKEN_CONTRACT_ABI } from "@/configuration/contracts";

const TokenBalance: FunctionComponent = () => {
    const {
        getTokenBalanceFixed,
        getAmountOfSelectedToken,
        setTokenBalance,
        tokenAddress,
        accountAddress,
        web3,
        lastTransactionTime,
        setLastTransactionTime,
        selectedToken,
        setSelectedToken,
    } = useAppStore();

    const [isExampleToken, setIsExampleToken] = useState<boolean>(false);

    useEffect(() => {
        const getTokenBalance = async () => {
            if (!accountAddress) return;

            const tokenContract = await new web3!.eth.Contract<typeof IERC20_TOKEN_CONTRACT_ABI>(IERC20_TOKEN_CONTRACT_ABI, tokenAddress);

            const [balance, decimals, symbol] = await Promise.all([
                tokenContract.methods.balanceOf(accountAddress).call({ from: accountAddress! }),
                tokenContract.methods.decimals().call({ from: accountAddress! }),
                tokenContract.methods.symbol().call({ from: accountAddress! })
            ]);
            setTokenBalance(Number(balance));
            setSelectedToken({ address: tokenAddress, symbol: symbol, decimals: Number(decimals) });
        }
        setIsExampleToken(tokenAddress === EXAMPLE_TOKEN_ADDRESS);
        getTokenBalance();
    }, [accountAddress, tokenAddress, lastTransactionTime]);

    const getMoreExampleTokens = async () => {
        try {
            const _amount = getAmountOfSelectedToken(100);
            const testTokenContract = await new web3!.eth.Contract<typeof IERC20_TOKEN_CONTRACT_ABI>(IERC20_TOKEN_CONTRACT_ABI, EXAMPLE_TOKEN_ADDRESS);
            await testTokenContract.methods.mint(_amount).send({ from: accountAddress! });
            setLastTransactionTime(Date.now());
        } catch (error: any) {
            alert(error.message);
        }
    }

    return (
        <>
            {web3
                ? (<div className="md:flex md:justify-between">
                    <div className="text-white-500" data-test="TokenBalance__Div__balanceInfo">Your token balance is <b><span data-test="TokenBalance__Div__balanceAmount">{getTokenBalanceFixed()}</span></b> {selectedToken?.symbol}.</div>
                    {isExampleToken
                        && <div
                            className="text-green-500 hover:text-green-300 cursor-pointer"
                            onClick={getMoreExampleTokens}
                            data-test="TokenBalance__Div__getMoreExampleTokensAction">
                            Mint more tokens!
                        </div>}
                </div>)
                : null
            }
        </>)
};

export default TokenBalance;