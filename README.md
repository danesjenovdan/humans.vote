# humans.vote
Blockchain voting for humans

## What we wanted to do in 48 hours
![Admin Flow](http://humans.vote/images/image1.png)
![User Flow](http://humans.vote/images/image2.png)

## What we achieved in 48 hours

[Android APK](https://github.com/danesjenovdan/humans.vote/blob/master/voter-client/android-debug.apk?raw=true) (An app that basically allows you to do all the things you want to, but we didn't quite have the time to implement the nice user interface. :()

# What do you need to do if you want to try this out

## Step 0: Demo script
We prepared everything for a real-life-like test voting scenario that you can run **immediately**. You need at least two people to make this work, and two Android phones. If you just want to test it out and don't really care how to deploy a voting system of your own at this point, click on the link below and ignore steps 1 and 2.

[**#################################**
**--> Click here for the script <--**
**#################################**](https://github.com/danesjenovdan/humans.vote/blob/master/SCRIPT.md)

## Step 1: Android application
Download the application from the github repository and install it. After you start the app a wallet will be automatically generated for you, and you will be able to execute contract calls after someone gives you ether, or you get it by setting up a miner.

**Where do the contracts you interact with come from?**
https://github.com/danesjenovdan/humans.vote/tree/master/bin/contracts

**IMPORTANT! You can test the platform out without doing any of the steps below. Just connect to chain.humans.vote for the RPC and choose "Use demo wallet" you will get access to a preset wallet with ether. You can play around with it, but you should set up your own network.**

**BUG:** If you use the back button when viewing the contract an alert pops up and says "Not found". Do not be alrmed, it's just a harmless bug. Just generally stay away from the Android OS back button in this version of the app and everything will be fine. If you do use it, nothing will break, you just might see the annoying popup.

## Step 2: Installation instructions - Ubuntu
Because decentralisation also means private networks and mining fees are often prohibitive in certain cases (yay for PoS!) running private mining networks makes sense when you have a group of intrinsically motivated individuals (like an NGO or citizens in a democratic voting system) willing to pay for transparency with actual computing cycles (and electricity). In order to vote and interact with contracts "for free", you need to set up your own network. With humans.vote, this is becomes a trivial task. Simply follow the instructions below and you should be up and running in about 15 minutes. No joke.

### Administrator (NGO/party/parliament official or sysadmin)
#### Set up the first (also bootstrap) node
##### Instructions:

* ```apt-get install git```
* ```git clone https://github.com/danesjenovdan/humans.vote.git```
* ```cd humans.vote```
* ```chmod +x setup.sh```
* ```./setup.sh```
* When promted for the IP, enter the IP or domain name of the main party server, where enode information will be available (people will use this IP/domain in the app to connect to the network).
* When prompted for the wallet address enter your wallet address, that was generated in the mobile application (you can copy it from the app and email it to yourself or use chat client or some synced notetaking service). 
  * This will save any mined resources into your wallet.
  * Your private key is not needed for mining into your account, however if you plan to use your node to send resources, voting (sending transactions) or for any other purpose involving use of your wallet you will need to install your private key into eth-data/keystore/.
  * If you do not enter a wallet address one will be automatically generated for you. In this case you will be prompted to enter the password for the private key.
 * When prompted if this is the main node, enter "y" for yes.
 * When prompted for the organisation name, enter your organisation name.
* During the installation the following executes:
	* All dependencies are installed
	* Wallet is generated
	* genesis.json is generated
	* Bootnode is started
	* Miner is started
	* A basic Organisation contract is deployed to the blockchain to allow simple member administration
	* The enode address is exposed
	* The contract wallet address is exposed (so members can find it easily)

#### Administrator commands (geth console)
* Get the address of your own account
```eth.accounts[0]```
* Check your balance (ACCOUNTADDRESS can be `eth.account[0]`)
```web3.fromWei(eth.getBalance(ACCOUNTADDRESS), "ether")```
* Unlock the account before making issuing transactions
```personal.unlockAccount(eth.accounts[0], 'password');```
* Send ether to another wallet
```eth.sendTransaction({from: "FROMACCOUNTADDRESS", to: "TOACCOUNTADDRESS", value: web3.toWei(ETHERVALUE,”ether"), gas: 500000})```
* Instantiate a js object for calling the contract
```var contract = eth.contract(ABI).at(CONTRACTADDRESS);```
* Change default contract ownership (this is a function implemented on the contract)
```contract.transferOwnership.sendTransaction("TOACCOUNTADDRESS", {from: FROMACCOUNTADDRESS})```


### User (voter)
#### Miner
The purpose of a user becoming a miner is to ensure that transactions are validated by multiple nodes, so the certainty of the system is increased (you might not trust your sysadmin and other members of your organisation/parliament/country). 

##### Instructions:
* ```apt-get install git```
* ```git clone https://github.com/danesjenovdan/humans.vote.git```
* ```cd humans.vote```
* ```chmod +x setup.sh```
* ```./setup.sh```
* When promted for the IP, enter the IP or domain name of the main party server, where enode information is available.
* When prompted for the wallet address enter your wallet address, that was generated in the mobile application. 
  * This will save any mined resources into your wallet.
  * Private key is not needed for mining into your account, however if you plan to use your node to send resources, voting (sending transactions) or for any other purpose involving use of your wallet you will need to install your private key into eth-data/keystore/.
  * If you do not enter an address one will be automatically generated for you. In this case you will be prompted to enter password for the private key.
 * When prompted if this is main node, enter "n" for no.
 
 ## Other epic uses of these tools
 We set out to build a tool that would allow any group of people to easily deploy a voting app on the blockchain regardless of their block-chain know how. These organisations come in different forms and have different needs so we designed our app to be capable of handling any sort of (reasonably imaginable) voting systems. While the user interface is far from polished, we achieved that, and more.
 
 ### Architectural philosophy
 1) The contract code should be plugabble, vettable, and open. We decided to keep all the contracts in this public repository in their source and compiled versions. When we finish working on a contract we compile it and place it into `/bin/contracts/...` following contract names and the folder structure in `/contracts` where you can find the source. While there is no guarantee we won't compile a different contract and place it in a misleading folder anyone can check our compilation work in a minute or better-yet compile the contracts themselves.
 
 2) The app should provide sensible (or even beautiful and/or smart) interfaces that allow interactions with contracts. We generate these interfaces based on `.abi` files of the compiled contracts. They can handle pretty much everything and the input fields adapt to the type of inputs the contract accepts. There is a QR code input option available for every input for faster user onboarding and address input.
 
 3) While enabling voting is the primary function of these tools, we should (wherever possible) leave them open to different uses.
 
 ### Freebie no. 1 - Community contracting
 Because the default compiled APK expects the contracts in this repository, any pull request with a new contract will open up the voting possibilities to everyone who uses the app. If you build the app yourself, you can point it to a different source of compiled contracts, but we encourage you to share them with us in this repo.
 
 ### Freebie no. 2 - Automated private ETH network setup
 For development, work, or play, you can now get a fully-fledged ETH network up and running by running a one little command (`./setup.sh`). This not will not only function as a miner, but will offer you a hand in setting up the defaults, mining into your wallet and making sure other miners can find it and connect to it (by automatically exposing `genesis.json` `enode info` and `a JSON-RPC endpoint` on standardised ports and addresses.
 
 If you're using the app to interact with the contracts this means a zero-setup situation for you.
 
 ### Freebie no. 3 - Real-life contract testing suite
 Since the app's interface completely adapts to your ABI structure, you can use it to test contracts in real life mobile scenarios quickly. As soon as you push to your repo (if you compiled your own APK) the list of available contracts will refresh and you can start testing them in the app with all the bells and whistles (like QR code scanners) immediately. You can test complex interactions between multiple agents and even simulate real-life (mobile) scenarios for your contracts.
 
 If you submit a pull request to this repo the contract will show up automatically for anyone that installs the APK provided in this repo.
