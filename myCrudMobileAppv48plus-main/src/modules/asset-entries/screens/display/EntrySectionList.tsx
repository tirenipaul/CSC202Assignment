import React from 'react';
import { View, SectionList, StyleSheet } from 'react-native';
import { Text } from '@rneui/base';
import EntrySectionListItem from './EntrySectionListItem';
import { EntriesInDateSections } from '../../types/definitions';


type Props = {
    entriesInDateSections: EntriesInDateSections[] //array of entries
}

const EntrySectionList: React.FC<Props> = ({ entriesInDateSections }) => {

    return (
        <SectionList
            style={{ width: '100%', padding: 3, backgroundColor: 'lightgreen' }}
            sections={entriesInDateSections}
            keyExtractor={(item, index) => item + index.toString()}
            renderItem={({ item }) => (
                <EntrySectionListItem item={item} />
            )}
            renderSectionHeader={({ section: { title } }) => (
                <Text style={styles.header}>{title}</Text>
            )}


            ListHeaderComponent={
                () => (
                    <View>
                        <Text h4 style={[styles.inputContainerStyle, { backgroundColor: "lightblue" }]}>Entries found by date...</Text>
                    </View>
                )}

            ItemSeparatorComponent={
                //this component will be rendered in between items
                () => {
                    return (<View style={{ backgroundColor: '#ccc', height: 3, width: '100%' }} />)
                }
            }
        />

    )

}

EntrySectionList.defaultProps = {
    entriesInDateSections: []
}

export default EntrySectionList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'lightgreen',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: { fontSize: 16, color: 'black' },
    inputContainerStyle: {
        width: '100%',
        padding: 6
    },
    header: {
        fontSize: 16,
        backgroundColor: "#eee",
        padding: 3
    }
});
