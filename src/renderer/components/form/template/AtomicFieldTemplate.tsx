import * as React from 'react';
import * as _ from 'lodash';

export const AtomicFieldTemplate = ({ children, id, description }) => {
  return (
    <div id={`${id}_field`} className="form-group">
      {/* <label className="form-label" htmlFor={id}>
        {label}
      </label> */}
      {children}
      {description}
    </div>
  );
};
