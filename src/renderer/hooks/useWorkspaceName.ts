import { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { getFolderNameByWorkspaceId } from '@renderer/utils/ipc/workspaceIpcUtils';

export const useWorkspaceName = (workspaceId: string) => {
  const [name, setName] = useState(null);
  useEffect(() => {
    (async () => {
      const response = await getFolderNameByWorkspaceId({ workspaceId });
      setName(response);
    })();
  }, [workspaceId]);
  return name;
};
