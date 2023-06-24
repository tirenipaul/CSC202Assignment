import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DataSource } from 'typeorm/browser';
import { AssetEntry } from './entities/asset-entry.entity';
import { createAssetEntry, deleteAssetEntry, getAssetEntries, updateAssetEntry } from './services/asset-entry.service';
import { AppStackParamList, DisplayOptions } from './types/definitions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddEntry from './screens/add/AddEntry';
import Settings from './screens/settings/Settings';

/** 
 * Import createStackNavigator that we will use to create the stack navigator for the home page
 We shall see below how they are used
 */
import { createStackNavigator } from '@react-navigation/stack';
/** 
 * Import NavigationContainer that we will use to wrap the stack we will create.
See in App component below how it is used
 */
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AssetEntryHomeScreen from './screens/display/AssetEntryHomeScreen';
import { AssetEntryContext } from './contexts/Contexts';
import { Button, Icon } from '@rneui/base';
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu';
import EditEntry from './screens/edit/EditEntry';


//Create the Stack object
const Stack = createStackNavigator<AppStackParamList>();

//Prepare the App Stack with the Screens
const AppStack = () => {

    const navigation = useNavigation();

    /**
     * Indicate whether menu should be visble or not.
     */
    const [menuVisible, setMenuVisible] = useState(false);

    /**
     * Monitor active menuitem so as to disable during menu show
     */
    const [activeMenuItem, setActiveMenuItem] = useState('');

    /**
     * Called to display menu based on https://github.com/mxck/react-native-material-menu
     * @returns 
     */
    const toggleMenu = () => {

        return (
            <View style={{ height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Menu
                    visible={menuVisible}
                    anchor={<Button
                        icon={<Icon
                            name='more-vert' //The icon named more-vert is for vertical three dots. //To know names of available icons, check https://fonts.google.com/icons?selected=Material+Icons&icon.query=do as rne (react-native-elements) is using material icons
                            color='black'
                            size={30}
                        />}
                        type="clear"
                        onPress={() => setMenuVisible(true)}
                    />}
                    onRequestClose={() => setMenuVisible(false)}
                    style={{ backgroundColor: 'lightgreen' }}
                >
                    <MenuItem
                        onPress={() => {
                            navigation.navigate('AddEntryScreen' as never);
                            setMenuVisible(false);
                        }}
                        pressColor="#ddd"
                        disabled={activeMenuItem === "AddEntryScreen"}
                        disabledTextColor='#bdbdbd'
                        style={{ padding: 3 }}
                    >
                        <Icon
                            name="add"
                            color="green"
                            size={20}
                        /> Add Entry
                    </MenuItem>

                    <MenuDivider />

                    <MenuItem
                        onPress={() => {
                            navigation.navigate('SettingsScreen' as never);
                            setMenuVisible(false);
                        }}
                        pressColor="#ddd"

                        disabled={activeMenuItem === "SettingsScreen"}
                        disabledTextColor='#bdbdbd'
                        style={{ padding: 3 }}
                    >
                        <Icon
                            name="settings"
                            color="green"
                            size={20}
                        /> Settings
                    </MenuItem>
                </Menu>
            </View>
        );
    }


    return (
        <Stack.Navigator //this red will disappear in later versions of @react/types. Do not worry about it.
            initialRouteName='AssetEntryHomeScreen'

            screenOptions={{
                headerMode: 'screen',
                presentation: 'card',
                keyboardHandlingEnabled: true,
                headerStyle: {
                    backgroundColor: 'lightgreen',
                    height: 90
                },
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 18,
                    //fontFamily: 'space-mono'
                },
                title: "Personal Assets",
                //Below can be overriden at the level of stack.screen
                headerRight: () => (
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={styles.logo}
                            onPress={() => navigation.navigate('AssetEntryHomeScreen' as never)}>
                            <Image style={styles.logo}
                                source={require('../../../assets/pau-logo-blue-transparent-background.png')}
                            />
                        </TouchableOpacity>
                        {toggleMenu()}
                    </View>
                ),
                headerTitleAlign: 'center'
                //There are other possibilities. See https://reactnavigation.org/docs/stack-navigator
            }} >
            <Stack.Screen name="AssetEntryHomeScreen" component={AssetEntryHomeScreen}
                options={{ //override here, the general value in screenOptions above.
                    headerTitleAlign: 'left', 
                    headerTitleStyle: {
                        fontSize: 21,
                    }
                }}
            //there are other possibilities, see https://reactnavigation.org/docs/screen
            />
            <Stack.Screen name="AddEntryScreen" component={AddEntry}
                options={{
                    title: 'Add Entry'
                }}
                listeners={{
                    focus: () => {
                        setActiveMenuItem("AddEntryScreen");
                    },
                    beforeRemove: () => {
                        setActiveMenuItem('')
                    }
                }} />
            <Stack.Screen name="EditEntryScreen" component={EditEntry}
                options={{
                    title: 'Edit Entry'
                }}
            />
            <Stack.Screen name="SettingsScreen" component={Settings}
                options={{
                    title: 'Settings'
                }}
                listeners={{
                    focus: () => {
                        setActiveMenuItem("SettingsScreen");
                    },
                    beforeRemove: () => {
                        setActiveMenuItem('')
                    }
                }} />
        </Stack.Navigator>

    )
}

//Parent App is expected to pass the dataSource to this Landing for AssetEntry module
type Props = {
    dataSource: DataSource;
}

const AssetEntryLanding: React.FC<Props> = ({ dataSource }) => {

    //As usual, we need to state manage
    const [assetEntries, setAssetEntries] = useState<AssetEntry[]>([]);

    //for settings. Better to use objects in state for multiple settings. Change this later to {} when there are more settings.
    const [settings, setSettings] = useState<DisplayOptions>(DisplayOptions.SECTION_LIST_BY_DATE)

    /**
   * Function to create a new entry
   * @param assetEntryData 
   */
    const createEntry = (assetEntryData: AssetEntry, navigation: { navigate: Function }) => {
        createAssetEntry(dataSource, assetEntryData, assetEntries, setAssetEntries, navigation);
    }

    /**
   * Function to edit an  entry
   * @param editedAssetEntryData
   */
    const updateEntry = (editedAssetEntryData: AssetEntry, navigation: { navigate: Function }) => {
        updateAssetEntry(dataSource, editedAssetEntryData, assetEntries, setAssetEntries, navigation);
    }

    /**
     * Function called to delete an Entry
     * @param id 
     */
    const deleteEntry = (id: number) => {
        deleteAssetEntry(dataSource, id, assetEntries, setAssetEntries);
    }

    const handleSetDisplayOption = (displayOption: DisplayOptions) => {
        setSettings(displayOption)
    }

    const getDisplayOption = async () => {
        try {
            const value = await AsyncStorage.getItem('displayOption');
            if (value !== null) {
                // value previously stored
                setSettings(parseInt(value))
            } else {
                //return default option
                setSettings(DisplayOptions.SECTION_LIST_BY_DATE)
            }
        } catch (e) {
            // error reading value
        }
    }

    /*Memoize to ensure non-repetitive loading of function */
    const setDisplayOption = useCallback(() => getDisplayOption(), []);

    useEffect(() => {
        getAssetEntries(dataSource, setAssetEntries);
        setDisplayOption();
    }, [])//run once


    return (
        <NavigationContainer independent={true}>
            <AssetEntryContext.Provider value={{
                dataSource,
                assetEntries,
                settings,
                createEntry,
                updateEntry,
                deleteEntry,
                handleSetDisplayOption
            }
            }>
                <AppStack />
            </AssetEntryContext.Provider>
        </NavigationContainer >

    );
}

const styles = StyleSheet.create({
    logo: {
        width: 30,
        height: 30,
        //marginLeft: 6
        alignSelf: 'center' //aligned in column direction as the wrapper is row direction
    }
});

export default AssetEntryLanding;
