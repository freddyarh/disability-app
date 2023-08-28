import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useWindowDimensions } from 'react-native';
import Clients from '../screens/Clients';


const Drawer = createDrawerNavigator();
// const Stack = createNativeStackNavigator();

function DrawerNavigator2() {

    const dimensions = useWindowDimensions();

    const isLargeScreen = dimensions.width >= 768;

  return (
    // <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />}>
    <Drawer.Navigator
      defaultStatus="open"
      screenOptions={{
        drawerType: isLargeScreen ? 'permanent' : 'back',
        drawerStyle: isLargeScreen ? null : { width: '100%' },
        overlayColor: 'transparent',
      }}
    >
      <Drawer.Screen 
        name={ "Client" } 
        component={ Clients }
        options={{
          title: 'Clients',
          headerTintColor: "white",
          headerStyle: {
              backgroundColor: "blue",
          },
        }}
        />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator2;