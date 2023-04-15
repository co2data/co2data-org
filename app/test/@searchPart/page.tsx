'use client'
import { useRouter } from 'next/navigation'

const Q = () => {
  const router = useRouter()
  router.push('/c')
}

export default Q
