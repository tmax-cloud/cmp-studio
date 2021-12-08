import { useEffect, useState } from 'react';
import { INIT_FINISHED } from '@renderer/utils/graph';

export const useGraphInitOutput = () => {
  const [output, setOutput] = useState<string>();
  const succeessMsg = 'Terraform has been successfully initialized!';
  useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:terraformInitStdout',
      (res: string) => {
        if (res.includes(succeessMsg)) {
          setOutput(INIT_FINISHED);
        } else {
          const skipMsg = [
            'Warning',
            'You may now begin working with Terraform',
            'Terraform has created a lock file',
          ];
          const skip = skipMsg.some((msg) => res.includes(msg));
          !skip && setOutput(res);
        }
      }
    );
  }, []);
  return output;
};
