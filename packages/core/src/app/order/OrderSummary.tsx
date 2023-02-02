import { LineItemMap, ShopperCurrency, StoreCurrency } from '@bigcommerce/checkout-sdk';
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

interface tokenProps {
    data: {
        token: string
    },
    meta: object
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
        const cartItemsToCheck = nonBundledLineItems.physicalItems

        if (cartItemsToCheck) {
            const controller = new AbortController();

            cartItemsToCheck.forEach(item => {
                const product_id = item.productId

                createStoreFrontToken(controller)
                    .then((token) => {
                        if (token) {
                            fetchProductWeight(token, product_id)
                                .then(() => {
                                    revokeStoreFrontToken(token)
                                })
                        }
                    })
            });
        }

    }, [nonBundledLineItems])



    const fetchProductWeight = async (token: string, product_id: any) => {
        const gql =
            `query productById {
        site {
          product(entityId: ${product_id}) {
            id
            entityId
            name
            plainTextDescription
           weight{
             ...DimensionFields
           }
          }
        }
      }
      
     
     fragment DimensionFields on Measurement {
       value
       unit
     }`

        const res = await fetch("/graphql", {
            method: 'POST',
            credentials: 'include',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ query: gql }),
        })
        const jsonData = await res.json()
        const product_weight = jsonData.data?.site?.product?.weight?.value
        console.log(jsonData, product_weight)
        let new_text = "Shipping"
        if (!product_weight) {
            new_text = "Estimated Shipping"
        }
        console.log(new_text)
        // modifyElement(new_text)
    }


    const createStoreFrontToken = async (controller: AbortController) => {
        let token = ""

        await fetch("https://silver-bushes-hang-120-72-21-235.loca.lt/token", { signal: controller.signal })
            .then((res) => {
                return res.json()
            })
            .then((res: tokenProps) => {
                token = res.data.token
            })
            .catch((reas) => {
                console.log(reas)
            })

        return token
    }

    const revokeStoreFrontToken = (token: string) => {

        fetch(
            "https://silver-bushes-hang-120-72-21-235.loca.lt/token",
            {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token
                })
            }
        )
            .then((res: any) => {
                return res?.data?.token
            })
            .catch((reas) => {
                console.log(reas)
            })
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
