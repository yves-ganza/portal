//compile
const main = async () => {
    const VPContractFactory = await hre.ethers.getContractFactory('VibinPortal')
    const [admin, user, rando] = await hre.ethers.getSigners()
    const userAddress = user.address

    //deploy
    const contract = await VPContractFactory.deploy({
        value: hre.ethers.utils.parseEther('1')
    })
    //wait for the contract to be mined
    await contract.deployed()
    console.log(`Contract deployed, Address: ${contract.address}`)
    console.log(`Contract deployed by, ${admin.address}`);

    let userCount = await contract.getUserCount()

    console.log(`Number of users so far: ${userCount}`)

    let hasJoined = await contract.connect(user).hasJoined()

    console.log(`${userAddress} registered? - ${hasJoined}`)

    hasJoined = await contract.connect(rando).hasJoined()
    console.log(`${rando} registered? - ${hasJoined}`)

    //Make a join transaction
    console.log('User joining...')
    const joinTx = await contract.connect(user).join('John Doe')
    await joinTx.wait()
    console.log('User joined!')

    userCount = await contract.getUserCount()
    console.log(`Number of users so far: ${userCount}`)

    hasJoined = await contract.connect(user).hasJoined()

    console.log('User already registered: ', hasJoined)
    if(hasJoined){
        const newUser = await contract.connect(user).getUser()
        console.log(newUser)
    }

    let messages = await contract.connect(user).getVibes()
    console.log('Messages so far: ', messages)

    //Send a message
    console.log('Sending message...')
    let balance = hre.ethers.utils.formatEther(await hre.ethers.provider.getBalance(userAddress))
    console.log('Account balance', balance)

    let msgTx = await contract.connect(user).vibe('Hello, people!')
    await msgTx.wait()
    console.log('Sent!')

    balance = hre.ethers.utils.formatEther(await hre.ethers.provider.getBalance(userAddress))
    console.log('Account balance', balance)

    messages = await contract.connect(user).getVibes()
    console.log('Messages so far: ', messages)
    
    //Check if anti spam is working
    msgTx = await contract.connect(user).vibe('Hello, people!')
    await msgTx.wait()
}

const runMain = async () => {
    try{
        await main()
        process.exit(0)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

runMain()
//execute