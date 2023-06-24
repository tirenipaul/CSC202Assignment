import moment from "moment";
import React from "react";
import { DataSource, Repository } from "typeorm/browser";
import { AssetEntry } from "../entities/asset-entry.entity";
import { EntriesInDateSections, IAssetEntry } from "../types/definitions";

//prepare the function that will getAssetEntries
export const getAssetEntries = async (dataSource: DataSource, setAssetEntries: React.Dispatch<React.SetStateAction<AssetEntry[]>>) => {
    try {
        const assetEntryRepository: Repository<AssetEntry> = dataSource.getRepository(AssetEntry);
        let assetEntries = await assetEntryRepository.find();
        setAssetEntries(assetEntries);
    } catch (error) {
        setAssetEntries([]); //None available due to error
    }
}

export const createAssetEntry = async (dataSource: DataSource, assetEntryData: AssetEntry, assetEntriesInState: AssetEntry[], setAssetEntries: React.Dispatch<React.SetStateAction<AssetEntry[]>>, navigation: {navigate: Function}) => {
    
    try {
        const assetEntryRepository: Repository<AssetEntry> = dataSource.getRepository(AssetEntry);
        const newAssetEntry = assetEntryRepository.create(assetEntryData);
        const assetEntry = await assetEntryRepository.save(newAssetEntry);
        //time to modify state after create
        const assetEntries = assetEntriesInState;
        assetEntries.push(assetEntry);
        setAssetEntries([...assetEntries]);
        navigation.navigate('AssetEntryHomeScreen',{})//adding the second argument forces the destination to update immediately
    } catch (error) {
        console.log(error);
    }
};

export const updateAssetEntry = async (dataSource: DataSource, updatedAssetEntryData: AssetEntry, assetEntriesInState: AssetEntry[], setAssetEntries: React.Dispatch<React.SetStateAction<AssetEntry[]>>, navigation: {navigate: Function}) => {
    const {id, ...otherFields} = updatedAssetEntryData;
    
    try {
        const assetEntryRepository: Repository<AssetEntry> = dataSource.getRepository(AssetEntry);
        await assetEntryRepository.update(id, otherFields);
        
        //adjust entry in state
        const currentEntries = assetEntriesInState;
        //find the index corresponding to the item with the passed id
        const index = currentEntries.findIndex((entry) => entry.id === id);
        //replace with new data
        currentEntries[index] = updatedAssetEntryData;
        
        //update state with the updated
        setAssetEntries([...currentEntries]);
        navigation.navigate('AssetEntryHomeScreen',{})//adding the second argument forces the destination to update immediately
    } catch (error) {
        console.log(error);
    }
}

export const deleteAssetEntry = async (dataSource: DataSource, id: number, assetEntriesInState: AssetEntry[], setAssetEntries: React.Dispatch<React.SetStateAction<AssetEntry[]>>) => {
    try {
        const assetEntryRepository: Repository<AssetEntry> = dataSource.getRepository(AssetEntry);
        await assetEntryRepository.delete(id);
        //remove entry from state
        const currentEntries = assetEntriesInState;
        //find the index corresponding to the item with the passed id
        const index = currentEntries.findIndex((entry) => entry.id === id);
        currentEntries.splice(index, 1);//remove one element starting from the index position. This is removing the element itself
        //update state with the spliced currentItems
        setAssetEntries([...currentEntries]);
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
 export const transformEntriesToDateSections = (entries: IAssetEntry[]): EntriesInDateSections[] => {
    //first get distinct txnDates in entry. See https://codeburst.io/javascript-array-distinct-5edc93501dc4 for ideas on how to use ...new Set
    const distinctTxnDates = [...new Set(entries.map(entry => {
      const acquireDate = moment([entry.acquireYear!, entry.acquireMonth!, entry.acquireDay!]).format('LL');
      return acquireDate;
    }))];

    //map through distinctTxnDates and then map through entries each time to compare dates and date sections with date as title and then the data
    const entryByDates: EntriesInDateSections[] = distinctTxnDates.map((distinctTxnDate) => {

      let dataOnTxnDate: IAssetEntry[] = [];
      entries.map((entry) => {
        const acquireDate = moment([entry.acquireYear!, entry.acquireMonth!, entry.acquireDay!]).format('LL');
        if (acquireDate == distinctTxnDate) {
          dataOnTxnDate.push(entry)
        }
      })
      return { title: distinctTxnDate, data: dataOnTxnDate }

    });
    return entryByDates;
  }
