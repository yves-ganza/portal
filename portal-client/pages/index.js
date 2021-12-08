import Head from 'next/head'
import { useEffect, useState } from 'react'

import Header from '../components/Header'


export default function Home() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [account, setAccount] = useState()
  const [status, setStatus] = useState('')

  const connectWallet = async(ethereum) => {
    if(!ethereum) setStatus('Ethereum not found!')

    try {
      const accounts = await ethereum.request({method: 'eth_requestAccounts'})
      console.log('Connected to: ', accounts[0])
      setAccount(account[0])
      setStatus('')
    }catch(err){
      setStatus('Failed to connected wallet!')
      console.log(err)
    }
  }

  const checkWalletConnected = async () => {
    const {ethereum} = window

    if(!ethereum){
      setStatus('Ethereum not found!')
      return 
    }
    const accounts = await ethereum.request({method: 'eth_accounts'})

    if(accounts.length == 0){
      setStatus('No authorized account found!')
      console.log('Connecting to an account...')
      await connectWallet(ethereum)
      return 
    }

    setIsWalletConnected(true)
    setAccount(accounts[0])
    console.log(`Connected to account: `, accounts[0])
    return setStatus('')
  }

  useEffect(() => {
    checkWalletConnected()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-700 via-gray-900 to-black">
      <Header account={account} status={status}/>
    </div>
  )
}