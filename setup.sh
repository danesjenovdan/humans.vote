#! /bin/sh
if [ $# -eq 0 ]
  then
    echo "first argument must be server domain/IP"
    exit 1
fi

#wallet password input 
stty -echo
read -p "Wallet password: " password; echo
stty echo

#install packages
apt-get install software-properties-common
add-apt-repository ppa:ethereum/ethereum -y
apt-get update
apt-get install ethereum -y
apt-get install solc -y
apt-get install nginx -y


#generate random chainId and nonce
chainId=$(shuf -i 1-10000 -n 1)
echo $chainId
nonce=$(openssl rand -hex 6)

sed -i 's/XXXX/'$chainId'/g' genesis.json
sed -i 's/ZZZZ/'$nonce'/g' genesis.json

# setup bootnode and geth
geth init genesis.json --datadir eth-data
bootnode --genkey=boot.key
key=$(bootnode --nodekey=boot.key -writeaddress)
enode=enode://$key@$1:30301
echo $enode > /var/www/html/index.nginx-debian.html
echo $password > cache.tmp
account_address=$(geth account new --password cache.tmp)
rm cache.tmp
run_node="bootnode --nodekey=boot.key &"
$run_node > /dev/null 2>&1  &

account_address=$(echo $account_address | cut -d'{' -f 2| cut -d'}' -f 1)

echo 0x$account_address > wallet.address

run_geth=$(geth --datadir=eth-data --bootnodes=$enode --mine --minerthreads=1 --rpc --rpccorsdomain "*" --rpcaddr 172.0.0.1 --rpcport 8683 --etherbase=0x$account_address console)
$run_geth 

