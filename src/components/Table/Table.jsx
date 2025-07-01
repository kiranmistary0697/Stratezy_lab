import React from 'react';
import PropTypes from 'prop-types';
import { Color, Icons } from '../../constants/AppResource';

const Table = ({ tableHeader, tableData, selectedRowIndex, handleRowClick }) => {
  return (
    <table className="min-w-full table-auto">
      <thead>
        <tr>
          {tableHeader.map((header, index) => (
            <th
              key={index}
              className="px-8 py-4 text-left text-xs md:text-sm font-medium capitalize text-textColor"
              
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((item, index) => (
          <tr
            key={index}
            className={`border-t cursor-pointer border-switchGrayColor`}
            onClick={() => handleRowClick(item)}
            style={{
              backgroundColor:
                selectedRowIndex.name.includes(item.name) ? Color.lightPink : "#F9FAFB",
              
            }}
          >
            {tableHeader.map((header, idx) => {
              if(header!=='Operation'){
                return (
                  <td
                  key={idx}
                  className="px-8 py-2 lg:py-4 text-xs md:text-sm border text-placeholderGray font-light border-r-fadeGray"
                  style={{
                    borderLeftColor: idx === 0 ? Color.fadeGray : 'transparent',
                  }}
                >
                  {item[header] || ''}
                </td>
                )
              }else{
                return(
                  <td
              className="px-8 py-2 lg:py-4  border text-placeholderGray border-r-fadeGray"
              
            >
              <div className="flex gap-1 items-center">
                <img
                  src={Icons.PencilAltIcon}
                  className='w-[24px] h-[24px]'
                />
                <img
                  src={Icons.InfoCircleIcon}
                  className='w-[24px] h-[24px]'
                />
                <img
                  src={Icons.TrashIcon}
                  className='w-[24px] h-[24px]'
                />
              </div>
            </td>
                )
              }
            })}
            
          </tr>
        ))}
      </tbody>
    </table>
  );
};



export default Table;
