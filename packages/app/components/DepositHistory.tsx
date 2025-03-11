import { CHAIN_INFO } from "@/configuration/contracts";
import { useAppStore } from "@/store/app";
import { FunctionComponent, useEffect, useState } from "react";

interface DepositEvent {
    transaction: string;
    amount: number;
    depositor: string;
    token: string;
}

const DepositHistory: FunctionComponent = () => {
    const {
        contract,
        accountAddress,
        tokenAddress,
        lastTransactionTime,
        selectedToken
    } = useAppStore();

    const [deposits, setDeposits] = useState<DepositEvent[]>([]);
    const [totalDeposit, setTotalDeposit] = useState<number>(0);

    useEffect(() => {
        if (!contract || !accountAddress || !selectedToken) return;

        const mapEvent = (event: any) => (
            {
                transaction: event.transactionHash,
                depositor: event.returnValues.depositor,
                token: event.returnValues.token,
                amount: Number(event.returnValues.amount) / 10 ** selectedToken.decimals
            });

        const getAccountTokenDeposits = async () => {
            const filter = { depositor: accountAddress, token: tokenAddress };
            const events = await contract.getPastEvents("Deposit", { filter, fromBlock: 0, toBlock: "latest" });
            const depositEvents: DepositEvent[] = events.map((e: any) => mapEvent(e));
            setDeposits(depositEvents);

            const totalDeposited = depositEvents.reduce((acc, deposit) => acc += deposit.amount, 0);
            setTotalDeposit(totalDeposited);
        }

        getAccountTokenDeposits();
    }, [contract, accountAddress, selectedToken, lastTransactionTime]);

    return (
        <div className="overflow-x-auto">
            <table
                className="w-full table-auto divide-y divide-gray-200 dark:divide-gray-700 border-separate border-spacing-2 border border-slate-500"
                data-test="DepositHistory__Table__history">
                <caption className="font-bold">ACCOUNT DEPOSIT HISTORY FOR CURRENT TOKEN</caption>
                <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                        <th>Transaction</th>
                        <th>Depositor</th>
                        <th>Token address</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {contract
                        ? deposits.map(({ transaction, depositor, token, amount }) => (
                            <tr key={transaction}>
                                <td className="truncate max-w-0 text-green-500 hover:text-green-300" title={transaction}>
                                    <a href={`${CHAIN_INFO.exporer}/tx/${transaction}`} target="_blank">
                                        {transaction}
                                    </a>
                                </td>
                                <td className="truncate max-w-0" title={depositor}>{depositor}</td>
                                <td className="truncate max-w-0" title={token}>{token}</td>
                                <td className="text-right">{amount}</td>
                            </tr>))
                        : null
                    }
                </tbody>
                <tfoot className="">
                    <tr className="font-bold">
                        <td colSpan={3}>Total</td>
                        <td className="text-right">{totalDeposit}</td>
                    </tr>
                </tfoot>
            </table>

        </div>)
};

export default DepositHistory;