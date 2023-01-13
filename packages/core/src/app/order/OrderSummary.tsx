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
        const today = new Date()
        const expiryDate = new Date(today)
        expiryDate.setMinutes(today.getMinutes() + 5)
        const timestamp = Math.floor(expiryDate.getTime() / 1000)

        const res = await fetch(`https://cors-anywhere-titus.fly.dev/https://api.bigcommerce.com/stores/z4nszmjida/v3/storefront/api-token`, {
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': 'go4gti32okubye0m7aiisgjkjm6dxhd'
            },
            method: 'POST',
            body: JSON.stringify({
                "allowed_cors_origins": [
                    "https://empire-pro-sandbox.mybigcommerce.com"
                ],
                "channel_id": 1,
                "expires_at": timestamp
            }),
        })
        const jsonData = await res.json()
        return jsonData.data.token
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
