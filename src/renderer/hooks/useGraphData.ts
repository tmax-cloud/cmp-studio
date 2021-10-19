import * as React from 'react';
import { getGraphData } from '../utils/graphUtils';

export const useGraphData = () => {
  const [data, setData] = React.useState({});
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const gd = await getGraphData();
        setData(gd);
      } catch (err) {
        const { message } = err as Error;
        setError(message);
      }
    };
    fetchData();
  }, []);

  return { data, error };
};
