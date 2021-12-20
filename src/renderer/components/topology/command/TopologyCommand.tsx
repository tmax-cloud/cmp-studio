import * as React from 'react';
import * as _ from 'lodash';
import {
  useTerraformPlanOutput,
  TERRAFORM_SUCCES_MSG,
} from '@renderer/hooks/useTerraformPlanOutput';
import { useAppSelector } from '@renderer/app/store';
import { Box } from '@mui/material';
import {
  selectCommandLoadingMsg,
  selectCommandErrorMsg,
} from '@renderer/features/commandSliceInputSelectors';
import Error from './Error';
import StateTab from '../state/state/State';
import TerraformPlanLoadingModal from '../modal/TerraformPlanLoadingModal';

const TopologyCommand = () => {
  const initOutputMsg = useTerraformPlanOutput(); // subtitle
  const loadingMsg = useAppSelector(selectCommandLoadingMsg); // title (redux로 관리)
  const errorMsg = useAppSelector(selectCommandErrorMsg); // (redux로 관리)
  const isLoadedFinished =
    !initOutputMsg || initOutputMsg === TERRAFORM_SUCCES_MSG;

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {StateTab}
      {!isLoadedFinished || errorMsg ? (
        <>
          <Error isLoading={!isLoadedFinished} message={errorMsg} />
          <TerraformPlanLoadingModal
            isOpen={!isLoadedFinished}
            initMsg={initOutputMsg}
            loadingMsg={loadingMsg}
          />
        </>
      ) : (
        'TerraformPlan 출력 결과물'
      )}
    </Box>
  );
};

export default TopologyCommand;
