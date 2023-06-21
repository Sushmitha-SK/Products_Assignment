import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Products from './screens/Products';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Products'
          component={Products}
          options={
            { headerShown: false }
          } />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
