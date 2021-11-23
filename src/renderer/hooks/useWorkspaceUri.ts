import { useEffect, useState } from 'react';
import * as _ from 'lodash';
import { getFolderUriByWorkspaceId } from '@renderer/utils/ipc/workspaceIpcUtils';

export const useWorkspaceUri = (workspaceId: string) => {
  const [uri, setUri] = useState(null);
  useEffect(() => {
    (async () => {
      const response = await getFolderUriByWorkspaceId({ workspaceId });
      setUri(response);
    })();
  }, [workspaceId]);
  return uri;
};
