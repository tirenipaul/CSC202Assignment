import moment from "moment";
import React from "react";
import { DataSource, Repository } from "typeorm/browser";
import { TransactionEntry } from "../entities/transaction-entry.entity";
import { EntriesInDateSections, ITransactionEntry } from "../types/definitions";

//prepare the function that will getTransactionEntries
export const getTransactionEntries = async (dataSource: DataSource, setTransactionEntries: React.Dispatch<React.SetStateAction<TransactionEntry[]>>) => {
    try {
        const transactionEntryRepository: Repository<TransactionEntry> = dataSource.getRepository(TransactionEntry);
        let transactionEntries = await transactionEntryRepository.find();
        setTransactionEntries(transactionEntries);
    } catch (error) {
        setTransactionEntries([]); //None available due to error
    }
}

export const createTransactionEntry = async (dataSource: DataSource, transactionEntryData: TransactionEntry, transactionEntriesInState: TransactionEntry[], setTransactionEntries: React.Dispatch<React.SetStateAction<TransactionEntry[]>>, navigation: {navigate: Function}) => {
    
    try {
        const transactionEntryRepository: Repository<TransactionEntry> = dataSource.getRepository(TransactionEntry);
        const newTransactionEntry = transactionEntryRepository.create(transactionEntryData);
        const transactionEntry = await transactionEntryRepository.save(newTransactionEntry);
        //time to modify state after create
        const transactionEntries = transactionEntriesInState;
        transactionEntries.push(transactionEntry);
        setTransactionEntries([...transactionEntries]);
        navigation.navigate('TransactionEntryHomeScreen',{})//adding the second argument forces the destination to update immediately
    } catch (error) {
        console.log(error);
    }
};

export const updateTransactionEntry = async (dataSource: DataSource, updatedTransactionEntryData: TransactionEntry, transactionEntriesInState: TransactionEntry[], setTransactionEntries: React.Dispatch<React.SetStateAction<TransactionEntry[]>>, navigation: {navigate: Function}) => {
    const {id, ...otherFields} = updatedTransactionEntryData;
    
    try {
        const transactionEntryRepository: Repository<TransactionEntry> = dataSource.getRepository(TransactionEntry);
        await transactionEntryRepository.update(id, otherFields);
        
        //adjust entry in state
        const currentEntries = transactionEntriesInState;
        //find the index corresponding to the item with the passed id
        const index = currentEntries.findIndex((entry) => entry.id === id);
        //replace with new data
        currentEntries[index] = updatedTransactionEntryData;
        
        //update state with the updated
        setTransactionEntries([...currentEntries]);
        navigation.navigate('TransactionEntryHomeScreen',{})//adding the second argument forces the destination to update immediately
    } catch (error) {
        console.log(error);
    }
}

export const deleteTransactionEntry = async (dataSource: DataSource, id: number, transactionEntriesInState: TransactionEntry[], setTransactionEntries: React.Dispatch<React.SetStateAction<TransactionEntry[]>>) => {
    try {
        const transactionEntryRepository: Repository<TransactionEntry> = dataSource.getRepository(TransactionEntry);
        await transactionEntryRepository.delete(id);
        //remove entry from state
        const currentEntries = transactionEntriesInState;
        //find the index corresponding to the item with the passed id
        const index = currentEntries.findIndex((entry) => entry.id === id);
        currentEntries.splice(index, 1);//remove one element starting from the index position. This is removing the element itself
        //update state with the spliced currentItems
        setTransactionEntries([...currentEntries]);
    } catch (error) {
        console.log(error);
    }
};

/**
     * Function below is called in useMemo hook to transform the entries list to that suitable for a section list in accordance with dates.
     * useMemo has been set to run only when entries in state changes.
     * First, ...new Set is used to iterate through data and get the unique dates. Afterwards it iterates through
     * unique dates and associates the matching entries in groups of dates.
     * @param entries 
     */
 export const transformEntriesToDateSections = (entries: ITransactionEntry[]): EntriesInDateSections[] => {
    //first get distinct txnDates in entry. See https://codeburst.io/javascript-array-distinct-5edc93501dc4 for ideas on how to use ...new Set
    const distinctTxnDates = [...new Set(entries.map(entry => {
      const txnDate = moment([entry.txnYear!, entry.txnMonth!, entry.txnDay!]).format('LL');
      return txnDate;
    }))];

    //map through distinctTxnDates and then map through entries each time to compare dates and date sections with date as title and then the data
    const entryByDates: EntriesInDateSections[] = distinctTxnDates.map((distinctTxnDate) => {

      let dataOnTxnDate: ITransactionEntry[] = [];
      entries.map((entry) => {
        const txnDate = moment([entry.txnYear!, entry.txnMonth!, entry.txnDay!]).format('LL');
        if (txnDate == distinctTxnDate) {
          dataOnTxnDate.push(entry)
        }
      })
      return { title: distinctTxnDate, data: dataOnTxnDate }

    });
    return entryByDates;
  }
