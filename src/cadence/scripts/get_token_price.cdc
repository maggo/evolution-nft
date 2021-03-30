import VIV3 from 0xc2d564119d2e5c3d
import Evolution from 0xf4264ac8f3256818

pub fun main(address: Address, tokenId: UInt64): UFix64 {
  let acct = getAccount(address)

  let saleCollection = acct
    .getCapability(/public/f4264ac8f3256818_Evolution_Collection_VIV3xFLOW)
    .borrow<&VIV3.TokenSaleCollection{VIV3.TokenSale}>() 
    ?? panic("Could not borrow sale collection")

  return saleCollection.getPrice(tokenId: tokenId) ?? panic("Token is not on sale")
   
}
