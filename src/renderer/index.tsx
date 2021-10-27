import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as StorageIpcUtils from './utils/ipc/storageIpcUtils';

import App from './App';
import { store, persistor } from './app/store';

StorageIpcUtils.getStorageItem({
  key: 'isFirstRun',
})
  .then((isFirstRun: string) => {
    let showTerraformSetting = true;
    if (isFirstRun === undefined || isFirstRun) {
      StorageIpcUtils.setStorageItem({ key: 'isFirstRun', data: false });
    } else {
      showTerraformSetting = false;
    }
    render(
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App showTerraformSetting={showTerraformSetting} />
        </PersistGate>
      </Provider>,
      document.getElementById('root')
    );
    return isFirstRun;
  })
  .catch((e: any) => {
    console.log(e);
  });
