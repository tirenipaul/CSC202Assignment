import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Badge, Icon, Text } from '@rneui/base';

import EntryFlatListItem from './EntryFlatListItem';
import { IAssetEntry } from '../../types/definitions';

import { parse } from 'json2csv';



type Props = {
    entries: IAssetEntry[] | [] //array of entries
}

const EntryFlatList: React.FC<Props> = ({ entries }) => {


    const onShare = async () => {
        try {
            
            //share as csv
            //strip off id before sharing
            const entriesToShare = entries.map((entry, key) => {
                const { id, ...restOfEntry } = entry;
                //putting serial number first
                const entryWithSerialNumber: IAssetEntry = { SN: key + 1 } as never
                Object.assign(entryWithSerialNumber, restOfEntry)
                return entryWithSerialNumber;
            })

            const result = await Share.share({
                message: parse(entriesToShare),
                title: 'Entries in CSV format',
            }, { dialogTitle: 'Entries in CSV format' });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            alert(error.message);
        }
    };

    return (
        <FlatList
            style={{ width: '100%', padding: 3, backgroundColor: 'lightgreen' }}
            data={entries}
            renderItem={({ item }) => (
                <EntryFlatListItem item={item} />
            )}
            ListHeaderComponent={
                () => (
                    <View style={[styles.inputContainerStyle, { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: "lightblue" }]}>
                        <Text h3>Entries so far... <Badge status="primary" value={entries.length} /></Text>
                        <TouchableOpacity
                            style={{ height: 20, top: -9 }}
                            onPress={onShare}>
                            <Icon
                                name="share"
                                color="green"
                                size={15}
                                raised={true}
                            />
                        </TouchableOpacity>

                    </View>
                )}

            keyExtractor={(item, index) => index.toString()}
            ItemSeparatorComponent={
                //this component will be rendered in between items
                () => {
                    return (<View style={{ backgroundColor: '#ccc', height: 3, width: '100%' }} />)
                }
            }
        />
    )
}

EntryFlatList.defaultProps = {
    entries: []
}

export default EntryFlatList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgreen',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: { fontSize: 16, color: 'black' },
    inputContainerStyle: {
        width: '100%',
        padding: 6
    }
});