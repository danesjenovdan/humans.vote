#! /bin/sh
while getopts i:a:b:o: option
do
  case "${option}"
  in
  i) IP=${OPTARG};;
  a) ADDRESS=${OPTARG};;
  b) BOOTSTRAP=${OPTARG};;
  o) ORGNAME=${OPTARG};;
  esac
done

if [ $# -eq 0 ]
  then
    echo "No arguments supplied"
    echo Enter your public IP or domain:
	read IP
	while [ -z ${IP} ]; do
	     read IP
	done
	echo Enter your wallet address or keep empty for generating new wallet:
	read ADDRESS
	echo Is tihis main node y/N:
	read BOOTSTRAP
	if [ "$BOOTSTRAP" = "Y" ] || [ "$BOOTSTRAP" = "y" ]
	  then
	    echo Enter organization name:
	    read ORGNAME
	    while [ -z ${ORGNAME} ]; do
		  read ORGNAME
		done
	fi
	echo $IP
	echo $ADDRESS
	echo $BOOTSTRAP
	echo $ORGNAME
fi
# Check for ip
if [ ! $IP  ]
  then
    echo "Server domain/IP not provided."
    exit 1
fi

#install packages
apt-get update
apt-get install software-properties-common -y
add-apt-repository ppa:ethereum/ethereum -y
apt-get update
apt-get install ethereum -y
apt-get install solc -y
apt-get install nginx -y
apt-get install qrencode -y

# set or create wallet address
if [ $ADDRESS  ]
  then
    echo "Use your wallet"
    account_address=$ADDRESS
  else
  	echo "Generiraj wallet"
  	#wallet password input
	stty -echo
	read -p "Wallet password: " password; echo
	stty echo
	echo $password > cache.tmp
	account_address=$(geth --datadir=eth-data account new --password cache.tmp)
	rm cache.tmp
	account_address=0x$(echo $account_address | cut -d'{' -f 2| cut -d'}' -f 1)
	echo $account_address > wallet.address
	ADDRESS=$account_address
	echo 'your wallet addres is in wallet.address'
fi

# run bootstrap node
if [ "$BOOTSTRAP" = "Y" ] || [ "$BOOTSTRAP" = "y" ]
  then
    # Check for Organization name 
	if [ ! "$ORGNAME"  ] 
	  then 
	    echo "No organization name (-o) provided." 
	    exit 1 
	fi 
  	#generate random chainId and nonce
  	echo "set Bootstrap node"
	chainId=$(shuf -i 1-10000 -n 1)
	echo $chainId
	nonce=$(openssl rand -hex 6)

	sed -i 's/XXXX/'$chainId'/g' genesis.json
	sed -i 's/ZZZZ/'$nonce'/g' genesis.json
	sed -i 's/YYYY/'2000000000000000000000000'/g' genesis.json
        sed -i 's/QQQQ/'$ADDRESS'/g' genesis.json

	bootnode --genkey=boot.key
	key=$(bootnode --nodekey=boot.key -writeaddress)
	enode=enode://$key@$IP:30301
	echo $enode > /var/www/html/index.nginx-debian.html
	qrencode -o /var/www/html/enode.png $enode
	cp genesis.json /var/www/html/genesis.json
	run_node="bootnode --nodekey=boot.key &"
	$run_node > /dev/null 2>&1  &
  else
	wget -q $IP/genesis.json -O genesis.json
  	echo "read enode from bootnode"
  	echo 'wget '$IP' -q -O -'
  	enode=$(wget $IP/ -q -O -)
  	echo $enode
fi
echo $enode
cp rpc.nginx /etc/nginx/sites-enabled/
service nginx restart
geth init genesis.json --datadir eth-data
nohup geth --datadir=eth-data --bootnodes=$enode --mine --minerthreads=1 --rpc --rpccorsdomain "*" --rpcaddr 127.0.0.1 --rpcport 7001 --etherbase=$account_address &

# run bootstrap node
if [ "$BOOTSTRAP" = "Y" ] || [ "$BOOTSTRAP" = "y" ]
  then
	sleep 10

	abi=$(cat bin/contracts/MotionVotingOrganisation/MotionVotingOrganisation.abi)
	data=$(cat bin/contracts/MotionVotingOrganisation/MotionVotingOrganisation.bin)

	# Check for Password
	if [ ! "$password"  ]
	  then
	    echo "Please enter your wallet password"
	    read password
	fi

	sed -i 's/PPPP/'$password'/g' generateContract.js
	sed -i 's/OOOO/'"$ORGNAME"'/g' generateContract.js
	sed -i 's/QQQQ/'$ADDRESS'/g' generateContract.js
	sed -i 's/AAAA/'"$abi"'/g' generateContract.js
	sed -i 's/DDDD/'$data'/g' generateContract.js
	geth --exec 'loadScript("generateContract.js")' attach ipc:eth-data/geth.ipc > transaction.txt
	transactionHash=$(head -n 1 transaction.txt)

	sleep 20
	sed -i 's/TTTT/'$transactionHash'/g' getContractAddress.js
	geth --exec 'loadScript("getContractAddress.js")' attach ipc:eth-data/geth.ipc > contractAddress.txt
	contractAddress=$(head -n 1 contractAddress.txt)
	echo $contractAddress > /var/www/html/contractAddress.html

	rm generateContract.js
fi
