"use client";
import CountUp from 'react-countup';
const Counter = ({amount}:{amount: number}) => {
  return (
    <CountUp  
    end={amount}
    decimal='.'
    prefix="$"
    decimals={2}
    />
  )
}

export default Counter
