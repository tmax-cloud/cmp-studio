import { useEffect, useState } from 'react';
import { INIT_FINISHED } from '@renderer/utils/graph';
import { useAppDispatch } from '@renderer/app/store';
import { setLoadingMsg } from '@renderer/features/uiSlice';

export const useGraphInitOutput = () => {
  const [output, setOutput] = useState<string>();
  const dispatch = useAppDispatch();
  const succeessMsg = 'Terraform has been successfully initialized!';
  useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:terraformInitStdout',
      (res: string) => {
        if (res.includes(succeessMsg)) {
          dispatch(setLoadingMsg(INIT_FINISHED));
          // setOutput(INIT_FINISHED);
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
  }, []);

  if (output === INIT_FINISHED) {
    // setOutput(undefined);
    dispatch(setLoadingMsg(''));
  }

  return output;
};
