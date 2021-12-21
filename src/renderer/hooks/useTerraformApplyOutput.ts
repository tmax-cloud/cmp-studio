import * as React from 'react';
import { useAppDispatch } from '@renderer/app/store';
import { setLoadingMsg } from '@renderer/features/uiSlice';

export const TERRAFORM_SUCCES_MSG =
  'Terraform Apply command has been successfully done!';

export const useTerraformApplyOutput = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:terraformApplyStdout',
      (res: string) => {
        if (res.includes(TERRAFORM_SUCCES_MSG)) {
          dispatch(setLoadingMsg(TERRAFORM_SUCCES_MSG));
        } else {
          const applyLoadingMsg = [
            'Apply complete!',
            'Still creating...',
            'Creating...',
          ];
          const canPrint = applyLoadingMsg.some((msg) => res.includes(msg));
          canPrint && dispatch(setLoadingMsg(res));
        }
      }
    );
  }, []);
};
