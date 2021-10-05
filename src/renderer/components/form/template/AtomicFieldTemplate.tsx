import * as React from 'react';
import * as _ from 'lodash-es';
import { FieldTemplateProps } from '@rjsf/core';

export const AtomicFieldTemplate: React.FC<FieldTemplateProps> = ({
  children,
  id,
  description,
}) => {
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
