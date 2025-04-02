import "react-native-gesture-handler";

import React from 'react';
import { Provider } from "react-redux";
import { store } from "./src/store";
import MainStack from "./src/navigationStack/MainStack";
import Toast from 'react-native-toast-message';


function App(): React.JSX.Element {

  return (
    <Provider store={store}>
      <MainStack />
      <Toast />
    </Provider>
  );
}

export default App;
