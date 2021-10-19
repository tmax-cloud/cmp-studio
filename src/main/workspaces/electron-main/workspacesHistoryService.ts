import path from 'path';
import { StorageMainServiceInterface } from '../../storage/common/storage';
import { RecentWorkspace } from '../common/workspace';

export class WorkspacesHistoryService {
  static readonly workspaceHistoryStorageKey = 'workspaceEntries';

  constructor(
    private readonly storageMainService: StorageMainServiceInterface
  ) {}

  addWorkspaceToStorage(folderUri: string) {
    // TODO : 디렉토리에서도 parse쓰면 name에 뭐가 들어가지?
    const entryToAdd: RecentWorkspace = {
      folderUri,
      labelTitle: path.parse(folderUri).name,
      labelUri: path.parse(folderUri).dir,
      lastOpenedTime: Math.floor(+new Date() / 1000),
    };
    const entries: RecentWorkspace[] = this.storageMainService.getItem(
      WorkspacesHistoryService.workspaceHistoryStorageKey
    );
    const newEntries = [];
    // MEMO : entries중에 folderUri값 같은애 있으면 없애주는 로직
    entries?.length > 0 &&
      entries.forEach((entry) => {
        if (entry.folderUri !== folderUri) {
          newEntries.push(entry);
        }
      });
    newEntries.push(entryToAdd);
    this.storageMainService.setItem(
      WorkspacesHistoryService.workspaceHistoryStorageKey,
      newEntries
    );
  }

  removeWorkspaceHistoryItem(folderUri: string) {
    const entries: RecentWorkspace[] = this.storageMainService.getItem(
      WorkspacesHistoryService.workspaceHistoryStorageKey
    );
    const newEntries: RecentWorkspace[] = [];
    entries.forEach((entry) => {
      const { folderUri: entryFolderUri } = entry;
      entryFolderUri !== folderUri && newEntries.push(entry);
    });
    this.storageMainService.setItem(
      WorkspacesHistoryService.workspaceHistoryStorageKey,
      newEntries
    );
  }

  serializeEntries(entries: RecentWorkspace[]): RecentWorkspace[] {
    // TODO : isPinned여부 체크해서 순서 정리해주는 로직 구현하기
    return entries;
  }

  getRecentlyOpenedWorkspaces(): RecentWorkspace[] {
    const entries: RecentWorkspace[] = this.storageMainService.getItem(
      WorkspacesHistoryService.workspaceHistoryStorageKey
    );
    return entries;
  }
}
