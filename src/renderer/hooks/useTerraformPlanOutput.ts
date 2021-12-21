import * as React from 'react';

export const TERRAFORM_SUCCES_MSG =
  'Terraform Plan command has been successfully done!';

export const useTerraformPlanOutput = () => {
  const [output, setOutput] = React.useState<string>();

  React.useEffect(() => {
    window.electron.ipcRenderer.on(
      'studio:terraformPlanStdout',
      (res: string) => {
        if (res.includes(TERRAFORM_SUCCES_MSG)) {
          setOutput(TERRAFORM_SUCCES_MSG);
        } else {
          setOutput(res);
        }
      }
    );
  }, []);
  return output;
};
