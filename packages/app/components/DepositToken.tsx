import { ChangeEvent, FunctionComponent, useEffect, useState } from "react";
import { IERC20_TOKEN_CONTRACT_ABI, SMART_CONTRACT_ADDRESS } from "@/configuration/contracts";
import { useAppStore } from "@/store/app";

const DepositToken: FunctionComponent = () => {

    const {
        contract,
        tokenAddress,
        accountAddress,
        web3,
        tokenBalance,
        getTokenBalanceFixed,
        setLastTransactionTime,
        getAmountOfSelectedToken,
    } = useAppStore();

    const [amount, setAmount] = useState<number>(0);
    const [isValidAmount, setIsValidAmount] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const isValid = !!amount && amount >= 1 && amount <= tokenBalance;
        setIsValidAmount(() => isValid);
        setError(!isValid ? `The amount value must be between 1 and ${getTokenBalanceFixed()}` : null);
    }, [amount, tokenBalance])

    const updateDepositAmount = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAmount(() => Number(e.target.value));
    };

    const approve = async () => {
        const _amount = getAmountOfSelectedToken(amount);
        const tokenContract = await new web3!.eth.Contract<typeof IERC20_TOKEN_CONTRACT_ABI>(IERC20_TOKEN_CONTRACT_ABI, tokenAddress);
        await tokenContract.methods.approve(SMART_CONTRACT_ADDRESS, _amount).send({ from: accountAddress! });
    }

    const handleDeposit = async () => {
        try {
            if (!isValidAmount) {
                throw new Error(`The amount value must be between 1 and ${tokenBalance}`)
            }
            await approve();
            const _amount = getAmountOfSelectedToken(amount);
            await contract.methods.deposit(tokenAddress, _amount).send({ from: accountAddress!, gas: 3000000 });
            setError(null);
            setLastTransactionTime(Date.now());
        } catch (error: any) {
            setError(`Something went wrong: ${error.message}`);
        }
    }

    if (tokenBalance === 0) {
        return (
            <div className="text-rose-400" data-test="DepositToken__Div__error">
                The deposit is disabled because you don't have any token left in your account.
            </div>
        );
    }

    return (
        <>
            <div>
                <p>How many tokens do you want to deposit?</p>
            </div>
            <div className="flex">
                <input
                    className={`w-full px-2 pb-1.5 text-primary outline-none text-base font-light disabled:opacity-75`}
                    type="number"
                    min="1"
                    max={tokenBalance}
                    placeholder={`from 1 to ${getTokenBalanceFixed()}`}
                    onChange={updateDepositAmount}
                    data-test="DepositToken__Input__depositAmount" />
                <button
                    className="bg-green-600 hover:bg-green-400 text-white font-medium py-2 px-4 disabled:opacity-75"
                    onClick={handleDeposit}
                    disabled={!isValidAmount}
                    data-test="DepositToken__Button__deposit"
                >
                    Deposit
                </button>
            </div>
            <div className="text-rose-400" data-test="DepositToken__Div__error">
                {error}
            </div>
        </>
    );
};

export default DepositToken;