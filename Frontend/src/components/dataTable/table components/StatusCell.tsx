import { Button } from '@mui/material';
import React from 'react'

const StatusCell = ({getValue, row, column, table}) => {
    const value = getValue();
  return (
    <Button variant="contained" color={value === 1?  "success" : 'error'}>{value}</Button>
  )
}

export default StatusCell