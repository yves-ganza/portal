const main = async () => {
    const [admin] = await hre.ethers.getSigners()
    const balance = await admin.getBalance()
    
    const contractFactory = await hre.ethers.getContractFactory('VibinPortal')
    let contract = await contractFactory.deploy()
    contract = await contract.deployed()

    console.log(`Smart contract deployed to: ${contract.address}`)
    console.log(`Contract admin's account\n\t Address: ${admin.address}\n  Balance: ${balance.toString()}\n`)
}

const runMain = async () => {
    try {
        await main()
        process.exit(0)
    }catch(err){
        console.log('An error occured: ', err)
        process.exit(1)
    }
}

runMain()