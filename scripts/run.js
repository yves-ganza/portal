//compile
const main = async () => {
    const VPContractFactory = await hre.ethers.getContractFactory('VibinPortal')
    const [admin, user] = await hre.ethers.getSigners()
    const userAddress = user.address

    //deploy
    const contract = await VPContractFactory.deploy()
    //wait for the contract to be mined
    await contract.deployed()
    console.log(`Contract deployed, Address: ${contract.address}`)
    console.log(`Contract deployed by, ${admin.address}`);

    let userCount = await contract.getUserCount()

    console.log(`Number of users so far: ${userCount}`)

    //Make a join transaction
    console.log('User joining...')
    const joinTx = await contract.connect(user).join('John Doe')
    await joinTx.wait()
    console.log('User joined!\n')

    userCount = await contract.getUserCount()
    console.log(`Number of users so far: ${userCount}`)

    let messages = await contract.getVibes()
    console.log('Messages so far: ', messages)

    //Send a message
    console.log('Sending message...')
    let msgTx = await contract.connect(user).vibe('Hello, people!')
    await msgTx.wait()
    console.log('Sent!')

    messages = await contract.getVibes()
    console.log('Messages so far: ', messages)

}

const run = async () => {
    try{
        await main()
        process.exit(0)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}

run()
//execute