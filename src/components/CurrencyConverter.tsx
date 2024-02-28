import { useMemo, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import { Select, SelectOption } from "./Select";

interface CurrencyTransactionData {
  from: string;
  to: string;
  amount: number;
}

const DEFAULT_CURRENCY_TRANSACTION_DATA: CurrencyTransactionData = {
  amount: 1,
  from: "PLN",
  to: "EUR",
};

interface Rates {
  [key: string]: number;
}

const useExchangeRate = (currency: string) => {
  return useFetch<Rates>(
    `https://api.exchangerate-api.com/v4/latest/${currency}`,
  );
};

export const CurrencyConverter = () => {
  const [currencyTransactionData, setCurrencyTransactionData] = useState(
    DEFAULT_CURRENCY_TRANSACTION_DATA,
  );

  const { isPending, error, data } = useExchangeRate(currencyTransactionData.from);

  const changeCurrencyType =
    (direction: "from" | "to") => (currency: string) => {
      setCurrencyTransactionData((prev) => ({
        ...prev,
        [direction]: currency,
      }));
    };

  const convertedAmount = useMemo(() => {
    const rate = data?.[currencyTransactionData.to] ?? 0;
    return (currencyTransactionData.amount * rate).toFixed(2);
  }, [currencyTransactionData.amount, currencyTransactionData.to, data]);

  const changeAmount = (amount: string) => {
    setCurrencyTransactionData((prev) => ({
      ...prev,
      amount: amount ? parseFloat(amount) : 0,
    }));
  };

  const swapCurrencies = () => {
    setCurrencyTransactionData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const currencyOptions: SelectOption[] = useMemo(() => {
    if (!data) {
      return [];
    }

    return Object.keys(data).map((currency) => ({
      label: currency,
      value: currency,
    }));
  }, [data]);

  return (
    <div>
      {isPending && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data && (
        <div>
          <div>
            <Select
              options={currencyOptions}
              value={currencyTransactionData.from}
              onChange={changeCurrencyType("from")}
              label="From:"
            />
            <input
              type="number"
              min="0"
              className="margin-left"
              value={currencyTransactionData.amount}
              onChange={(e) => {
                changeAmount(e.target.value);
              }}
            />
          </div>
          <div>
            <Select
              options={currencyOptions}
              value={currencyTransactionData.to}
              onChange={changeCurrencyType("to")}
              label="To:"
            />
          </div>
          <div className="result-container">
            <h3>Result:</h3>
            <p className="margin-left">
              {currencyTransactionData.amount} {currencyTransactionData.from} ={" "}
              {convertedAmount} {currencyTransactionData.to}
            </p>
          </div>
          <button onClick={swapCurrencies}>Swap Currencies</button>
        </div>
      )}
    </div>
  );
};