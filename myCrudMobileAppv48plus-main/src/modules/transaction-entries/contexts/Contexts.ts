import { createContext } from "react";
import { DataSource } from "typeorm/browser";
import { TransactionEntry } from "../entities/transaction-entry.entity";
import { DisplayOptions } from "../types/definitions";

export type TransactionEntryContextType = {
    dataSource: DataSource,
    transactionEntries: TransactionEntry[],
    settings: DisplayOptions,
    createEntry: Function,
    updateEntry: Function,
    deleteEntry: Function,
    handleSetDisplayOption: Function,
}

//create context to use to pass values down, instead of props
export const TransactionEntryContext = createContext<TransactionEntryContextType | null>(null);
