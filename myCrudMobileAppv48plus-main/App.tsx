//import 'reflect-metadata';
import React from 'react';
import TransactionEntryLanding from './src/modules/transaction-entries/TransactionEntryLanding';
import { Icon, Text } from '@rneui/base';
import useCachedResources from './src/global/hooks/useCachedResources';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import AssetEntryLanding from './src/modules/asset-entries/AssetEntryLanding';

const App: React.FC = () => {

  //Using useCachedResources for dataSource loading, while splash screen is on.
  const { isLoadingComplete, dataSource } = useCachedResources();

  const Tab = createBottomTabNavigator();

  //Create the tab navigator props
  //below are some optional props that can be passed to Tab.Navigator. You can try the code with and without options
  const tabProps = {
    initialRouteName: 'TransactionEntryLandingScreen',
    screenOptions: {
      lazy: true, //default is true
      activeTintColor: 'green',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: '#eee',
      },
      backBehavior: 'history'//Behaviour when system back is touched. Options are none, initialRoute, order, history. This seems to be buggy
    }
    
  }

  const TabNavigator = () =>
  (
    <Tab.Navigator {...tabProps}>
      <Tab.Screen
        name="TransactionEntryLandingScreen"
        children={() => <TransactionEntryLanding dataSource={dataSource!}/>}
        options={{
          title: 'Transaction Manager',
          tabBarActiveBackgroundColor: 'transparent',
          tabBarActiveTintColor: 'darkblue',
          headerShown: false,
          tabBarLabel: 'Transaction',
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="receipt-long"
              color={color}
              size={size}
            />
          )
        }}
      />
      <Tab.Screen
        name="AssetEntryLandingScreen"
        children={() => <AssetEntryLanding dataSource={dataSource!}/>}
        options={{
          title: "Asset Manager",
          headerShown: false,
          tabBarLabel: 'Asset',
          tabBarActiveTintColor: 'darkgreen',
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="inventory"
              color={color}
              size={size}
            />
          )
        }}
      />
    </Tab.Navigator>
  )


  //Prepare our conditional display. What we display will depend on whether dataSource is available or not
  const Display = () => {
    if (dataSource) {
      return (

        <NavigationContainer>
          <TabNavigator />
        </NavigationContainer>
      )
    } else {
      return (
        <Text>
          Cannot get data source
        </Text>
      )
    }
  }

  //Check if loading is complete before returning a view
  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <>
        <Display />
        {/* Below is just a footer message */}
        {/*<Text style={{ padding: 6, fontSize: 14, fontStyle: "italic", textAlign: 'center' }}>Copyright: Pius Onobhayedo</Text>*/}
      </>
    );
  }
}

export default App;