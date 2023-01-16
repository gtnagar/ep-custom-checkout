import { LineItemMap, PhysicalItem, ShopperCurrency, StoreCurrency } from '@bigcommerce/checkout-sdk';
import React, { FunctionComponent, ReactNode, useEffect, useMemo } from 'react';

import OrderSummaryHeader from './OrderSummaryHeader';
import OrderSummaryItems from './OrderSummaryItems';
import OrderSummarySection from './OrderSummarySection';
import OrderSummarySubtotals, { OrderSummarySubtotalsProps } from './OrderSummarySubtotals';
import OrderSummaryTotal from './OrderSummaryTotal';
import removeBundledItems from './removeBundledItems';

export interface OrderSummaryProps {
    lineItems: LineItemMap;
    total: number;
    headerLink: ReactNode;
    storeCurrency: StoreCurrency;
    shopperCurrency: ShopperCurrency;
    additionalLineItems?: ReactNode;
}

const OrderSummary: FunctionComponent<OrderSummaryProps & OrderSummarySubtotalsProps> = ({
    storeCurrency,
    shopperCurrency,
    headerLink,
    additionalLineItems,
    lineItems,
    total,
    ...orderSummarySubtotalsProps
}) => {
    const nonBundledLineItems = useMemo(() => removeBundledItems(lineItems), [lineItems]);


    useEffect(() => {
        if (lineItems.physicalItems) {
            const controller = new AbortController();
            const signal = controller.signal;
            const cartItemsToCheck = lineItems.physicalItems

            cartItemsToCheck.forEach(async (item: PhysicalItem) => {
                const product_id = item.productId
                const token = await createStoreFrontToken(signal)

            });
        }

    }, [lineItems])




    async function createStoreFrontToken() {
    }

    return (
        <article className="cart optimizedCheckout-orderSummary" data-test="cart">
            <OrderSummaryHeader>{headerLink}</OrderSummaryHeader>

            <OrderSummarySection>
                <OrderSummaryItems items={nonBundledLineItems} />
            </OrderSummarySection>

            <OrderSummarySection>
                <OrderSummarySubtotals {...orderSummarySubtotalsProps} />
                {additionalLineItems}
            </OrderSummarySection>

            <OrderSummarySection>
                <OrderSummaryTotal
                    orderAmount={total}
                    shopperCurrencyCode={shopperCurrency.code}
                    storeCurrencyCode={storeCurrency.code}
                />
            </OrderSummarySection>
        </article>
    );
};

export default OrderSummary;
