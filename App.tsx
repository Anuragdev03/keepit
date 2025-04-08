import "react-native-gesture-handler";
import 'react-native-get-random-values';

import React from 'react';
import { Provider } from "react-redux";
import { store } from "./src/store";
import MainStack from "./src/navigationStack/MainStack";
import Toast from 'react-native-toast-message';
import { DBContext } from "./src/modals";

function App(): React.JSX.Element {
  const { RealmProvider } = DBContext;
  return (
    <Provider store={store}>
      <RealmProvider closeOnUnmount={false}>
        <MainStack />
      </RealmProvider>
      <Toast />
    </Provider>
  );
}

export default App;
