import { useContext } from "react";
import { TransactionsContext } from "../contexts/TransactionsContext";
// esse 'e o hooks proprio 
export function useSummary() {
    const { transactions  } = useContext(TransactionsContext);

    //{ income: 0 outcoe:0 total:0} eu preciso reduzer o meu array a essas sintasex o primeiro parametro 'e um funcao e o segunda o que deseja 
    const summary = transactions.reduce(
        (acc, transaction) => {
            const price = Number(transaction.price);
          if (transaction.type === 'income') {
            acc.income += price;
            acc.total += price;
          } else {
            acc.outcome += price;
            acc.total -= price;
          }
          return acc;
        },
        {
        income: 0,
          outcome: 0,
          total:  0,
        },
      );

      return summary;
}

