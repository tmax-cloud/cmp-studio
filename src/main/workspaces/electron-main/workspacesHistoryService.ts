import path from 'path';
import { IStorageMainService } from '../../storage/common/storage';
import { IRecentWorkspace } from '../common/workspace';

export class WorkspacesHistoryService {
  static readonly workspaceHistoryStorageKey = 'workspaceEntries';

  constructor(private readonly storageMainService: IStorageMainService) {}

  addWorkspaceToStorage(folderUri: string) {
    // TODO : 디렉토리에서도 parse쓰면 name에 뭐가 들어가지?
    const entryToAdd: IRecentWorkspace = {
      folderUri,
      labelTitle: path.parse(folderUri).name,
      labelUri: path.parse(folderUri).dir,
    };
    const entries: IRecentWorkspace[] = this.storageMainService.getItem(
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

  serializeEntries(entries: IRecentWorkspace[]): IRecentWorkspace[] {
    // TODO : isPinned여부 체크해서 순서 정리해주는 로직 구현하기
    return entries;
  }

  getRecentlyOpenedWorkspaces(): IRecentWorkspace[] {
    const entries: IRecentWorkspace[] = this.storageMainService.getItem(
      WorkspacesHistoryService.workspaceHistoryStorageKey
    );
    return entries;
  }
}
