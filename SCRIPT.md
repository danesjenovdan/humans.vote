# Demo script

## Warning
You are dealing with a **public** testing chain. Anything you submit to it will be open to read to anyone. Choose your proposals wisely. ;)

## Intro
You're about to test voting on the blockchain. Don't worry, it'll be fine. You need two people to make this work. You will simulate an organisation that has already decided on their voting rules:
- required quorum: 1
- minimum winning majority margin: 1
- voting deadlines don't exist, you can query for vote results any time, this is a demo (in real life, you would probably limit this period to a number of days)

This organisation has already set up their private chain and the admin has deployed the organisation's smart contract.

There are two different roles to play: `ADMIN` and `VOTER`. `ADMIN` is the one who can add new members to the organisation and only these are allowed to vote and submit proposals.

## The script

`ADMIN` and `VOTER` both download the Android app from [humans.vote](http://humans.vote/) (you need to allow installs from unknown sources on your phone). You run it, and for this demo only, you both tap **SIGN IN** (the **I'M AN ADMIN** button is for actual admins on other private chains).

`ADMIN` should toggle the **Use demo  wallet** switch **ON** while the `VOTER` should keep it **OFF**.

Once you log in, you both see *DemoVoting* in your active contracts. This contract was already deployed with the demo wallet and the `ADMIN` can now add a member.

The `ADMIN` should now tap **VIEW** and a list of functions appears. Choose **Add Member** from the list. Type in the *Member Name* by hand, and tap the QR code scanner icon next to the *Target Member* input. A QR code scanner should start up.

The `VOTER` should choose the **Profile** tab at the bottom to display his QR code. The `ADMIN` should scan it and tap **SUBMIT**. Once the transaction is mined, `VOTER` is now a member of the organisation.

Any of the two can now go to the **Contracts** tab and **VIEW** the *DemoVoting* contract. They can add proposals by tapping **New Proposal**. Once you add a proposal tap **Num Proposals** to see how many proposals have been submitted. Subtract 1 from the number and use that to vote.

`ADMIN` and `VOTER` should now both vote by tapping **Vote** and entering the proposal number that they got in the previous step. If you're unsure about the proposal you're voting for you can check it by tapping **Proposals** and submitting the number of the proposal you want to check.

Once `ADMIN` and `VOTER` have voted (or basically any time since the creation of the proposal) they can both tap **Get Proposal Results** input the proposal number and get the results.

That's it. You just had your first fully-blockchain-enabled voting experience. Not a single piece of information that you dealt with came from an API source, all of the voting data is now stored on the chain.
