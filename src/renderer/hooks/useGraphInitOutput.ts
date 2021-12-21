import { useEffect } from 'react';
import { LOADING } from '@renderer/utils/graph';
import { useAppDispatch } from '@renderer/app/store';
import { setLoadingMsg } from '@renderer/features/uiSlice';

export const useGraphInitOutput = () => {
  const dispatch = useAppDispatch();
  const succeessMsg = 'Terraform has been successfully initialized!';

  useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:terraformInitStdout',
      (res: string) => {
        if (res.includes(succeessMsg)) {
          dispatch(setLoadingMsg(LOADING));
        } else {
          const skipMsg = [
            'Warning',
            'You may now begin working with Terraform',
            'Terraform has created a lock file',
          ];
          const skip = skipMsg.some((msg) => res.includes(msg));
          !skip && dispatch(setLoadingMsg(res));
        }
      }
    );
  }, [dispatch]);
};
