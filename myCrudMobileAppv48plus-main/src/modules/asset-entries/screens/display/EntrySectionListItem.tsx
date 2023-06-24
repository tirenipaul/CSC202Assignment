import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { ButtonGroup, Text, Button, Icon } from '@rneui/base';
import { showDeleteConfirmation } from '../../../../global/tools/show-alert';
import { IAssetEntry } from '../../types/definitions';
import { AssetEntryContext } from '../../contexts/Contexts';
import { useNavigation } from '@react-navigation/native';


type Props = {
    item: IAssetEntry;
}

const EntrySectionListItem: React.FC<Props> = ({ item }) => {

    const assetEntryContext = useContext(AssetEntryContext);
    
    const navigation = useNavigation();
    
    const { deleteEntry } = assetEntryContext!
    
    return (
        <View style={styles.inputContainerStyle}>
            <Text style={{ fontSize: 18 }}>Tangible?: {item.tangible ? "No" : "Yes"}</Text>
            <Text style={{ fontSize: 18 }}>Description: {item.description}</Text>
            <Text style={{ fontSize: 18 }}>Value: {item.value}</Text>
            <ButtonGroup
                containerStyle={{ backgroundColor: 'transparent', width: '40%', borderColor: 'transparent' }}
                buttons={
                    [<Button
                        icon={<Icon
                            name="edit"
                            color="green"
                        />}
                        type="clear"
                        title="Edit"
                        titleStyle={{ fontSize: 15 }}
                        onPress={() => navigation.navigate("EditEntryScreen" as never,{assetEntryToEdit: item} as never)}
                    />,
                    <Button
                        icon={<Icon
                            name="delete"
                            color="red"
                        />}
                        type="clear"
                        title="Delete"
                        titleStyle={{ fontSize: 15 }}
                        onPress={() => {
                            //deleteEntry(item.id!)
                            showDeleteConfirmation(
                                "About to Delete",
                                "Are you sure that you want to delete this entry?",
                                item.id!,
                                deleteEntry
                            )
                        }}
                    />
                    ]
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainerStyle: {
        width: '100%',
        padding: 9
    }
});

export default EntrySectionListItem;