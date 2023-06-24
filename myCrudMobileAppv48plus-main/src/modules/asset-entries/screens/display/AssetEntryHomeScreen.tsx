import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { DisplayOptions } from '../../types/definitions';
import { transformEntriesToDateSections } from '../../services/asset-entry.service';
import EntryFlatList from './EntryFlatList';
import Spreadsheet from './Spreadsheet';
import { AssetEntryContext } from '../../contexts/Contexts';
import EntrySectionList from './EntrySectionList';
import { AssetEntry } from '../../entities/asset-entry.entity';

import { Icon, SearchBar } from "@rneui/themed";
import { Text } from '@rneui/base';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';

const AssetEntryHomeScreen: React.FC = () => {

    const assetEntryContext = useContext(AssetEntryContext);
    const navigation = useNavigation();
    const {
        assetEntries,
        settings
    } = assetEntryContext!

    //TODO List search implementation following https://snack.expo.dev/@aboutreact/example-of-search-bar-in-react-native
    //Prepare the filtered entry to be displayed. Initialize with assetEntries in context.
    //SearchFilter will do the rest
    const [filteredAssetEntries, setFilteredAssetEntries] = useState<AssetEntry[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setFilteredAssetEntries(assetEntries)
    }, [assetEntries])

    const searchFilterFunction = useCallback((text: string) => {

        // Check if searched text is not blank
        if (text) {
            // Inserted text is not blank
            // Filter the assetEntries and Update filteredAssetEntries
            const newData = assetEntries.filter((item) => {
                //Check fields for occurrence
                //I am using formatted Date in combined fields below so as to allow for search of month in word
                const combinedFields = `${item.description} ${item.value} ${item.acquireMonth + 1} ${moment([item.acquireYear, item.acquireMonth, item.acquireDay]).format("LL")}`;
                const itemData = combinedFields
                    ? combinedFields.toUpperCase()
                    : ''.toUpperCase();
                const textData = text.toUpperCase();

                return itemData.indexOf(textData) > -1; //returns true if search text is found in the description
            });
            setFilteredAssetEntries(newData);
            setSearch(text);
        } else {
            // Inserted text is blank
            // Update filteredAssetEntries with assetEntries
            setFilteredAssetEntries(assetEntries);
            setSearch(text);
        }
    }, [assetEntries]);
    /**
   * Use memoized called to transform entries to date sections. 
   * As it is a complex operation, it is good to memoize it and
   * give condition in square bracket under which the function
   * will rerun
   */
    const getEntriesInDateSections = useMemo(() => {
        return transformEntriesToDateSections(filteredAssetEntries)
    }, [filteredAssetEntries]);//only run anew if entries in state change

    /**
       * Check choice of display and prepare entries for display
       */

    const displayEntries = () => {
        switch (settings) {
            case DisplayOptions.FLAT_LIST: return <EntryFlatList entries={filteredAssetEntries} />
            case DisplayOptions.SPREADSHEET: return <Spreadsheet entries={filteredAssetEntries} />
            default: return <EntrySectionList entriesInDateSections={getEntriesInDateSections!} />
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ marginBottom: 0 }}>
                <SearchBar
                    round
                    searchIcon={{ size: 24 }}
                    placeholder="Type here..."
                    value={search}
                    containerStyle={{ backgroundColor: 'lightgreen' }}
                    onChangeText={(text) => searchFilterFunction(text)}
                />
            </View>
            {/* Display entries as already predetermined in the function defined before return above, named displayEntries. Check it out again */}
            {displayEntries()}
            <TouchableOpacity
                style={{ height: 20, alignSelf: 'flex-end', top: -20 }}
                onPress={() => navigation.navigate("AddEntryScreen" as never)}>
                <Text><Icon
                    name="add"
                    color="green"
                    size={20}
                    raised={true}
                /></Text>
            </TouchableOpacity>
        </View>
    );
}

export default AssetEntryHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        padding: 3
    }
});
