import * as Dialog from '@radix-ui/react-dialog';
import { CloseButton, Content, Overlay, TransactionType, TransactionTypeButton } from './styles';
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransactionsContext } from '../../contexts/TransactionsContext';
import { useContextSelector } from 'use-context-selector';

const newTransactionFormSchema = z.object({
  description: z.string(),
  category: z.string(),
  price:z.number(),
  type: z.enum(['income','outcome']),
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>;


export function NewTransactionModal() {

  // subistitui o useContextpelo useContextSelector e passa uma funcao, e dentro da funcao qual context que vai ser monitorado. dessa forma nao 
  // vai renderizer todas as informacoes 
  // const {createTransaction} = useContext(TransactionsContext);

  const createTransaction = useContextSelector(TransactionsContext, (context)=> {
    return context.createTransaction;
  })
  
  
  const {control, register, handleSubmit,formState: { isSubmitting }, reset} = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
    defaultValues: {
      type:'income',
    }
  })

  async function handleCreateNewTransaction(data: NewTransactionFormInputs){
    const {description, category, price, type} = data;
    await createTransaction({
      description, 
      category, 
      price, 
      type,
    })
   
    reset();
  }

  return (
    <Dialog.Portal>
    <Overlay/>

    <Content>
      <Dialog.Title>New Transactions</Dialog.Title>
      <CloseButton>
        <X size={24}/>
      </CloseButton>
        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
            <input type="text" placeholder='Description' required {...register('description')}/>
            <input type="number" placeholder='Price' required {...register('price',{valueAsNumber: true})} />
            <input type="text" placeholder='Category' required {...register('category')}  />

            <Controller
            control={control}
            name='type'
            render={({field}) =>{
              return(
                <TransactionType onValueChange={field.onChange} value={field.value}>
                <TransactionTypeButton variant='income' value='income'>
                  <ArrowCircleUp size={24}/>
                    In
                </TransactionTypeButton>
                <TransactionTypeButton variant='outcome' value='outcome'>
                  <ArrowCircleDown size={24}/>
                   Out
                </TransactionTypeButton>
            </TransactionType>
              )
            }}/>

          

            <button type='submit' disabled={isSubmitting}>Register</button>
        </form>

    </Content>
  </Dialog.Portal>
  )
}
