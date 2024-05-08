import React, { useState } from "react";
import { ethers } from "ethers";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/solid";

function App() {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [numAddresses, setNumAddresses] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [showPrivateKey, setShowPrivateKey] = useState(
    new Array(10).fill(false)
  );
  const [error, setError] = useState("");

  const togglePrivateKeyVisibility = (index) => {
    const updatedVisibility = [...showPrivateKey];
    updatedVisibility[index] = !updatedVisibility[index];
    setShowPrivateKey(updatedVisibility);
  };

  const getAddressesFromSeed = async () => {
    try {
      const mnemonic = { phrase: seedPhrase };
      const wallet = ethers.Wallet.fromMnemonic(mnemonic.phrase);
      const hdNode = ethers.utils.HDNode.fromMnemonic(wallet.mnemonic.phrase);

      const derivedAddresses = [];
      for (let i = 0; i < numAddresses; i++) {
        const derivedWallet = hdNode.derivePath(`m/44'/60'/0'/0/${i}`);
        derivedAddresses.push({
          address: derivedWallet.address,
          privateKey: derivedWallet.privateKey,
        });
      }

      setAddresses(derivedAddresses);
      setError(""); // Clear any previous error when successful
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid seed phrase entered. Please check and try again.");
      setAddresses([]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      <div
        className="p-4 bg-green-100 border-l-4 border-green-500 text-green-700"
        role="alert"
      >
        <p className="font-bold">Security Disclaimer</p>
        <p>
          This application does not store your seed phrase. Please verify by
          inspecting the network traffic in your browser's developer tools
          (Inspect Element > Network tab) to ensure that your data is processed
          locally and not sent over the internet. Immediately go away if not the
          case!
        </p>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl px-10 py-8">
          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
              role="alert"
            >
              <p>{error}</p>
            </div>
          )}
          <header className="mb-14">
            <h1 className="text-4xl font-bold text-center text-gray-700 bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-blue-500">
              EVM Address Deriverrrrr
            </h1>
            <div className="mt-6">
              <input
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                type="text"
                value={seedPhrase}
                onChange={(e) => setSeedPhrase(e.target.value)}
                placeholder="Enter seed phrase"
              />
            </div>
            <div className="mt-4 flex space-x-3">
              <input
                className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                type="number"
                value={numAddresses}
                onChange={(e) => setNumAddresses(e.target.value)}
                placeholder="Number of addresses you'd like to derive"
                min="1"
                max="10"
              />
              <button
                className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-0"
                onClick={getAddressesFromSeed}
              >
                Get Addresses
              </button>
            </div>
          </header>
          {addresses.map((addr, index) => (
            <div
              key={index}
              className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow"
            >
              <p className="font-semibold">
                Address {index + 1}:{" "}
                <span className="font-normal">{addr.address}</span>
              </p>
              <p className="font-semibold">
                Private Key {index + 1}:
                <span className="font-normal">
                  {showPrivateKey[index]
                    ? addr.privateKey
                    : "•••••••••••••••••••••••••••••••••••"}
                  <button
                    onClick={() => togglePrivateKeyVisibility(index)}
                    className="ml-2 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    {showPrivateKey[index] ? (
                      <EyeOffIcon className="h-5 w-5 text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </span>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="py-4 text-center">
        <span>Built with ❤️ by </span>
        <a
          href="https://twitter.com/99promitsaha"
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 hover:text-purple-800"
        >
          99promitsaha
        </a>
      </div>
    </div>
  );
}

export default App;