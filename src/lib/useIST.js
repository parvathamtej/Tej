import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kolkata',
  hour: '2-digit',
  minute: '2-digit',
})

export function useIST() {
  const [time, setTime] = useState(() => fmt.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setTime(fmt.format(new Date())), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}
