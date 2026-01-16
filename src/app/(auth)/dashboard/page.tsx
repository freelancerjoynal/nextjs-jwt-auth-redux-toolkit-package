
import React from 'react'
import LogoutBtn from '@/components/auth/LogoutBtn'
import Link from 'next/link'

export default function Dashboard() {
  return (
    <>
    <div>Dashboard</div>
    <br />
    <Link href="/dashboard/profile">Profile</Link>
    <br />
    <LogoutBtn />
    </>
  )
}
