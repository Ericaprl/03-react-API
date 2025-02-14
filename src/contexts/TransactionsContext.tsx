import { ReactNode, useCallback, useEffect, useState } from "react"
import { api } from "../lib/axios"
import { createContext } from "use-context-selector";


interface Transaction {
  id: number,
  description: string,
  type: 'income' | 'outcome',
  price: number,
  category: string,
  createdAt: string,
}

interface CreateTransationInput{
  description: string,
  type: 'income' | 'outcome',
  price: number,
  category: string,
}

// para passar as informacoes que esse context vai mandar ou receber 
interface TransactionContextType {
  transactions: Transaction[];
  fetchTransactions: (query?: string) => Promise<void>;
  createTransaction:(data: CreateTransationInput) => Promise<void>;

}
export const TransactionsContext = createContext({} as TransactionContextType);

interface TransactionProviderProps {
  children: ReactNode;
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      }
    });
    setTransactions(response.data);
  },
  []
)


  // async function fetchTransactions(query?: string) {
  //   const response = await api.get('transactions', {
  //     params: {
  //       _sort: 'createdAt',
  //       _order: 'desc',
  //       q: query,
  //     }
  //   });
  //   setTransactions(response.data);
  // }


  // async function createTransaction(data: CreateTransationInput) {
  //   const {description, category, price, type} = data;

  //   const response = await api.post('transactions', {
  //     description,
  //     category,
  //     price,
  //     type,
  //     createdAt: new Date(),
  //   })
  //   setTransactions(state =>[response.data,...state]);
  // }


  const createTransaction = useCallback(async (data: CreateTransationInput) => {
    const {description, category, price, type} = data;

    const response = await api.post('transactions', {
      description,
      category,
      price,
      type,
      createdAt: new Date(),
    })
    setTransactions(state =>[response.data,...state]);
    },
    //array de dependencias igual useeffect 
    [],
  )


  useEffect(() => {
    fetchTransactions();
  }, [])

  return (
    <TransactionsContext.Provider value={{
      transactions, 
      fetchTransactions,
      createTransaction
    }}>
      {children}
    </TransactionsContext.Provider>
  )
}



