#! /bin/sh

while getopts i:a:b: option
do
	case "${option}"
	in
	i) IP=${OPTARG};;
	a) ADDRESS=${OPTARG};;
	b) BOOTSTRAP=${OPTARG};;
	esac
done
echo $IP
echo $ADDRESS
echo $BOOTSTRAP


# Check for ip
if [ ! $IP  ]
  then
    echo "first argument must be server domain/IP"
    exit 1
fi

#install packages
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
if [ $BOOTSTRAP ] && [ $ADDRESS ]
  then
  	#generate random chainId and nonce
  	echo "set Bootstrap node"
	chainId=$(shuf -i 1-10000 -n 1)
	echo $chainId
	nonce=$(openssl rand -hex 6)

	sed -i 's/XXXX/'$chainId'/g' genesis.json
	sed -i 's/ZZZZ/'$nonce'/g' genesis.json
	sed -i 's/YYYY/'2000000'/g' genesis.json
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

geth init genesis.json --datadir eth-data
geth --datadir=eth-data --bootnodes=$enode --mine --minerthreads=1 --rpc --rpccorsdomain "*" --rpcaddr 127.0.0.1 --rpcport 8683 --etherbase=$account_address console
