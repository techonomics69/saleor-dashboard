import gql from "graphql-tag";

export const stockFragment = gql`
  fragment StockFragment on Stock {
    id
    quantity
    quantityAllocated
    warehouse {
      id
      name
    }
  }
`;

export const fragmentMoney = gql`
  fragment Money on Money {
    amount
    currency
  }
`;

export const fragmentProductImage = gql`
  fragment ProductImageFragment on ProductImage {
    id
    alt
    sortOrder
    url
  }
`;

export const channelListingProductFragment = gql`
  ${fragmentMoney}
  fragment ChannelListingProductFragment on ProductChannelListing {
    isPublished
    publicationDate
    discountedPrice {
      ...Money
    }
    isAvailableForPurchase
    availableForPurchase
    visibleInListings
    channel {
      id
      name
      currencyCode
    }
  }
`;

export const channelListingProductVariantFragment = gql`
  ${fragmentMoney}
  fragment ChannelListingProductVariantFragment on ProductVariantChannelListing {
    channel {
      id
      name
      currencyCode
    }
    price {
      ...Money
    }
    costPrice {
      ...Money
    }
  }
`;

export const productFragment = gql`
  ${channelListingProductFragment}
  fragment ProductFragment on Product {
    id
    name
    thumbnail {
      url
    }
    productType {
      id
      name
      hasVariants
    }
    channelListing {
      ...ChannelListingProductFragment
    }
  }
`;

export const productVariantAttributesFragment = gql`
  ${fragmentMoney}
  fragment ProductVariantAttributesFragment on Product {
    id
    attributes {
      attribute {
        id
        slug
        name
        inputType
        valueRequired
        values {
          id
          name
          slug
        }
      }
      values {
        id
        name
        slug
      }
    }
    productType {
      id
      variantAttributes {
        id
        name
        values {
          id
          name
          slug
        }
      }
    }
    channelListing {
      channel {
        id
        name
        currencyCode
      }
      discountedPrice {
        ...Money
      }
    }
  }
`;

export const productFragmentDetails = gql`
  ${fragmentProductImage}
  ${fragmentMoney}
  ${productVariantAttributesFragment}
  ${stockFragment}
  ${channelListingProductFragment}
  ${channelListingProductVariantFragment}
  fragment Product on Product {
    ...ProductVariantAttributesFragment
    name
    descriptionJson
    seoTitle
    seoDescription
    category {
      id
      name
    }
    collections {
      id
      name
    }
    chargeTaxes
    channelListing {
      ...ChannelListingProductFragment
    }
    images {
      ...ProductImageFragment
    }
    variants {
      id
      sku
      name
      margin
      stocks {
        ...StockFragment
      }
      trackInventory
      channelListing {
        ...ChannelListingProductVariantFragment
      }
    }
    productType {
      id
      name
      hasVariants
    }
  }
`;

export const fragmentVariant = gql`
  ${fragmentMoney}
  ${fragmentProductImage}
  ${stockFragment}
  ${channelListingProductVariantFragment}
  fragment ProductVariant on ProductVariant {
    id
    attributes {
      attribute {
        id
        name
        slug
        valueRequired
        values {
          id
          name
          slug
        }
      }
      values {
        id
        name
        slug
      }
    }
    images {
      id
      url
    }
    name
    product {
      id
      images {
        ...ProductImageFragment
      }
      name
      thumbnail {
        url
      }
      channelListing {
        channel {
          id
          name
          currencyCode
        }
        discountedPrice {
          ...Money
        }
      }
      variants {
        id
        name
        sku
        images {
          id
          url
        }
      }
    }
    channelListing {
      ...ChannelListingProductVariantFragment
    }
    sku
    stocks {
      ...StockFragment
    }
    trackInventory
  }
`;
