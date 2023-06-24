import { createContext } from "react";
import { DataSource } from "typeorm/browser";
import { AssetEntry } from "../entities/asset-entry.entity";
import { DisplayOptions } from "../types/definitions";

export type AssetEntryContextType = {
    dataSource: DataSource,
    assetEntries: AssetEntry[],
    settings: DisplayOptions,
    createEntry: Function,
    updateEntry: Function,
    deleteEntry: Function,
    handleSetDisplayOption: Function,
}

//create context to use to pass values down, instead of props
export const AssetEntryContext = createContext<AssetEntryContextType | null>(null);
