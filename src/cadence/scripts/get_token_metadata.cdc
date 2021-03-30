import Evolution from 0xf4264ac8f3256818
  
pub struct NFTWithMetadataAndTotal {
  pub let nft: &Evolution.NFT
  pub let metadata: {String: String}
  pub let total: UInt32

  init(nft: &Evolution.NFT, metadata: {String: String}, total: UInt32) {
      self.nft = nft
      self.metadata = metadata
      self.total = total
  }
}

pub fun main(owner: Address, tokenId: UInt64): NFTWithMetadataAndTotal {
  let acct = getAccount(owner)

  let collectionRef = acct.getCapability(/public/f4264ac8f3256818_Evolution_Collection)
                      .borrow<&{Evolution.EvolutionCollectionPublic}>()!

  let nft = collectionRef.borrowCollectible(id: tokenId)!
  let metadata = Evolution.getItemMetadata(itemId: nft.data.itemId)!
  let total = Evolution.getNumberCollectiblesInEdition(
    setId: nft.data.setId, 
    itemId: nft.data.itemId
  )!

  return NFTWithMetadataAndTotal(
    nft: nft,
    metadata: metadata,
    total: total
  )
}
