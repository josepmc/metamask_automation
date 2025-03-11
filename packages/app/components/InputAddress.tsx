import { ChangeEvent, FunctionComponent, useState, FormEvent } from "react";
import { EXAMPLE_TOKEN_ADDRESS } from "@/configuration/contracts";
import { isAddress } from 'web3-validator';

export interface InputAddressProps {
    onSubmit: (address: string) => void;
}

const InputAddress: FunctionComponent<InputAddressProps> = ({ onSubmit, ...rest }) => {

    const [tokenAddress, setTokenAddress] = useState<any | null>(null);
    const handleTokenAddressChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setTokenAddress(e.target.value);
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(tokenAddress);
    };
    const applyExampleToken = () => onSubmit(EXAMPLE_TOKEN_ADDRESS);

    return (
        <>
            <div> Enter the address of the ERC20 token</div>
            <form className="flex"
                onSubmit={handleSubmit}
                data-test="InputAddress__Form__address"
            >
                <input
                    type="text"
                    className={`w-full px-2 pb-1.5 text-primary outline-none text-base font-light disabled:opacity-75`}
                    id="inputAddress"
                    placeholder="0x00..."
                    data-test="InputAddress__Input__addressValue"
                    onChange={handleTokenAddressChange}
                />
                <button
                    className="bg-green-600 hover:bg-green-400 text-white font-medium py-2 px-4 disabled:opacity-75"
                    type="submit"
                    disabled={!isAddress(tokenAddress) || false}
                    data-test="InputAddress__Button__submit"
                >
                    Submit
                </button>
            </form>
            <div>
                <span>Or use the example token: </span>
                <span
                    className="text-green-500 hover:text-green-300 cursor-pointer"
                    onClick={applyExampleToken}
                    data-test="InputAddress__Span__exampleTokenLink">{EXAMPLE_TOKEN_ADDRESS}</span>
            </div>
        </>
    );
};

export default InputAddress;