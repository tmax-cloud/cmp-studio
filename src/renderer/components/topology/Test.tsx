import * as React from 'react';

const Test: React.FC<TestProps> = ({ test }) => {
  return <>{test}</>;
};

type TestProps = {
  test: any;
};
export default Test;
