import React from 'react';

interface RowDetailsProps {
  colSpan: number;
  children: React.ReactNode;
}

export const RowDetails: React.FC<RowDetailsProps> = ({ colSpan, children }) => {
  return (
    <tr className="data-detail-row">
      <td colSpan={colSpan} className="row-details-cell">
        <div className="row-details">{children}</div>
      </td>
    </tr>
  );
};

interface DetailFieldProps {
  label: string;
  children?: React.ReactNode;
}

export const DetailField: React.FC<DetailFieldProps> = ({ label, children }) => {
  if (children == null || children === '') return null;
  return (
    <div className="detail-field">
      <span className="detail-field-label">{label}</span>
      <div className="detail-field-value">{children}</div>
    </div>
  );
};
