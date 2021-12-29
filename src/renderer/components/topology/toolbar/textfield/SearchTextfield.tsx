import * as React from 'react';
import {
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  styled,
} from '@mui/material';
import { SearchOutlined } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@renderer/app/store';
import { selectSelectedData } from '@renderer/features/graphSliceInputSelectors';
import { NodeData } from '@renderer/types/graph';
import { setFilterNodes, setSelectedNode } from '@renderer/features/graphSlice';

const StyledTextField = styled(OutlinedInput)(({ theme }) => ({
  '&.MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.toolbar.butonClicked,
    },
  },
}));

const SearchIcon = styled(SearchOutlined)(({ theme }) => ({
  color: theme.palette.toolbar.button,
}));

const SearchTextfield = () => {
  const [value, setValue] = React.useState('');

  const dispatch = useAppDispatch();
  const graphData = useAppSelector(selectSelectedData);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);

    // 그래프 연동
    if (newValue === '') {
      dispatch(setFilterNodes(null));
    } else {
      const nodes = (graphData.nodes as NodeData[]).filter((node) => {
        return (
          node.resourceName?.includes(newValue) ||
          node.instanceName.includes(newValue)
        );
      });
      nodes ? dispatch(setFilterNodes(nodes)) : dispatch(setFilterNodes(null));
      dispatch(setSelectedNode(null));
    }
  };

  return (
    <FormControl sx={{ ml: 1, width: 200, minHeight: 36, maxHeight: 36 }}>
      <StyledTextField
        type="text"
        placeholder="리소스 검색"
        value={value}
        onChange={handleChange}
        inputProps={{
          style: {
            padding: '6px 16px',
          },
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton edge="end" disabled>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </FormControl>
  );
};

export default SearchTextfield;
