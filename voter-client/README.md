## Humans vote mobile client in Ionic

#### Overview

Application starts with the `Tabs` component. There's a `ionViewCanEnter` method in `TabsPage` component that checks if the necessary initialization has been complete. If not it presents a modal with setup fields.

A private key is generated on first launch and the wallet address is displayed at the moment in the `ProposalsPage` component. 

#### Installation

`$ npm i`

#### Development

`$ ionic serve`

#### Deployment

Add platforms first.

**Android**

`$ ionic cordova platform add android`

**iOS**

`$ ionic cordova platform add ios`

**Building**

`$ ionic cordova run android`