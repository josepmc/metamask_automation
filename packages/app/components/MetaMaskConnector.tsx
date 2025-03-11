import { CHAIN_INFO, SMART_CONTRACT_ABI, SMART_CONTRACT_ADDRESS } from "@/configuration/contracts";
import { useAppStore } from "@/store/app";
import { FunctionComponent, useEffect, useState } from "react";
import Web3 from "web3";

const MetaMaskConnector: FunctionComponent = () => {

    const {
        setAccountAddress,
        accountAddress,
        setContract,
        web3,
        setWeb3
    } = useAppStore();

    const [ethereum, setEthereum] = useState<any | null>(null);
    const [isSepoliaChain, setIsSepoliaChain] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const setFirstUserAccount = async (): Promise<string> => {
        let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const firstAccount = accounts[0];
        setAccountAddress(firstAccount);
        return firstAccount;
    }

    const connectMetaMask = async () => {
        if (!accountAddress) {
            setFirstUserAccount();
        }

        if (web3 && !isSepoliaChain) {
            try {
                await web3.currentProvider?.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: Web3.utils.toHex(CHAIN_INFO.id) }],
                });
            } catch (switchError: any) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (switchError.code === 4902) {
                    setError(`Add this chain into your Metamask plugin: ${CHAIN_INFO.id}`)
                }
            }
        }
    }

    useEffect(() => {
        setIsLoading(true);
        const metaMask = (window as any).ethereum;
        setEthereum(metaMask);
        if (!metaMask) {
            setError("Metamask not found!");
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const initializeEthereum = async () => {
            if (!ethereum) return;

            try {
                const web3 = new Web3(ethereum);
                setWeb3(web3);

                const checkCurrentChain = async (): Promise<boolean> => {
                    const currentChainId: number = await web3.eth.net.getId().then((value) => Number(value));
                    setIsSepoliaChain(currentChainId === CHAIN_INFO.id);
                    return currentChainId === CHAIN_INFO.id;
                }

                const [_isSepoliaChain, _accountAddress] = await Promise.all([checkCurrentChain(), setFirstUserAccount()]);
                ethereum.on("accountsChanged", async () => await setFirstUserAccount());
                ethereum.on('chainChanged', async () => await initializeEthereum());
                ethereum.on("disconnect", () => setAccountAddress(null));


                if (!_isSepoliaChain) {
                    throw new Error("Invalid chain id");
                }

                if (!_accountAddress) {
                    throw new Error("Invalid account address");
                }

                const smartContract = await new web3.eth.Contract(SMART_CONTRACT_ABI, SMART_CONTRACT_ADDRESS);
                setContract(smartContract);
                setError(null);
            } catch (error: any) {
                setError(error.message);
                setContract(null);
            }
            finally {
                setIsLoading(false);
            }
        };

        initializeEthereum();
    }, [ethereum]);

    const errorMessage = (<>
        <div className="text-center border-2 border-rose-500 p-2 bg-rose-700 mt-8" data-test="MetaMaskConnector__Div__error">
            <p> It seems like your MetaMask plugin is not present or the network chain is not already configured.</p>
            <p> Please, make sure to install <a className="underline underline-offset-4 text-green-400 hover:text-green-300" href="https://metamask.io/download/" target="_blank">Metamask plugin</a> for
                your browser and then connect to <strong>Sepolia network</strong></p>
            {error && <p className="text-white-700 mt-2 font-bold">{error}</p>}
        </div></>);

    if (isLoading) {
        return (<p className="text-white-700">Loading...</p>)
    } else {
        return (
            <div className="p-4 text-right">
                {ethereum && (!accountAddress || !isSepoliaChain) ? (
                    <>
                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded"
                            onClick={connectMetaMask}
                            data-test="MetaMaskConnector__Button__connect">
                            Connect Metamask to Sepolia
                        </button>
                    </>

                ) : null}
                {accountAddress && <div className="text-white-700 truncate max-w-auto" data-test="MetaMaskConnector__Div__connect">Connected as: {accountAddress}</div>}
                {error && errorMessage}
            </div>
        );
    }
};

export default MetaMaskConnector;