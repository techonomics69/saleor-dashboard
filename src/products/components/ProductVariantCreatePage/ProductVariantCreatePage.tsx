import { ChannelPriceData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorFragment } from "@saleor/fragments/types/ProductErrorFragment";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { getVariantAttributeInputFromProduct } from "@saleor/products/utils/data";
import { createVariantChannelsChangeHandler } from "@saleor/products/utils/handlers";
import {
  validateCostPrice,
  validatePrice
} from "@saleor/products/utils/validation";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import React from "react";
import { useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { ProductVariantCreateData_product } from "../../types/ProductVariantCreateData";
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductVariantAttributes, {
  VariantAttributeInputData
} from "../ProductVariantAttributes";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";

interface ProductVariantCreatePageFormData {
  channelListing: ChannelPriceData[];
  images: string[];
  quantity: string;
  sku: string;
  trackInventory: boolean;
}

export interface ProductVariantCreatePageSubmitData
  extends ProductVariantCreatePageFormData {
  attributes: FormsetData<VariantAttributeInputData>;
  stocks: ProductStockInput[];
}

interface ProductVariantCreatePageProps {
  channels: ChannelPriceData[];
  channelErrors: ProductChannelListingErrorFragment[];
  disabled: boolean;
  errors: ProductErrorFragment[];
  header: string;
  product: ProductVariantCreateData_product;
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouses: SearchWarehouses_search_edges_node[];
  onBack: () => void;
  onSubmit: (data: ProductVariantCreatePageSubmitData) => void;
  onVariantClick: (variantId: string) => void;
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = ({
  channels,
  channelErrors,
  disabled,
  errors,
  header,
  product,
  saveButtonBarState,
  warehouses,
  onBack,
  onSubmit,
  onVariantClick
}) => {
  const intl = useIntl();
  const attributeInput = React.useMemo(
    () => getVariantAttributeInputFromProduct(product),
    [product]
  );
  const { change: changeAttributeData, data: attributes } = useFormset(
    attributeInput
  );
  const {
    add: addStock,
    change: changeStockData,
    data: stocks,
    remove: removeStock
  } = useFormset<null, string>([]);

  const initialForm: ProductVariantCreatePageFormData = {
    channelListing: channels,
    images: product?.images?.map(image => image.id),
    quantity: "0",
    sku: "",
    trackInventory: true
  };

  const handleSubmit = (data: ProductVariantCreatePageFormData) =>
    onSubmit({
      ...data,
      attributes,
      stocks
    });

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, hasChanged, set, submit, triggerChange }) => {
        const handleAttributeChange: FormsetChange = (id, value) => {
          changeAttributeData(id, value);
          triggerChange();
        };
        const handleChannelChange = createVariantChannelsChangeHandler(
          data,
          set,
          triggerChange
        );
        const formDisabled = data.channelListing?.some(
          channel =>
            validatePrice(channel.price) || validateCostPrice(channel.costPrice)
        );

        return (
          <Container>
            <AppHeader onBack={onBack}>{maybe(() => product.name)}</AppHeader>
            <PageHeader title={header} />
            <Grid variant="inverted">
              <div>
                <ProductVariantNavigation
                  fallbackThumbnail={maybe(() => product.thumbnail.url)}
                  variants={maybe(() => product.variants)}
                  onRowClick={(variantId: string) => {
                    if (product && product.variants) {
                      return onVariantClick(variantId);
                    }
                  }}
                />
              </div>
              <div>
                <ProductVariantAttributes
                  attributes={attributes}
                  disabled={disabled}
                  errors={errors}
                  onChange={handleAttributeChange}
                />
                <CardSpacer />
                <ProductVariantPrice
                  ProductVariantChannelListings={data.channelListing}
                  errors={channelErrors}
                  loading={disabled}
                  onChange={handleChannelChange}
                />
                <CardSpacer />
                <ProductStocks
                  data={data}
                  disabled={disabled}
                  onFormDataChange={change}
                  errors={errors}
                  stocks={stocks}
                  warehouses={warehouses}
                  onChange={(id, value) => {
                    triggerChange();
                    changeStockData(id, value);
                  }}
                  onWarehouseStockAdd={id => {
                    triggerChange();
                    addStock({
                      data: null,
                      id,
                      label: warehouses.find(warehouse => warehouse.id === id)
                        .name,
                      value: "0"
                    });
                  }}
                  onWarehouseStockDelete={id => {
                    triggerChange();
                    removeStock(id);
                  }}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || formDisabled || !onSubmit || !hasChanged}
              labels={{
                delete: intl.formatMessage({
                  defaultMessage: "Delete Variant",
                  description: "button"
                }),
                save: intl.formatMessage({
                  defaultMessage: "Save variant",
                  description: "button"
                })
              }}
              state={saveButtonBarState}
              onCancel={onBack}
              onSave={submit}
            />
          </Container>
        );
      }}
    </Form>
  );
};
ProductVariantCreatePage.displayName = "ProductVariantCreatePage";
export default ProductVariantCreatePage;
